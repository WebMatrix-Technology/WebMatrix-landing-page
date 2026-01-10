'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { apiRequest } from '@/lib/api';
import { useAdminAuth } from '@/contexts/AdminAuth';
import { Loader2, FolderKanban, FileText, Mail, TrendingUp, Clock, ArrowRight, User } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

type DashboardStats = {
  projects: {
    total: number;
    today: number;
  };
  posts: {
    total: number;
    today: number;
  };
  leads: {
    total: number;
    today: number;
    thisWeek: number;
  };
  recent: {
    projects: Array<{ id: string; title: string; created_at: string }>;
    posts: Array<{ id: string; title: string; created_at: string; published_at: string | null }>;
    leads: Array<{ id: string; name: string; email: string; created_at: string }>;
  };
};

export default function AdminDashboardPage() {
  const { getAccessToken } = useAdminAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const token = await getAccessToken();
      if (!token) throw new Error('Session expired. Please log in again.');
      const data = await apiRequest<DashboardStats>('/api/dashboard', {}, token);
      setStats(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load dashboard stats.';
      console.error('Dashboard fetch error:', err);
      
      if (errorMessage.includes('Not found') || errorMessage.includes('404')) {
        toast.error('Dashboard API endpoint not found. Please ensure the server is running.');
      } else {
        toast.error(errorMessage);
      }
      
      setStats({
        projects: { total: 0, today: 0 },
        posts: { total: 0, today: 0 },
        leads: { total: 0, today: 0, thisWeek: 0 },
        recent: { projects: [], posts: [], leads: [] },
      });
    } finally {
      setLoading(false);
    }
  }, [getAccessToken]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-display">Dashboard</h1>
        <div className="text-center py-12">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-display">Dashboard</h1>
        <Card className="border-border/50">
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Failed to load dashboard data.</p>
            <Button onClick={fetchStats} className="mt-4" variant="outline">
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Overview of your content and leads</p>
        </div>
        <Button onClick={fetchStats} variant="outline" size="sm">
          Refresh
        </Button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="border-border/50 hover:border-primary/50 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <FolderKanban className="h-6 w-6 text-primary" />
              </div>
              <Link href="/admin/projects">
                <Button variant="ghost" size="sm">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Projects</p>
              <p className="text-3xl font-bold">{stats.projects.total}</p>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3" />
                <span>{stats.projects.today} added today</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 hover:border-primary/50 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                <FileText className="h-6 w-6 text-accent" />
              </div>
              <Link href="/admin/posts">
                <Button variant="ghost" size="sm">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Blog Posts</p>
              <p className="text-3xl font-bold">{stats.posts.total}</p>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3" />
                <span>{stats.posts.today} added today</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 hover:border-primary/50 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 rounded-lg bg-success/10 flex items-center justify-center">
                <Mail className="h-6 w-6 text-success" />
              </div>
              <Link href="/admin/leads">
                <Button variant="ghost" size="sm">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Leads</p>
              <p className="text-3xl font-bold">{stats.leads.total}</p>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3" />
                <span>{stats.leads.thisWeek} this week</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FolderKanban className="h-5 w-5" />
              Recent Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats.recent.projects.length === 0 ? (
              <p className="text-sm text-muted-foreground">No projects yet</p>
            ) : (
              <div className="space-y-3">
                {stats.recent.projects.map((project) => (
                  <div key={project.id} className="flex items-start justify-between gap-2 pb-3 border-b border-border/30 last:border-0 last:pb-0">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{project.title}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <Clock className="h-3 w-3" />
                        {formatDate(project.created_at)}
                      </p>
                    </div>
                  </div>
                ))}
                <Link href="/admin/projects">
                  <Button variant="ghost" size="sm" className="w-full mt-2">
                    View All <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Recent Posts
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats.recent.posts.length === 0 ? (
              <p className="text-sm text-muted-foreground">No posts yet</p>
            ) : (
              <div className="space-y-3">
                {stats.recent.posts.map((post) => (
                  <div key={post.id} className="flex items-start justify-between gap-2 pb-3 border-b border-border/30 last:border-0 last:pb-0">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{post.title}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <Clock className="h-3 w-3" />
                        {formatDate(post.created_at)}
                      </p>
                    </div>
                  </div>
                ))}
                <Link href="/admin/posts">
                  <Button variant="ghost" size="sm" className="w-full mt-2">
                    View All <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Recent Leads
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats.recent.leads.length === 0 ? (
              <p className="text-sm text-muted-foreground">No leads yet</p>
            ) : (
              <div className="space-y-3">
                {stats.recent.leads.map((lead) => (
                  <div key={lead.id} className="flex items-start justify-between gap-2 pb-3 border-b border-border/30 last:border-0 last:pb-0">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-1">
                        <User className="h-3 w-3 text-muted-foreground shrink-0" />
                        <p className="text-sm font-medium truncate">{lead.name}</p>
                      </div>
                      <a href={`mailto:${lead.email}`} className="text-xs text-muted-foreground hover:text-primary transition-colors truncate block">
                        {lead.email}
                      </a>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <Clock className="h-3 w-3" />
                        {formatDate(lead.created_at)}
                      </p>
                    </div>
                  </div>
                ))}
                <Link href="/admin/leads">
                  <Button variant="ghost" size="sm" className="w-full mt-2">
                    View All <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
