import { useMemo, useState } from 'react';
import { getProjects, saveProjects } from '@/data/contentStore';
import type { Project } from '@/data/projects';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ImageDropzone } from '@/components/ui/dropzone';

const ProjectsAdmin = () => {
  const [projects, setProjects] = useState<Project[]>(() => getProjects());
  const [editing, setEditing] = useState<Project | null>(null);

  const nextId = useMemo(() => (projects.length ? Math.max(...projects.map(p => p.id)) + 1 : 1), [projects]);

  const [form, setForm] = useState<Partial<Project>>({
    title: '',
    description: '',
    category: '',
    tags: [],
    image: '',
    mobileImage: '',
    gallery: [],
  });

  const resetForm = () => setForm({ title: '', description: '', category: '', tags: [], image: '', mobileImage: '' });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.category || !form.image) return;
    if (editing) {
      const updated = projects.map(p => (p.id === editing.id ? { ...editing, ...form, tags: parseTags(form.tags) } as Project : p));
      setProjects(updated); saveProjects(updated); setEditing(null); resetForm();
    } else {
      const created: Project = {
        id: nextId,
        title: form.title!,
        description: form.description!,
        category: form.category!,
        tags: parseTags(form.tags),
        image: form.image!,
        mobileImage: form.mobileImage || undefined,
        gallery: (form.gallery as string[]) || [],
      };
      const updated = [created, ...projects];
      setProjects(updated); saveProjects(updated); resetForm();
    }
  };

  const parseTags = (t: unknown): string[] => {
    if (Array.isArray(t)) return t as string[];
    if (typeof t === 'string') return t.split(',').map(s => s.trim()).filter(Boolean);
    return [];
  };

  const onEdit = (p: Project) => {
    setEditing(p);
    setForm({ ...p, tags: p.tags.join(', ') as unknown as string[], gallery: p.gallery || [] });
  };

  const onDelete = (id: number) => {
    const updated = projects.filter(p => p.id !== id);
    setProjects(updated); saveProjects(updated);
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-display">Projects</h1>
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">{editing ? 'Edit Project' : 'Add New Project'}</CardTitle>
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
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" value={form.description as string} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Desktop Image URL</Label>
              <Input id="image" value={form.image as string} onChange={(e) => setForm(f => ({ ...f, image: e.target.value }))} required />
              <ImageDropzone
                label="PNG or JPG, up to ~5MB"
                previewUrl={form.image as string | undefined}
                onImageSelected={({ dataUrl }) => setForm(f => ({ ...f, image: dataUrl }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mobileImage">Mobile Image URL</Label>
              <Input id="mobileImage" value={form.mobileImage as string} onChange={(e) => setForm(f => ({ ...f, mobileImage: e.target.value }))} />
              <ImageDropzone
                label="PNG or JPG, optional"
                previewUrl={form.mobileImage as string | undefined}
                onImageSelected={({ dataUrl }) => setForm(f => ({ ...f, mobileImage: dataUrl }))}
              />
            </div>
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="tags">Tags (comma separated)</Label>
              <Input id="tags" value={(form.tags as unknown as string) || ''} onChange={(e) => setForm(f => ({ ...f, tags: e.target.value }))} />
            </div>
            <div className="md:col-span-2 space-y-2">
              <Label>Gallery Images</Label>
              <div className="grid sm:grid-cols-2 gap-3">
                {((form.gallery as string[]) || []).map((src, i) => (
                  <div key={i} className="space-y-2">
                    <ImageDropzone
                      label="Replace or drop new image"
                      previewUrl={src}
                      onImageSelected={({ dataUrl }) => {
                        setForm(f => {
                          const g = ([...(f.gallery as string[])] || []);
                          g[i] = dataUrl;
                          return { ...f, gallery: g };
                        });
                      }}
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        setForm(f => {
                          const g = ([...(f.gallery as string[])] || []);
                          g.splice(i, 1);
                          return { ...f, gallery: g };
                        });
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setForm(f => ({ ...f, gallery: ([...(f.gallery as string[])] || []).concat('') }));
                }}
              >
                Add Gallery Image
              </Button>
            </div>
            <div className="md:col-span-2 flex gap-2">
              <Button type="submit">{editing ? 'Save Changes' : 'Add Project'}</Button>
              {editing && <Button type="button" variant="outline" onClick={() => { setEditing(null); resetForm(); }}>Cancel</Button>}
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((p) => (
          <Card key={p.id} className="border-border/50 overflow-hidden">
            <CardContent className="p-0">
              <div className="aspect-video w-full bg-muted/20 flex items-center justify-center text-muted-foreground/60 text-sm">
                Preview
              </div>
              <div className="p-4">
                <div className="font-semibold">{p.title}</div>
                <div className="text-xs text-muted-foreground mb-1">{p.category}</div>
                <div className="text-sm text-muted-foreground line-clamp-2">{p.description}</div>
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

export default ProjectsAdmin;

