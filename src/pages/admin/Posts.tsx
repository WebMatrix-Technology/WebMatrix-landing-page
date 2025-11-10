import { useMemo, useState } from 'react';
import { getPosts, savePosts, BlogPost } from '@/data/contentStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const PostsAdmin = () => {
  const [posts, setPosts] = useState<BlogPost[]>(() => getPosts());
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const nextId = useMemo(() => (posts.length ? Math.max(...posts.map(p => p.id)) + 1 : 1), [posts]);

  const [form, setForm] = useState<Partial<BlogPost>>({
    title: '',
    excerpt: '',
    category: '',
    date: new Date().toISOString().slice(0, 10),
    readTime: '5 min',
    tags: [],
  });

  const resetForm = () => setForm({ title: '', excerpt: '', category: '', date: new Date().toISOString().slice(0, 10), readTime: '5 min', tags: [] });

  const parseTags = (t: unknown): string[] => {
    if (Array.isArray(t)) return t as string[];
    if (typeof t === 'string') return t.split(',').map(s => s.trim()).filter(Boolean);
    return [];
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.excerpt || !form.category) return;
    if (editing) {
      const updated = posts.map(p => (p.id === editing.id ? { ...editing, ...form, tags: parseTags(form.tags) } as BlogPost : p));
      setPosts(updated); savePosts(updated); setEditing(null); resetForm();
    } else {
      const created: BlogPost = {
        id: nextId,
        title: form.title!,
        excerpt: form.excerpt!,
        category: form.category!,
        date: form.date || new Date().toISOString().slice(0, 10),
        readTime: form.readTime || '5 min',
        tags: parseTags(form.tags),
      };
      const updated = [created, ...posts];
      setPosts(updated); savePosts(updated); resetForm();
    }
  };

  const onEdit = (p: BlogPost) => {
    setEditing(p);
    setForm({ ...p, tags: p.tags.join(', ') as unknown as string[] });
  };

  const onDelete = (id: number) => {
    const updated = posts.filter(p => p.id !== id);
    setPosts(updated); savePosts(updated);
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
              <Label htmlFor="date">Date</Label>
              <Input id="date" type="date" value={form.date as string} onChange={(e) => setForm(f => ({ ...f, date: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="readTime">Read time</Label>
              <Input id="readTime" value={form.readTime as string} onChange={(e) => setForm(f => ({ ...f, readTime: e.target.value }))} />
            </div>
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea id="excerpt" value={form.excerpt as string} onChange={(e) => setForm(f => ({ ...f, excerpt: e.target.value }))} required />
            </div>
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="tags">Tags (comma separated)</Label>
              <Input id="tags" value={(form.tags as unknown as string) || ''} onChange={(e) => setForm(f => ({ ...f, tags: e.target.value }))} />
            </div>
            <div className="md:col-span-2 flex gap-2">
              <Button type="submit">{editing ? 'Save Changes' : 'Add Post'}</Button>
              {editing && <Button type="button" variant="outline" onClick={() => { setEditing(null); resetForm(); }}>Cancel</Button>}
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.map((p) => (
          <Card key={p.id} className="border-border/50 overflow-hidden">
            <CardContent className="p-0">
              <div className="aspect-video w-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-muted-foreground/60 text-sm">
                Cover
              </div>
              <div className="p-4">
                <div className="font-semibold">{p.title}</div>
                <div className="text-xs text-muted-foreground mb-1">{p.category}</div>
                <div className="text-sm text-muted-foreground line-clamp-2">{p.excerpt}</div>
              </div>
              <div className="flex gap-2 p-4 pt-0">
                <Button size="sm" variant="outline" onClick={() => onEdit(p)}>Edit</Button>
                <Button size="sm" variant="destructive" onClick={() => onDelete(p.id)}>Delete</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PostsAdmin;

