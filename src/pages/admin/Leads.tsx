import { useCallback, useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { apiRequest } from '@/lib/api';
import { useAdminAuth } from '@/contexts/AdminAuth';
import { Loader2, X, Search, Mail, User, DollarSign, Clock, MessageSquare, Calendar, Trash2, Eye } from 'lucide-react';
import { toast } from 'sonner';

type ApiLead = {
  id: string;
  name: string;
  email: string;
  budget: string | null;
  timeline: string | null;
  message: string;
  created_at: string;
};

type AdminLead = {
  id: string;
  name: string;
  email: string;
  budget?: string;
  timeline?: string;
  message: string;
  createdAt: string;
};

const LeadsAdmin = () => {
  const { getAccessToken } = useAdminAuth();
  const [leads, setLeads] = useState<AdminLead[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const mapLead = useCallback((l: ApiLead): AdminLead => ({
    id: l.id,
    name: l.name,
    email: l.email,
    budget: l.budget ?? undefined,
    timeline: l.timeline ?? undefined,
    message: l.message,
    createdAt: l.created_at,
  }), []);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const token = await getAccessToken();
      if (!token) throw new Error('Session expired. Please log in again.');
      const data = await apiRequest<ApiLead[]>('/api/leads', {}, token);
      setLeads(data.map(mapLead));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to load leads.');
    } finally {
      setLoading(false);
    }
  }, [getAccessToken, mapLead]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const onDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this lead?')) return;
    setDeleting(id);
    try {
      const token = await getAccessToken();
      if (!token) throw new Error('Session expired. Please log in again.');
      await apiRequest(`/api/leads/${id}`, { method: 'DELETE' }, token);
      setLeads((prev) => prev.filter((l) => l.id !== id));
      toast.success('Lead deleted successfully');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete lead.');
    } finally {
      setDeleting(null);
    }
  };

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return leads;
    return leads.filter(l =>
      [l.name, l.email, l.budget, l.timeline, l.message]
        .filter(Boolean)
        .some(v => String(v).toLowerCase().includes(q))
    );
  }, [leads, query]);

  const stats = useMemo(() => {
    const total = leads.length;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayCount = leads.filter(l => new Date(l.createdAt) >= today).length;
    const thisWeek = new Date();
    thisWeek.setDate(thisWeek.getDate() - 7);
    const weekCount = leads.filter(l => new Date(l.createdAt) >= thisWeek).length;
    return { total, todayCount, weekCount };
  }, [leads]);

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
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined });
  };

  const getTimelineBadgeVariant = (timeline?: string) => {
    if (!timeline) return 'secondary';
    if (timeline === 'urgent') return 'destructive';
    if (timeline.includes('1-2')) return 'default';
    return 'outline';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-display">Leads</h1>
        <div className="text-center py-12">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Loading leads...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display">Leads</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage contact form submissions</p>
        </div>
        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search leads..."
            className="pl-10"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Leads</p>
                <p className="text-3xl font-bold">{stats.total}</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Mail className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Today</p>
                <p className="text-3xl font-bold">{stats.todayCount}</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">This Week</p>
                <p className="text-3xl font-bold">{stats.weekCount}</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-success/10 flex items-center justify-center">
                <Clock className="h-6 w-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Leads List */}
      {filtered.length === 0 ? (
        <Card className="border-border/50">
          <CardContent className="py-12 text-center">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
            <p className="text-muted-foreground">
              {leads.length === 0 ? 'No leads yet. Submissions will appear here.' : 'No leads match your search.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filtered.map((lead) => (
            <Card key={lead.id} className="border-border/50 hover:border-primary/50 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-4">
                    {/* Header Row */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <h3 className="font-semibold text-lg">{lead.name}</h3>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Mail className="h-3 w-3" />
                          <a href={`mailto:${lead.email}`} className="hover:text-primary transition-colors">
                            {lead.email}
                          </a>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground whitespace-nowrap">
                        {formatDate(lead.createdAt)}
                      </div>
                    </div>

                    {/* Details Row */}
                    <div className="grid md:grid-cols-2 gap-4">
                      {lead.budget && (
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-muted-foreground shrink-0" />
                          <span className="text-sm">
                            <span className="text-muted-foreground">Budget: </span>
                            <span className="font-medium">{lead.budget}</span>
                          </span>
                        </div>
                      )}
                      {lead.timeline && (
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
                          <span className="text-sm">
                            <span className="text-muted-foreground">Timeline: </span>
                            <Badge variant={getTimelineBadgeVariant(lead.timeline)} className="ml-1">
                              {lead.timeline === 'urgent' ? 'ASAP' : 
                               lead.timeline === '1-2m' ? '1-2 months' :
                               lead.timeline === '2-3m' ? '2-3 months' :
                               lead.timeline === '3m+' ? '3+ months' : lead.timeline}
                            </Badge>
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Message Preview */}
                    <div className="pt-2 border-t border-border/50">
                      <div className="flex items-start gap-2">
                        <MessageSquare className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                        <p className="text-sm text-muted-foreground line-clamp-2 flex-1">
                          {lead.message}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 shrink-0">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Lead Details</DialogTitle>
                          <DialogDescription>
                            Submitted {new Date(lead.createdAt).toLocaleString()}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-6 mt-4">
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium text-muted-foreground">Name</label>
                              <p className="mt-1">{lead.name}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-muted-foreground">Email</label>
                              <p className="mt-1">
                                <a href={`mailto:${lead.email}`} className="text-primary hover:underline">
                                  {lead.email}
                                </a>
                              </p>
                            </div>
                            {lead.budget && (
                              <div>
                                <label className="text-sm font-medium text-muted-foreground">Budget</label>
                                <p className="mt-1">{lead.budget}</p>
                              </div>
                            )}
                            {lead.timeline && (
                              <div>
                                <label className="text-sm font-medium text-muted-foreground">Timeline</label>
                                <div className="mt-1">
                                  <Badge variant={getTimelineBadgeVariant(lead.timeline)}>
                                    {lead.timeline === 'urgent' ? 'ASAP' : 
                                     lead.timeline === '1-2m' ? '1-2 months' :
                                     lead.timeline === '2-3m' ? '2-3 months' :
                                     lead.timeline === '3m+' ? '3+ months' : lead.timeline}
                                  </Badge>
                                </div>
                              </div>
                            )}
                          </div>
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">Message</label>
                            <div className="mt-2 p-4 bg-muted/50 rounded-lg">
                              <p className="whitespace-pre-wrap">{lead.message}</p>
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onDelete(lead.id)}
                      disabled={deleting === lead.id}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      {deleting === lead.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default LeadsAdmin;

