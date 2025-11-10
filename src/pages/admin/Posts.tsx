import { useEffect, useState } from 'react';
import { useAdminAuth } from '@/contexts/AdminAuth';
import { apiRequest } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  content?: string;
  read_time?: string;
  tags: string[];
  hero_image?: string;
  published_at?: string;
  created_at?: string;
  updated_at?: string;
}

const PostsAdmin = () => {
  const { getAccessToken } = useAdminAuth();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<BlogPost | null>(null);

  const [form, setForm] = useState<Partial<BlogPost>>({
    title: '',
    excerpt: '',
    category: '',
    content: '',
    read_time: '5 min',
    tags: [],
  });

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

  const resetForm = () => setForm({ title: '', excerpt: '', category: '', content: '', read_time: '5 min', tags: [] });

  const parseTags = (t: unknown): string[] => {
    if (Array.isArray(t)) return t as string[];
    if (typeof t === 'string') return t.split(',').map(s => s.trim()).filter(Boolean);
    return [];
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.excerpt || !form.category || !form.content) {
      toast.error('Please fill all required fields');
      return;
    }
    try {
      const token = await getAccessToken();
      const payload = {
        title: form.title!,
        excerpt: form.excerpt!,
        category: form.category!,
        content: form.content!,
        readTime: form.read_time || '5 min',
        tags: parseTags(form.tags),
        heroImage: form.hero_image || null,
        publishedAt: form.published_at || new Date().toISOString(),
      };
      if (editing) {
        await apiRequest<BlogPost>(`/api/posts/${editing.id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        }, token);
        toast.success('Post updated');
      } else {
        await apiRequest<BlogPost>('/api/posts', {
          method: 'POST',
          body: JSON.stringify(payload),
        }, token);
        toast.success('Post created');
      }
      await loadPosts();
      setEditing(null);
      resetForm();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save post');
    }
  };

  const onEdit = (p: BlogPost) => {
    setEditing(p);
    setForm({
      ...p,
      read_time: p.read_time || '5 min',
      tags: p.tags.join(', ') as unknown as string[],
      published_at: p.published_at ? new Date(p.published_at).toISOString().slice(0, 10) : undefined,
    });
  };

  const onDelete = async (id: string) => {
    if (!confirm('Delete this post?')) return;
    try {
      const token = await getAccessToken();
      await apiRequest(`/api/posts/${id}`, { method: 'DELETE' }, token);
      toast.success('Post deleted');
      await loadPosts();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete post');
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-display">Blog Posts</h1>
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">{editing ? 'Edit Post' : 'Add New Post'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={form.title as string} onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input id="category" value={form.category as string} onChange={(e) => setForm(f => ({ ...f, category: e.target.value }))} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="published_at">Published Date</Label>
              <Input id="published_at" type="date" value={form.published_at as string || ''} onChange={(e) => setForm(f => ({ ...f, published_at: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="read_time">Read time</Label>
              <Input id="read_time" value={form.read_time as string || ''} onChange={(e) => setForm(f => ({ ...f, read_time: e.target.value }))} />
            </div>
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea id="excerpt" value={form.excerpt as string} onChange={(e) => setForm(f => ({ ...f, excerpt: e.target.value }))} required />
            </div>
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea id="content" value={form.content as string || ''} onChange={(e) => setForm(f => ({ ...f, content: e.target.value }))} required className="min-h-[200px]" />
            </div>
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="tags">Tags (comma separated)</Label>
              <Input id="tags" value={(form.tags as unknown as string) || ''} onChange={(e) => setForm(f => ({ ...f, tags: e.target.value }))} />
            </div>
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="hero_image">Hero Image URL</Label>
              <Input id="hero_image" value={form.hero_image as string || ''} onChange={(e) => setForm(f => ({ ...f, hero_image: e.target.value }))} />
            </div>
            <div className="md:col-span-2 flex gap-2">
              <Button type="submit">{editing ? 'Save Changes' : 'Add Post'}</Button>
              {editing && <Button type="button" variant="outline" onClick={() => { setEditing(null); resetForm(); }}>Cancel</Button>}
            </div>
          </form>
        </CardContent>
      </Card>

      {loading ? (
        <div className="text-center py-8 text-muted-foreground">Loading posts...</div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {posts.length === 0 ? (
            <div className="col-span-full text-center py-8 text-muted-foreground">No posts yet. Create your first post above.</div>
          ) : (
            posts.map((p) => (
              <Card key={p.id} className="border-border/50 overflow-hidden">
                <CardContent className="p-0">
                  <div className="aspect-video w-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-muted-foreground/60 text-sm">
                    {p.hero_image ? (
                      <img src={p.hero_image} alt={p.title} className="w-full h-full object-cover" />
                    ) : (
                      'Cover'
                    )}
                  </div>
                  <div className="p-4">
                    <div className="font-semibold">{p.title}</div>
                    <div className="text-xs text-muted-foreground mb-1">{p.category}</div>
                    <div className="text-sm text-muted-foreground line-clamp-2">{p.excerpt}</div>
                    {p.published_at && (
                      <div className="text-xs text-muted-foreground mt-2">
                        {new Date(p.published_at).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 p-4 pt-0">
                    <Button size="sm" variant="outline" onClick={() => onEdit(p)}>Edit</Button>
                    <Button size="sm" variant="destructive" onClick={() => onDelete(p.id)}>Delete</Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default PostsAdmin;

