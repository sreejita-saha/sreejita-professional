export type ProjectVisual = 'blue' | 'orange' | 'violet';

export interface Project {
  number: string;
  name: string;
  description: string;
  tags: string[];
  visual: ProjectVisual;
}

export interface Capability {
  number: string;
  title: string;
  description: string;
}

export const projects: Project[] = [
  {
    number: '01',
    name: 'Northstar',
    description: 'A calmer way for distributed teams to turn messy ideas into a shared direction.',
    tags: ['Product design', 'React', 'Systems'],
    visual: 'blue',
  },
  {
    number: '02',
    name: 'Pulse',
    description: 'A live operations dashboard that makes complex signals easier to read at a glance.',
    tags: ['Data viz', 'TypeScript', 'Motion'],
    visual: 'orange',
  },
  {
    number: '03',
    name: 'Common Ground',
    description: 'A digital toolkit for finding focus when the blank page feels too loud.',
    tags: ['Frontend', 'UX', 'Research'],
    visual: 'violet',
  },
];

export const capabilities: Capability[] = [
  { number: '01', title: 'Frontend engineering', description: 'React · TypeScript · HTML/CSS · Accessibility' },
  { number: '02', title: 'Product thinking', description: 'Prototyping · UX · Design systems · Research' },
  { number: '03', title: 'Reliable delivery', description: 'Testing · APIs · Documentation · Collaboration' },
];
