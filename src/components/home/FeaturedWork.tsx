// src/components/home/FeaturedWork.tsx

'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, ExternalLink, RefreshCw } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DevicePreview } from '@/components/ui/device-preview';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useProjects, type Project } from '@/hooks/useProjects';
import { projects as staticProjects } from '@/data/projects';
import { adaptStaticProject } from '@/utils/project-adapters';
const getFallbackProjects = (limit: number): Project[] =>
  [...staticProjects]
    .map((project, index) => ({ project, index }))
    .sort((a, b) => {
      const orderA = typeof a.project.featuredOrder === 'number' ? a.project.featuredOrder : a.index + 1000;
      const orderB = typeof b.project.featuredOrder === 'number' ? b.project.featuredOrder : b.index + 1000;
      return orderA - orderB;
    })
    .slice(0, limit)
    .map(({ project }, index) => adaptStaticProject(project, index));

const FeaturedProjectSkeleton = () => (
  <Card className="h-full overflow-hidden border-border/50">
    <div className="aspect-video bg-muted/60" />
    <CardContent className="p-6 space-y-4">
      <Skeleton className="h-5 w-24" />
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
      <div className="flex gap-2">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-6 w-20" />
      </div>
      <Skeleton className="h-10 w-full" />
    </CardContent>
  </Card>
);

export const FeaturedWork = () => {
  const maxProjects = 3;
  const fallbackProjects = useMemo(() => getFallbackProjects(maxProjects), []);

  const { projects: projectsToShow, isLoading, isError, error, isFallback, refetch } = useProjects({
    featuredOnly: false,
    limit: maxProjects,
    order: 'admin',
    fallback: fallbackProjects,
  });

  const hasProjects = projectsToShow.length > 0;
  const skeletonCount = Math.max(projectsToShow.length || fallbackProjects.length || 6, 3);

  return (
    <section className="py-24 bg-secondary/40 dark:bg-secondary/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-display-sm font-display mb-4">
            Featured <span className="text-gradient">Work</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Explore our newest projects showcasing cutting-edge web experiences
          </p>
        </motion.div>

        <div className="mb-12 text-center text-sm text-muted-foreground">
          Projects appear in the sequence arranged in the admin panel.
        </div>

        {isFallback && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-8 rounded-lg border border-border/60 bg-background/60 px-6 py-4 text-sm text-muted-foreground shadow-sm"
          >
            We&apos;re showing a curated selection while we reconnect to the live portfolio.
          </motion.div>
        )}

        {isError && !hasProjects && (
          <div className="mb-12 flex flex-col items-center justify-center gap-4 rounded-lg border border-destructive/40 bg-destructive/10 p-6 text-center">
            <div className="text-destructive font-medium">We couldn&apos;t load our featured projects.</div>
            <p className="text-sm text-muted-foreground">
              {error ?? 'Please try again in a moment or view all projects from the work page.'}
            </p>
            <Button variant="outline" size="sm" onClick={refetch} className="inline-flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {isLoading
            ? Array.from({ length: skeletonCount }).map((_, index) => (
              <motion.div
                key={`skeleton-${index}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <FeaturedProjectSkeleton />
              </motion.div>
            ))
            : projectsToShow.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.15,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <Link href={`/work/${project.id}`}>
                  <Card className="group overflow-hidden border-border/60 dark:border-border/50 hover:border-primary/60 dark:hover:border-primary/50 transition-all hover:shadow-glow h-full bg-card/50 dark:bg-card">
                    <div className="aspect-video relative overflow-hidden rounded-t-lg bg-zinc-900 dark:bg-zinc-900">
                      <div className="absolute left-4 top-4 z-10">
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border/70 dark:border-border/60 bg-background/90 dark:bg-background/70 text-sm font-semibold text-primary shadow-lg backdrop-blur-sm dark:backdrop-blur">
                          {index + 1}
                        </span>
                      </div>

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

                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 dark:from-black/30 via-transparent to-transparent pointer-events-none" />

                      <div className="absolute top-4 right-4">
                        <ExternalLink className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <div className="mb-4 flex items-center justify-between">
                        <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                          {project.category}
                        </Badge>
                        {project.metrics && (
                          <div className="text-right">
                            <div className="text-xs uppercase tracking-wide text-muted-foreground">Result</div>
                            <div className="text-sm font-semibold text-primary">
                              {project.metrics.improvement}
                            </div>
                            <div className="text-xs text-muted-foreground">{project.metrics.metric}</div>
                          </div>
                        )}
                      </div>

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
                      <div className="flex items-center justify-between gap-4 pt-4 border-t border-border/70 dark:border-border/60">
                        <div className="text-sm font-medium text-primary inline-flex items-center gap-2">
                          View Case Study
                          <ArrowRight className="h-4 w-4" />
                        </div>
                        {project.websiteUrl && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              window.open(project.websiteUrl, '_blank', 'noopener,noreferrer');
                            }}
                          >
                            Visit Site
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
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
            href="/work"
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