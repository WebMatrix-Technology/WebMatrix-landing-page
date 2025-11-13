import { useMemo } from 'react';
import { motion } from 'framer-motion';

import { DevicePreview } from '@/components/ui/device-preview';
import { Skeleton } from '@/components/ui/skeleton';
import { useProjects } from '@/hooks/useProjects';
import { projects as staticProjects } from '@/data/projects';
import { adaptStaticProject } from '@/utils/project-adapters';

const PreviewSkeleton = () => (
  <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl border border-border/40 bg-background/60 px-6 py-10 shadow-lg sm:px-12 sm:py-12">
    <Skeleton className="mx-auto h-56 w-full rounded-xl sm:h-64" />
  </div>
);

export const PreviewSection = () => {
  const fallbackProject = useMemo(() => {
    const sorted =
      [...staticProjects]
        .filter((project) => project.isFeatured ?? true)
        .sort((a, b) => {
          const orderA = typeof a.featuredOrder === 'number' ? a.featuredOrder : Number.MAX_SAFE_INTEGER;
          const orderB = typeof b.featuredOrder === 'number' ? b.featuredOrder : Number.MAX_SAFE_INTEGER;
          return orderA - orderB;
        }) || [];

    if (sorted.length > 0) {
      return [adaptStaticProject(sorted[0], 0)];
    }

    const fallback = staticProjects[0];
    return fallback ? [adaptStaticProject(fallback, 0)] : [];
  }, []);

  const { projects, isLoading } = useProjects({
    limit: 1,
    featuredOnly: true,
    order: 'admin',
    fallback: fallbackProject,
  });

  const project = projects[0];
  const projectDomain = useMemo(() => {
    if (!project?.websiteUrl) return null;

    try {
      const url = new URL(project.websiteUrl);
      return url.hostname.replace(/^www\./, '');
    } catch (err) {
      return project.websiteUrl.replace(/^https?:\/\//, '');
    }
  }, [project?.websiteUrl]);

  return (
    <section className="relative overflow-hidden py-14 sm:py-16">
      <div className="container mx-auto mb-8 max-w-3xl px-4 text-center sm:mb-10">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="space-y-4"
        >
          <h2 className="font-display text-[1.9rem] leading-tight sm:text-3xl md:text-4xl">
            Latest <span className="text-gradient">Work</span>
          </h2>
          <p className="mx-auto max-w-xl text-sm text-muted-foreground sm:text-base">
            A quick look at the featured product experience we&apos;re showcasing right now.
          </p>
        </motion.div>
      </div>

      {isLoading && !project && <PreviewSkeleton />}

      {!isLoading && project && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative mx-auto max-w-6xl overflow-visible rounded-[1.4rem] border border-border/50 bg-gradient-to-br from-background/95 via-background/80 to-background/95 shadow-[0_24px_70px_-52px_rgba(59,130,246,0.5)] backdrop-blur-xl"
        >
          <div className="absolute inset-0">
            <div className="absolute -left-20 top-1/3 h-[260px] w-[260px] rounded-full bg-primary/25 opacity-30 blur-[120px]" />
            <div className="absolute right-[-18%] bottom-[-10%] h-[260px] w-[260px] rounded-full bg-accent/20 opacity-30 blur-[150px]" />
          </div>

          <div className="relative px-3 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10">
            <div className="group relative mx-auto max-w-4xl overflow-visible rounded-[1.25rem] border border-border/60 bg-background/90 px-4 py-6 shadow-[0_20px_55px_-38px_rgba(15,23,42,0.55)] sm:px-6 sm:py-8">
              <div className="pointer-events-none absolute -top-14 left-1/2 h-28 w-28 -translate-x-1/2 rounded-full bg-primary/20 blur-[80px]" />
              <div className="pointer-events-none absolute -bottom-16 right-4 h-32 w-32 rounded-full bg-accent/20 blur-[100px]" />
              <div className="pointer-events-none absolute inset-0 border border-white/5 opacity-10" />

              <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 text-[0.58rem] uppercase tracking-[0.32em] text-muted-foreground/60 sm:flex-nowrap">
                <span>Live Preview</span>
                <span className="font-medium text-muted-foreground/45">Desktop · Mobile</span>
              </div>

              <div className="relative z-10 mt-5 sm:mt-6">
                <DevicePreview
                  desktopImage={project.image}
                  mobileImage={project.mobileImage}
                  title={project.title}
                  className="mx-auto max-w-full overflow-visible transition-transform duration-500 ease-out group-hover:-translate-y-2"
                  display="both"
                />
                <div className="pointer-events-none absolute left-1/2 top-full hidden h-24 w-5/6 -translate-x-1/2 -translate-y-3 rounded-full bg-primary/15 blur-2xl sm:block" />
              </div>

              <div className="relative z-10 mt-5 flex flex-col gap-2 text-[0.68rem] text-muted-foreground/70 sm:mt-6 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
                <span className="inline-flex w-fit items-center gap-2 rounded-full border border-border/60 bg-background/70 px-3 py-1 text-[0.58rem] uppercase tracking-[0.3em] sm:text-[0.62rem]">
                  Featured Preview
                </span>
                <div className="flex flex-wrap items-center gap-2 text-[0.7rem] sm:text-[0.75rem]">
                  <span className="max-w-[12rem] truncate font-medium text-muted-foreground sm:max-w-[16rem]">
                    {project.title}
                  </span>
                  {projectDomain && (
                    <span className="inline-flex max-w-[10rem] items-center gap-1.5 truncate text-primary/80 sm:max-w-[14rem]">
                      <span className="text-border/60">/</span>
                      <span className="truncate">{projectDomain}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </section>
  );
};