import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import { createClient } from "@supabase/supabase-js";
import { createHash } from "node:crypto";

const rateLimitMaxRequests = 10;
const rateLimitWindowSeconds = 60 * 60;
const maxQuestionLength = 200;
const minimumRetrievalSimilarity = 0.6;
const maximumSimilarityDropFromBest = 0.04;
const outOfTokensMessage = "Oops sorry, I am out of tokens, sorry about that :P";

// These replies are intentionally deterministic: a simple "hi" should not
// make the model answer an unasked question such as "how are you?".
function getCasualReply(question: string) {
  const message = question.trim().toLowerCase().replace(/[!?.]/g, "").trim();

  if (/^(?:h+i+|he+y+|hello+|hiya+)$/.test(message)) {
    return "Hiii! It’s so great to meet you. Feel free to ask me about my work, projects, experience, education, or skills!";
  }

  if (/^(?:how are you|how are you doing|how r u|hows it going|how's it going|whats up|what's up)$/.test(message)) {
    return "I’m doing well, thank you for asking! I’d love to tell you about my work, projects, or experience.";
  }

  if (/^(?:thank you|thanks|ty)$/.test(message)) {
    return "You’re very welcome! Feel free to ask me anything about my portfolio.";
  }

  if (/^(?:bye|goodbye|see you)$/.test(message)) {
    return "Bye! Thanks for visiting my portfolio — I hope you enjoyed exploring my work!";
  }

  return undefined;
}

/**
 * Vector search always returns the closest records, even when none are a
 * meaningful match. Keep only strong sources that are also close to the best
 * result, so unrelated portfolio entries cannot steer the answer.
 */
function selectRelevantChunks(chunks: PortfolioChunk[]) {
  const bestSimilarity = chunks[0]?.similarity;
  if (bestSimilarity === undefined || bestSimilarity < minimumRetrievalSimilarity) return [];

  const cutoff = Math.max(
    minimumRetrievalSimilarity,
    bestSimilarity - maximumSimilarityDropFromBest,
  );

  return chunks.filter((chunk) => chunk.similarity >= cutoff);
}

function isQuotaError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  return /resource[_ ]exhausted|quota|token limit|rate limit|status.?429|\b429\b/i.test(
    message,
  );
}

type PortfolioChunk = {
  title: string;
  source: string;
  content: string;
  similarity: number;
  metadata: {
    section?: string;
  };
};

function createClientFingerprint(request: Request, salt: string) {
  const forwardedFor =
    request.headers.get("x-forwarded-for") ??
    request.headers.get("x-real-ip") ??
    "unknown";
  const clientIp = forwardedFor.split(",")[0].trim();

  return createHash("sha256").update(`${salt}:${clientIp}`).digest("hex");
}

export const prerender = false;

export async function POST({ request }: { request: Request }) {
  try {
    const body = await request.json().catch(() => null);
    const question = body?.question;

    if (typeof question !== "string" || question.trim().length === 0) {
      return Response.json({ error: "Please provide a question." }, { status: 400 });
    }

    if (question.length > maxQuestionLength) {
      return Response.json(
        { error: `Questions must be ${maxQuestionLength} characters or fewer.` },
        { status: 400 },
      );
    }

    const geminiApiKey = process.env.GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY;
    const supabaseUrl = process.env.SUPABASE_URL || import.meta.env.SUPABASE_URL;
    const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY || import.meta.env.SUPABASE_SECRET_KEY;
    const rateLimitSalt = process.env.CHAT_RATE_LIMIT_SALT || import.meta.env.CHAT_RATE_LIMIT_SALT;

    if (!geminiApiKey || !supabaseUrl || !supabaseSecretKey || !rateLimitSalt) {
      console.error("Chat API is missing server environment variables.");
      return Response.json(
        { error: "The chat service is not configured." },
        { status: 500 },
      );
    }

    const ai = new GoogleGenAI({ apiKey: geminiApiKey });
    const supabase = createClient(supabaseUrl, supabaseSecretKey);

    const { data: allowed, error: rateLimitError } = await supabase.rpc(
      "check_chat_rate_limit",
      {
        p_fingerprint: createClientFingerprint(request, rateLimitSalt),
        p_limit: rateLimitMaxRequests,
        p_window_seconds: rateLimitWindowSeconds,
      },
    );

    if (rateLimitError) throw rateLimitError;

    if (!allowed) {
      return Response.json(
        { error: outOfTokensMessage },
        {
          status: 429,
          headers: { "Retry-After": String(rateLimitWindowSeconds) },
        },
      );
    }

    const casualReply = getCasualReply(question);
    if (casualReply) {
      return Response.json({ answer: casualReply, sources: [] });
    }

    let chunks: PortfolioChunk[] = [];

    const embeddingResponse = await ai.models.embedContent({
      model: "gemini-embedding-2",
      contents: question,
      config: {
        taskType: "RETRIEVAL_QUERY",
        outputDimensionality: 768,
      },
    });

    const queryEmbedding = embeddingResponse.embeddings?.[0]?.values;

    if (!queryEmbedding) {
      throw new Error("Gemini did not return a query embedding.");
    }

    const { data, error } = await supabase.rpc("match_portfolio_chunks", {
      query_embedding: queryEmbedding,
      match_count: 4,
    });

    if (error) throw error;
    chunks = selectRelevantChunks((data ?? []) as PortfolioChunk[]);

    const context = chunks
      .map(
        (chunk, index) =>
          `[Source ${index + 1}: ${chunk.title} | ${chunk.source}]\n${chunk.content}`,
      )
      .join("\n\n---\n\n");

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: `Visitor question: ${question}\n\nPortfolio context:\n${context}`,
      config: {
        systemInstruction: `
You are Sreejita Saha's portfolio assistant. Speak as Sreejita in the first person: use wording such as "I built", "I worked on", and "my experience". Never describe Sreejita in the third person.

Be warm, upbeat, and natural, with a little personality. For greetings, thanks, and goodbyes, reply briefly and warmly to exactly what the visitor said. Do not answer a question they did not ask: for example, if they say "hi", greet them back but do not say that you are doing well or thank them for asking. Only answer "How are you?" when the visitor actually asks it. You may invite the visitor to ask about my work afterwards.

For questions about my background, projects, experience, education, or skills, answer only from the supplied portfolio context. Prioritise the most directly relevant information and make the answer clear and specific.
If a portfolio question is not covered by the context, say you do not have that detail rather than guessing.
If a question is unrelated to my portfolio (for example, live news, today's date, weather, or general trivia), gently say: "I’m here to chat about my portfolio, projects, experience, education, and skills."
Do not invent skills, dates, achievements, links, or personal information.
Keep answers concise, friendly, and professional.
Do not mention "the context", "retrieval", or "sources" in the answer.
        `.trim(),
        thinkingConfig: { thinkingLevel: ThinkingLevel.MINIMAL },
        temperature: 0.45,
        maxOutputTokens: 220,
      },
    });

    return Response.json({
      answer:
        response.text?.trim() ||
        "I could not generate an answer from the available portfolio information.",
      sources: chunks.map(({ title, source, similarity, metadata }) => ({
        title,
        source,
        similarity,
        metadata,
      })),
    });
  } catch (error) {
    console.error("Chat request failed:", error);

    return Response.json(
      {
        error: isQuotaError(error)
          ? outOfTokensMessage
          : "The chat service is temporarily unavailable.",
      },
      { status: isQuotaError(error) ? 429 : 500 },
    );
  }
}


