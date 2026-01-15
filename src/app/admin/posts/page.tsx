'use client';

import React, { useEffect, useState } from 'react';
import { useAdminAuth } from '@/contexts/AdminAuth';
import { apiRequest } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Save, X, Eye, EyeOff, LayoutTemplate } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  content: string;
  read_time?: string;
  tags?: string[];
  hero_image?: string;
  published_at?: string;
}

export default function AdminPostsPage() {
  const { getAccessToken } = useAdminAuth();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  // View State: 'list' | 'create' | 'edit'
  const [view, setView] = useState<'list' | 'create' | 'edit'>('list');
  const [editorData, setEditorData] = useState<Partial<BlogPost>>({});
  const [showPreview, setShowPreview] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const token = await getAccessToken();
      const data = await apiRequest<BlogPost[]>('/api/posts', { method: 'GET' }, token);
      setPosts(data || []);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditorData({
      title: '',
      excerpt: '',
      category: '',
      content: '',
      read_time: '5 min',
      tags: [],
    });
    setView('create');
  };

  const handleEdit = (post: BlogPost) => {
    setEditorData({ ...post });
    setView('edit');
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const token = await getAccessToken();
      await apiRequest(`/api/posts/${deleteId}`, { method: 'DELETE' }, token);
      toast.success('Post deleted successfully');
      setPosts(prev => prev.filter(p => p.id !== deleteId));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete post');
    } finally {
      setDeleteId(null);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editorData.title || !editorData.content) {
      toast.error('Title and Content are required');
      return;
    }

    try {
      const token = await getAccessToken();
      const payload = {
        ...editorData,
        tags: Array.isArray(editorData.tags) ? editorData.tags : (editorData.tags as unknown as string || '').split(',').map(s => s.trim()).filter(Boolean),
        published_at: editorData.published_at || new Date().toISOString(),
      };

      if (view === 'edit' && editorData.id) {
        await apiRequest(`/api/posts/${editorData.id}`, {
          method: 'PUT',
          body: JSON.stringify(payload)
        }, token);
        toast.success('Post updated');
      } else {
        await apiRequest('/api/posts', {
          method: 'POST',
          body: JSON.stringify(payload)
        }, token);
        toast.success('Post created');
      }

      await loadPosts();
      setView('list');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save post');
    }
  };

  // --- Render Components ---

  const renderList = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display font-bold">Blog Posts</h1>
          <p className="text-muted-foreground">Manage your articles and tutorials.</p>
        </div>
        <Button onClick={handleCreate} className="gap-2">
          <Plus className="h-4 w-4" /> New Post
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map(post => (
          <Card key={post.id} className="group overflow-hidden border-border/50 hover:border-primary/50 transition-all hover:shadow-lg">
            <div className="aspect-video bg-muted relative overflow-hidden">
              {post.hero_image ? (
                <img src={post.hero_image} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              ) : (
                <div className="flex items-center justify-center w-full h-full text-muted-foreground bg-secondary/30">
                  <LayoutTemplate className="h-10 w-10 opacity-20" />
                </div>
              )}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button variant="secondary" size="sm" onClick={() => handleEdit(post)}>
                  <Pencil className="h-4 w-4 mr-2" /> Edit
                </Button>
                <Button variant="destructive" size="sm" onClick={() => setDeleteId(post.id)}>
                  <Trash2 className="h-4 w-4 mr-2" /> Delete
                </Button>
              </div>
            </div>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <Badge variant="outline">{post.category}</Badge>
                <span className="text-xs text-muted-foreground">{new Date(post.published_at!).toLocaleDateString()}</span>
              </div>
              <CardTitle className="line-clamp-1">{post.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {posts.length === 0 && !loading && (
        <div className="text-center py-20 text-muted-foreground border border-dashed border-border rounded-lg">
          No posts found. Create one to get started!
        </div>
      )}
    </div>
  );

  const renderEditor = () => (
    <div className="h-[calc(100vh-100px)] flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => setView('list')}>
            <X className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-display font-bold">
            {view === 'create' ? 'New Post' : 'Edit Post'}
          </h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowPreview(!showPreview)}>
            {showPreview ? <><EyeOff className="mr-2 h-4 w-4" /> Hide Preview</> : <><Eye className="mr-2 h-4 w-4" /> Show Preview</>}
          </Button>
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" /> Save Post
          </Button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-12 gap-6 overflow-hidden">
        {/* Editor Column */}
        <div className={`${showPreview ? 'col-span-12 lg:col-span-6' : 'col-span-12'} flex flex-col gap-4 overflow-y-auto pr-2`}>
          <Card>
            <CardContent className="space-y-4 pt-6">
              <div className="grid gap-2">
                <Label>Title</Label>
                <Input
                  value={editorData.title}
                  onChange={e => setEditorData(p => ({ ...p, title: e.target.value }))}
                  placeholder="Enter post title"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Category</Label>
                  <Input
                    value={editorData.category}
                    onChange={e => setEditorData(p => ({ ...p, category: e.target.value }))}
                    placeholder="Tech, Update, etc."
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Read Time</Label>
                  <Input
                    value={editorData.read_time}
                    onChange={e => setEditorData(p => ({ ...p, read_time: e.target.value }))}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Tags (comma separated)</Label>
                <Input
                  value={Array.isArray(editorData.tags) ? editorData.tags.join(', ') : editorData.tags}
                  onChange={e => setEditorData(p => ({ ...p, tags: e.target.value.split(',') }))}
                />
              </div>
              <div className="grid gap-2">
                <Label>Hero Image URL</Label>
                <Input
                  value={editorData.hero_image}
                  onChange={e => setEditorData(p => ({ ...p, hero_image: e.target.value }))}
                />
              </div>
              <div className="grid gap-2">
                <Label>Excerpt</Label>
                <Textarea
                  value={editorData.excerpt}
                  onChange={e => setEditorData(p => ({ ...p, excerpt: e.target.value }))}
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="flex-1 flex flex-col">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Content (Markdown)</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-0">
              <Textarea
                className="w-full h-full min-h-[400px] border-0 focus-visible:ring-0 rounded-none p-4 resize-none font-mono text-sm leading-relaxed"
                placeholder="# Start writing your story..."
                value={editorData.content}
                onChange={e => setEditorData(p => ({ ...p, content: e.target.value }))}
              />
            </CardContent>
          </Card>
        </div>

        {/* Preview Column */}
        {showPreview && (
          <div className="hidden lg:flex col-span-6 flex-col overflow-hidden bg-muted/30 rounded-lg border border-border">
            <div className="p-3 border-b bg-muted/50 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Live Preview
            </div>
            <ScrollArea className="flex-1 p-8">
              <div className="prose dark:prose-invert max-w-none">
                <h1 className="mb-4">{editorData.title || 'Untitled Post'}</h1>
                {editorData.hero_image && (
                  <img src={editorData.hero_image} alt="Hero" className="w-full rounded-lg mb-8 object-cover max-h-[300px]" />
                )}
                <ReactMarkdown>{editorData.content || '*No content yet...*'}</ReactMarkdown>
              </div>
            </ScrollArea>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="container mx-auto py-8 px-4 h-full min-h-screen">
      {view === 'list' ? renderList() : renderEditor()}

      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Post</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this post? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
