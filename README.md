# Sreejita's portfolio

## Portfolio assistant

The chat uses the existing portfolio knowledge base in Supabase and Gemini. It requires the `portfolio_chunks` data, `match_portfolio_chunks` function, and `check_chat_rate_limit` function from the existing portfolio project. Index the knowledge base in that project before using chat. Updates to website content do not automatically update the knowledge base.

Copy `.env.example` to `.env` and set the four server-side values. Use the URL and secret key for the same Supabase project as the existing assistant. Do not expose the secret key or Gemini key through `PUBLIC_` or `VITE_` variables. A shared `CHAT_RATE_LIMIT_SALT` makes the two sites share the 10 requests per hour per visitor limit; use a different random salt for a separate limit.

Run `npm install` and `npm run dev` for local development. The site uses the Astro Vercel adapter for the server endpoint; configure the same environment variables in Vercel for deployment. The endpoint requires a server runtime and will not work on static-only hosting. Each question is sent independently, so follow-up questions should include enough context to stand alone.
