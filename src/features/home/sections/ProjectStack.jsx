import ScrollStack, { ScrollStackItem } from '../../../components/ui/ScrollStack.jsx';

export default function ProjectStack({ projects }) {
  return (
    <ScrollStack useWindowScroll smoothScroll={false} itemDistance={90} itemStackDistance={12} stackPosition="10%" itemScale={0.025} baseScale={0.9} dimAmount={0.12} holdDistance={80}>
      {projects.map(project => (
        <ScrollStackItem key={project.number} itemClassName="project-card">
          <article className="project-card__content">
            <div className="project-card__top"><span>{project.number} / 08</span><span>{project.category}</span></div>
            <div className="project-card__body">
              <div><h3>{project.name}</h3><p className="project-card__summary">{project.description}</p></div>
              <div className="project-card__detail"><p>{project.details}</p><div className="tags">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div></div>
            </div>
          </article>
        </ScrollStackItem>
      ))}
    </ScrollStack>
  );
}
