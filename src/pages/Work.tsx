// src/pages/Work.tsx

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { apiRequest } from '@/lib/api';
import { DevicePreview } from '@/components/ui/device-preview';
import { useEffect, useState } from 'react';

type ApiProject = {
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
};

type Project = {
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
};

const Work = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true);
        const data = await apiRequest<ApiProject[]>('/api/projects', { method: 'GET' });
        const mappedProjects: Project[] = (data || []).map((p) => ({
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
        setProjects(mappedProjects);
      } catch (err) {
        console.error('Failed to load projects:', err);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };
    loadProjects();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-24">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Loading projects...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl lg:text-display-lg font-display mb-6">
            Our <span className="text-gradient">Work</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Explore our portfolio of successful projects across various industries
          </p>
        </motion.div>

        {projects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No projects available at the moment.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={`/work/${project.id}`}>
                <Card className="group overflow-hidden border-border/50 hover:border-primary/50 transition-all hover:shadow-glow h-full">
                  <div className="aspect-video relative overflow-hidden rounded-t-lg bg-zinc-900">
                    {/* Device previews */}
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

                    {/* Dark gradient overlay for contrast */}
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
        )}
      </div>
    </div>
  );
};

export default Work;