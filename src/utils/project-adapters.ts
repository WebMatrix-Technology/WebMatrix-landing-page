import type { Project as StaticProject } from '@/data/projects';
import type { Project } from '@/hooks/useProjects';

export const adaptStaticProject = (project: StaticProject, fallbackIndex = 0): Project => ({
  id: String(project.id),
  title: project.title,
  description: project.description,
  category: project.category,
  tags: project.tags ?? [],
  image: project.image,
  mobileImage: project.mobileImage,
  gallery: project.gallery,
  metrics: project.metrics,
  longDescription: project.longDescription,
  websiteUrl: project.websiteUrl,
  videoSrc: project.videoSrc,
  isFeatured: project.isFeatured ?? true,
  featuredOrder: project.featuredOrder ?? fallbackIndex,
});

