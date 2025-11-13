import { useCallback, useEffect, useState } from 'react';

import { apiRequest } from '@/lib/api';

export interface ApiProject {
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

export interface Project {
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

type Status = 'idle' | 'loading' | 'success' | 'error';

export interface UseProjectsOptions {
  limit?: number;
  featuredOnly?: boolean;
  fallback?: Project[];
  enabled?: boolean;
  order?: 'admin' | 'latest';
}

export interface UseProjectsResult {
  projects: Project[];
  status: Status;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  error: string | null;
  isFallback: boolean;
  refetch: () => void;
}

const normalizeProject = (project: ApiProject): Project => ({
  id: project.id,
  title: project.title,
  description: project.description,
  category: project.category,
  tags: project.tags ?? [],
  image: project.image,
  mobileImage: project.mobile_image ?? undefined,
  gallery: project.gallery ?? undefined,
  metrics: project.metrics ?? undefined,
  longDescription: project.long_description ?? undefined,
  websiteUrl: project.website_url ?? undefined,
  videoSrc: project.video_src ?? undefined,
  isFeatured: Boolean(project.is_featured),
  featuredOrder: project.featured_order,
});

const withLimit = (list: Project[], limit?: number) => {
  if (typeof limit !== 'number') return list;
  return list.slice(0, limit);
};

export const useProjects = (options: UseProjectsOptions = {}): UseProjectsResult => {
  const { limit, featuredOnly = false, fallback = [], enabled = true, order } = options;
  const [projects, setProjects] = useState<Project[]>(withLimit(fallback, limit));
  const [status, setStatus] = useState<Status>(fallback.length ? 'success' : 'idle');
  const [error, setError] = useState<string | null>(null);
  const [isFallback, setIsFallback] = useState<boolean>(Boolean(fallback.length));
  const [reloadIndex, setReloadIndex] = useState(0);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const controller = new AbortController();
    const params = new URLSearchParams();
    if (featuredOnly) params.set('featured', 'true');
    if (limit) params.set('limit', String(limit));
    if (order) params.set('order', order);
    params.set('t', Date.now().toString());
    const queryString = params.toString();
    const path = `/api/projects${queryString ? `?${queryString}` : ''}`;

    const load = async () => {
      setStatus((prev) => (prev === 'loading' ? prev : 'loading'));
      setError(null);
      setIsFallback(false);
      setProjects([]);

      try {
        const data = await apiRequest<ApiProject[]>(path, {
          method: 'GET',
          cache: 'no-store',
          signal: controller.signal,
        });

        const normalized = withLimit((data || []).map(normalizeProject), limit);
        setProjects(normalized);
        setStatus('success');
      } catch (err) {
        if (controller.signal.aborted) {
          return;
        }

        const message = err instanceof Error ? err.message : 'Failed to load projects';
        setError(message);

        if (fallback.length) {
          setProjects(withLimit(fallback, limit));
          setIsFallback(true);
          setStatus('success');
        } else {
          setProjects([]);
          setStatus('error');
        }
      }
    };

    load();

    return () => controller.abort();
  }, [enabled, featuredOnly, limit, fallback, order, reloadIndex]);

  const refetch = useCallback(() => {
    setReloadIndex((prev) => prev + 1);
  }, []);

  return {
    projects,
    status,
    isLoading: status === 'loading',
    isSuccess: status === 'success',
    isError: status === 'error',
    error,
    isFallback,
    refetch,
  };
};

