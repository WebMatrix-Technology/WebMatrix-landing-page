// Client-side content store backed by localStorage
import { projects as seedProjects, Project } from '@/data/projects';

export type BlogPost = {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  date: string; // ISO
  readTime: string;
  tags: string[];
};

const LS_PROJECTS = 'content_projects';
const LS_POSTS = 'content_posts';
const LS_LEADS = 'content_leads';

export type Lead = {
  id: number;
  name: string;
  email: string;
  budget?: string;
  timeline?: string;
  message: string;
  createdAt: string; // ISO
};

function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJSON<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore storage errors
  }
}

// Seed blog posts (from the current hardcoded Blog page)
const seedPosts: BlogPost[] = [
  { id: 1, title: 'Building Performant 3D Web Experiences with Three.js', excerpt: 'Learn best practices for creating smooth, optimized 3D web applications that run at 60fps.', category: 'Tutorial', date: '2024-01-15', readTime: '8 min', tags: ['Three.js', 'WebGL', 'Performance'] },
  { id: 2, title: 'The Future of Web Animations: Framer Motion vs GSAP', excerpt: 'A comprehensive comparison of two leading animation libraries for modern web development.', category: 'Comparison', date: '2024-01-10', readTime: '6 min', tags: ['Framer Motion', 'GSAP', 'Animations'] },
  { id: 3, title: 'Achieving 100 Lighthouse Score: A Complete Guide', excerpt: 'Step-by-step strategies for optimizing your website to achieve perfect Lighthouse scores.', category: 'Guide', date: '2024-01-05', readTime: '10 min', tags: ['Performance', 'SEO', 'Best Practices'] },
  { id: 4, title: 'Implementing Micro-interactions That Delight Users', excerpt: 'How subtle animations and transitions can significantly improve user experience.', category: 'Design', date: '2023-12-28', readTime: '5 min', tags: ['UX', 'Design', 'Interactions'] },
  { id: 5, title: 'Modern CSS: Grid, Flexbox, and Container Queries', excerpt: 'Master modern CSS layout techniques for building responsive, maintainable interfaces.', category: 'Tutorial', date: '2023-12-20', readTime: '7 min', tags: ['CSS', 'Layout', 'Responsive'] },
  { id: 6, title: 'WebGL Shaders: From Basics to Advanced Techniques', excerpt: 'Dive deep into shader programming and create stunning visual effects for the web.', category: 'Advanced', date: '2023-12-15', readTime: '12 min', tags: ['WebGL', 'Shaders', 'Graphics'] },
];

export function getProjects(): Project[] {
  const projects = readJSON<Project[]>(LS_PROJECTS, seedProjects);
  // Ensure gallery exists from legacy fields
  return projects.map(p => ({
    ...p,
    gallery: p.gallery && p.gallery.length ? p.gallery : [p.image, p.mobileImage || ''].filter(Boolean) as string[],
  }));
}

export function saveProjects(next: Project[]) {
  writeJSON<Project[]>(LS_PROJECTS, next);
}

export function getPosts(): BlogPost[] {
  return readJSON<BlogPost[]>(LS_POSTS, seedPosts);
}

export function savePosts(next: BlogPost[]) {
  writeJSON<BlogPost[]>(LS_POSTS, next);
}

export function getLeads(): Lead[] {
  return readJSON<Lead[]>(LS_LEADS, []);
}

export function saveLeads(next: Lead[]) {
  writeJSON<Lead[]>(LS_LEADS, next);
}

export function addLead(lead: Omit<Lead, 'id' | 'createdAt'> & Partial<Pick<Lead, 'createdAt'>>) {
  const all = getLeads();
  const id = Date.now();
  const createdAt = lead.createdAt || new Date().toISOString();
  const next = [{ id, createdAt, ...lead } as Lead, ...all];
  saveLeads(next);
  return id;
}

