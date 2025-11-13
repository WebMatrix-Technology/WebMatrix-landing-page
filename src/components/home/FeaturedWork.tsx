// src/components/home/FeaturedWork.tsx

import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { apiRequest } from '@/lib/api';
import { DevicePreview } from '@/components/ui/device-preview';
import { useEffect, useState } from 'react';

interface ApiProject {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[] | null;
  image: string;
  mobile_image: string | null;
  gallery: string[] | null;
  metrics: { improvement: string; metric: string } | null;
  long_description: string | null;
  website_url: string | null;
  video_src: string | null;
  is_featured: boolean | null;
  featured_order: number | null;
}

interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  image: string;
  mobileImage?: string;
  gallery?: string[];
  metrics?: { improvement: string; metric: string };
  longDescription?: string;
  websiteUrl?: string;
  videoSrc?: string;
  isFeatured: boolean;
  featuredOrder: number | null;
}

export const FeaturedWork = () => {
  const [projectsToShow, setProjectsToShow] = useState<Project[]>([]);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        // Add cache-busting to ensure fresh data
        const timestamp = new Date().getTime();
        const data = await apiRequest<ApiProject[]>(`/api/projects?t=${timestamp}`, { 
          method: 'GET',
          cache: 'no-store' 
        });
        
        const allProjects: Project[] = (data || []).map((p) => ({
          id: p.id,
          title: p.title,
          description: p.description,
          category: p.category,
          tags: p.tags ?? [],
          image: p.image,
          mobileImage: p.mobile_image ?? undefined,
          gallery: p.gallery ?? undefined,
          metrics: p.metrics ?? undefined,
          longDescription: p.long_description ?? undefined,
          websiteUrl: p.website_url ?? undefined,
          videoSrc: p.video_src ?? undefined,
          isFeatured: Boolean(p.is_featured),
          featuredOrder: p.featured_order,
        }));

        console.log('[FeaturedWork] All projects loaded:', allProjects.length);
        console.log('[FeaturedWork] First 3 projects:', allProjects.slice(0, 3).map(p => ({ id: p.id, title: p.title })));

        // Always show the latest three projects (API already returns newest first)
        const latest = allProjects.slice(0, 3);
        setProjectsToShow(latest);
      } catch (err) {
        console.error('Failed to load projects:', err);
        setProjectsToShow([]);
      }
    };
    loadProjects();
  }, []);

  return (
    <section className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-display-sm font-display mb-4">
            Latest <span className="text-gradient">Work</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Explore our newest projects showcasing cutting-edge web experiences
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {projectsToShow.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.15,
                ease: [0.22, 1, 0.36, 1]
              }}
            >
              <Link to={`/work/${project.id}`}>
                <Card className="group overflow-hidden border-border/50 hover:border-primary/50 transition-all hover:shadow-glow h-full">
                  <div className="aspect-video relative overflow-hidden rounded-t-lg bg-zinc-900">
                    <div className="absolute inset-0 p-6 flex items-center justify-center">
                      <div className="w-full">
                        <DevicePreview
                          desktopImage={project.image}
                          mobileImage={project.mobileImage}
                          title={project.title}
                          className="mx-auto"
                          display="both"
                        />
                      </div>
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />

                    <div className="absolute top-4 right-4">
                      <ExternalLink className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-display font-semibold mb-2 group-hover:text-gradient transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-muted-foreground mb-4">{project.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    {project.metrics && (
                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        <div>
                          <div className="text-2xl font-bold text-primary">{project.metrics.improvement}</div>
                          <div className="text-xs text-muted-foreground">{project.metrics.metric}</div>
                        </div>
                        <div className="text-primary text-sm font-medium">
                          View Case Study →
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center"
        >
          <Link 
            to="/work"
            className="inline-flex items-center gap-2 text-primary hover:text-accent transition-colors font-medium"
          >
            View All Projects
            <ArrowRight className="h-5 w-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};