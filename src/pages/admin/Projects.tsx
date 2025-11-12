import { useCallback, useEffect, useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ImageDropzone } from '@/components/ui/dropzone';
import { Switch } from '@/components/ui/switch';
import { apiRequest } from '@/lib/api';
import { useAdminAuth } from '@/contexts/AdminAuth';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, X, CheckCircle2, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { toast } from 'sonner';

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

type AdminProject = {
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

const emptyForm = {
  title: '',
  description: '',
  category: '',
  tags: '',
  image: '',
  mobileImage: '',
  gallery: [] as string[],
  longDescription: '',
  websiteUrl: '',
  videoSrc: '',
  metrics: undefined as { improvement: string; metric: string } | undefined,
  isFeatured: false,
  featuredOrder: '',
};

const SUGGESTED_TAGS = ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'WebGL', 'Three.js', 'E-commerce', 'SaaS', 'Portfolio', 'FinTech', 'Security'];

// Sortable Gallery Item Component
const SortableGalleryItem = ({ id, src, index, onRemove, onReplace, getAccessToken }: {
  id: string;
  src: string;
  index: number;
  onRemove: () => void;
  onReplace: (url: string) => void;
  getAccessToken: () => Promise<string | null>;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const elementRef = useRef<HTMLDivElement>(null);

  // Apply dynamic styles via ref to avoid inline styles
  useEffect(() => {
    if (elementRef.current) {
      const element = elementRef.current;
      element.style.setProperty('--sortable-transform', CSS.Transform.toString(transform));
      element.style.setProperty('--sortable-transition', transition || 'none');
      element.style.setProperty('--sortable-opacity', isDragging ? '0.5' : '1');
    }
  }, [transform, transition, isDragging]);

  const setRefs = useCallback((node: HTMLDivElement | null) => {
    setNodeRef(node);
    elementRef.current = node;
  }, [setNodeRef]);

  return (
    <div
      ref={setRefs}
      className="space-y-2 sortable-gallery-item"
    >
      <div className="flex items-center gap-2">
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
        >
          <GripVertical className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <ImageDropzone
            label={`Gallery image ${index + 1}`}
            previewUrl={src}
            onImageSelected={({ dataUrl }) => onReplace(dataUrl)}
            getAccessToken={getAccessToken}
          />
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onRemove}
          className="text-destructive hover:text-destructive"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

const ProjectsAdmin = () => {
  const { getAccessToken } = useAdminAuth();
  const [projects, setProjects] = useState<AdminProject[]>([]);
  const [editing, setEditing] = useState<AdminProject | null>(null);
  const [form, setForm] = useState<typeof emptyForm>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [markdownPreview, setMarkdownPreview] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const resetForm = () => {
    setForm(emptyForm);
    setErrors({});
    setShowAdvanced(false);
    setMarkdownPreview(false);
  };

  const mapProject = useCallback((p: ApiProject): AdminProject => ({
    id: p.id,
    title: p.title,
    description: p.description,
    category: p.category,
    tags: p.tags ?? [],
    image: p.image,
    mobileImage: p.mobile_image ?? '',
    gallery: p.gallery ?? [],
    metrics: p.metrics ?? undefined,
    longDescription: p.long_description ?? '',
    websiteUrl: p.website_url ?? '',
    videoSrc: p.video_src ?? '',
  isFeatured: Boolean(p.is_featured),
  featuredOrder: p.featured_order,
  }), []);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const token = await getAccessToken();
      if (!token) throw new Error('Session expired. Please log in again.');
      const data = await apiRequest<ApiProject[]>('/api/projects', {}, token);
      setProjects(data.map(mapProject));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to load projects.');
    } finally {
      setLoading(false);
    }
  }, [getAccessToken, mapProject]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!form.title.trim()) newErrors.title = 'Title is required';
    if (!form.description.trim()) newErrors.description = 'Description is required';
    if (!form.category.trim()) newErrors.category = 'Category is required';
    if (!form.image.trim()) newErrors.image = 'Desktop image is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const parseTags = (value: string) =>
    value.split(',').map((tag) => tag.trim()).filter(Boolean);

  const buildPayload = useCallback((data: typeof emptyForm) => {
    const trimmedOrder =
      typeof data.featuredOrder === 'string' ? data.featuredOrder.trim() : '';
    const parsedOrder =
      trimmedOrder === '' ? null : Number.isNaN(Number(trimmedOrder)) ? null : Number(trimmedOrder);

    return {
      title: data.title,
      description: data.description,
      category: data.category,
      tags: parseTags(data.tags),
      image: data.image,
      mobileImage: data.mobileImage?.trim() || null,
      gallery: (data.gallery || []).filter(Boolean),
      longDescription: data.longDescription?.trim() || null,
      websiteUrl: data.websiteUrl?.trim() || null,
      videoSrc: data.videoSrc?.trim() || null,
      metrics: data.metrics ?? null,
      isFeatured: data.isFeatured,
      featuredOrder: data.isFeatured ? parsedOrder : null,
    };
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }
    setSubmitting(true);
    try {
      const token = await getAccessToken();
      if (!token) throw new Error('Session expired. Please log in again.');
      const payload = buildPayload(form);
      if (editing) {
        await apiRequest<ApiProject>(
          `/api/projects/${editing.id}`,
          {
            method: 'PUT',
            body: JSON.stringify(payload),
          },
          token
        );
        setEditing(null);
        toast.success('Project updated successfully');
      } else {
        await apiRequest<ApiProject>(
          '/api/projects',
          {
            method: 'POST',
            body: JSON.stringify(payload),
          },
          token
        );
        toast.success('Project created successfully');
      }
      resetForm();
      // Refetch projects to ensure UI shows latest data from database
      await fetchProjects();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save project.');
    } finally {
      setSubmitting(false);
    }
  };

  const onEdit = (project: AdminProject) => {
    setEditing(project);
    setForm({
      title: project.title,
      description: project.description,
      category: project.category,
      tags: project.tags.join(', '),
      image: project.image,
      mobileImage: project.mobileImage || '',
      gallery: project.gallery || [],
      longDescription: project.longDescription || '',
      websiteUrl: project.websiteUrl || '',
      videoSrc: project.videoSrc || '',
      metrics: project.metrics,
      isFeatured: project.isFeatured,
      featuredOrder: project.featuredOrder != null ? String(project.featuredOrder) : '',
    });
    setShowAdvanced(!!(project.metrics || project.websiteUrl || project.videoSrc || project.longDescription));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    setSubmitting(true);
    try {
      const token = await getAccessToken();
      if (!token) throw new Error('Session expired. Please log in again.');
      await apiRequest(`/api/projects/${id}`, { method: 'DELETE' }, token);
      toast.success('Project deleted successfully');
      // Refetch projects to ensure UI shows latest data from database
      await fetchProjects();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete project.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleGalleryDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setForm((f) => {
        const oldIndex = f.gallery.findIndex((_, i) => `gallery-${i}` === active.id);
        const newIndex = f.gallery.findIndex((_, i) => `gallery-${i}` === over.id);
        return {
          ...f,
          gallery: arrayMove(f.gallery, oldIndex, newIndex),
        };
      });
    }
  };

  const addSuggestedTag = (tag: string) => {
    const currentTags = parseTags(form.tags);
    if (!currentTags.includes(tag)) {
      setForm((f) => ({
        ...f,
        tags: [...currentTags, tag].join(', '),
      }));
    }
  };

  const isLoading = loading && projects.length === 0;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-display">Projects</h1>
        {editing && (
          <Button
            variant="outline"
            onClick={() => {
              setEditing(null);
              resetForm();
            }}
          >
            Cancel Edit
          </Button>
        )}
      </div>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">{editing ? 'Edit Project' : 'Add New Project'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-8">
            {/* Basic Info Section */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4 pb-2 border-b">Basic Information</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">
                      Title <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="title"
                      value={form.title}
                      onChange={(e) => {
                        setForm((f) => ({ ...f, title: e.target.value }));
                        if (errors.title) setErrors((e) => ({ ...e, title: '' }));
                      }}
                      className={errors.title ? 'border-destructive' : ''}
                    />
                    {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">
                      Category <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="category"
                      value={form.category}
                      onChange={(e) => {
                        setForm((f) => ({ ...f, category: e.target.value }));
                        if (errors.category) setErrors((e) => ({ ...e, category: '' }));
                      }}
                      className={errors.category ? 'border-destructive' : ''}
                    />
                    {errors.category && <p className="text-sm text-destructive">{errors.category}</p>}
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="description">
                      Description <span className="text-destructive">*</span>
                    </Label>
                    <Textarea
                      id="description"
                      value={form.description}
                      onChange={(e) => {
                        setForm((f) => ({ ...f, description: e.target.value }));
                        if (errors.description) setErrors((e) => ({ ...e, description: '' }));
                      }}
                      className={errors.description ? 'border-destructive' : ''}
                      rows={3}
                    />
                    {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="tags">Tags (comma separated)</Label>
                    <Input
                      id="tags"
                      value={form.tags}
                      onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
                      placeholder="e.g., React, Next.js, TypeScript"
                    />
                    <div className="flex flex-wrap gap-2 mt-2">
                      {SUGGESTED_TAGS.map((tag) => {
                        const currentTags = parseTags(form.tags);
                        const isSelected = currentTags.includes(tag);
                        return (
                          <Button
                            key={tag}
                            type="button"
                            variant={isSelected ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => addSuggestedTag(tag)}
                          >
                            {tag}
                          </Button>
                        );
                      })}
                    </div>
                <div className="md:col-span-2 grid md:grid-cols-[auto,200px] gap-4 rounded-lg border border-border/50 p-4">
                  <div>
                    <Label className="text-base">Show in Latest Work</Label>
                    <p className="text-sm text-muted-foreground">
                      Toggle on to feature this project on the home page. Use the optional order to control display
                      priority (lower numbers appear first).
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-3">
                    <Switch
                      checked={form.isFeatured}
                      onCheckedChange={(checked) =>
                        setForm((f) => ({
                          ...f,
                          isFeatured: checked,
                          featuredOrder: checked ? f.featuredOrder : '',
                        }))
                      }
                    />
                    {form.isFeatured && (
                      <div className="w-full">
                        <Label htmlFor="featuredOrder" className="text-xs text-muted-foreground uppercase tracking-wide">
                          Display Order
                        </Label>
                        <Input
                          id="featuredOrder"
                          type="number"
                          min={1}
                          max={12}
                          value={form.featuredOrder}
                          onChange={(e) => setForm((f) => ({ ...f, featuredOrder: e.target.value }))}
                          placeholder="1"
                        />
                      </div>
                    )}
                  </div>
                </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Media Section */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4 pb-2 border-b">Media</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="image">
                      Desktop Image <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="image"
                      value={form.image}
                      onChange={(e) => {
                        setForm((f) => ({ ...f, image: e.target.value }));
                        if (errors.image) setErrors((e) => ({ ...e, image: '' }));
                      }}
                      className={errors.image ? 'border-destructive' : ''}
                      placeholder="Cloudinary URL or image URL"
                    />
                    {errors.image && <p className="text-sm text-destructive">{errors.image}</p>}
                    <ImageDropzone
                      label="Drop or click to upload"
                      previewUrl={form.image || undefined}
                      onImageSelected={({ dataUrl }) => {
                        setForm((f) => ({ ...f, image: dataUrl }));
                        if (errors.image) setErrors((e) => ({ ...e, image: '' }));
                      }}
                      getAccessToken={getAccessToken}
                    />
                    {form.image && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setForm((f) => ({ ...f, image: '' }))}
                        className="text-destructive"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Remove
                      </Button>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mobileImage">Mobile Image (optional)</Label>
                    <Input
                      id="mobileImage"
                      value={form.mobileImage}
                      onChange={(e) => setForm((f) => ({ ...f, mobileImage: e.target.value }))}
                      placeholder="Cloudinary URL or image URL"
                    />
                    <ImageDropzone
                      label="Drop or click to upload"
                      previewUrl={form.mobileImage || undefined}
                      onImageSelected={({ dataUrl }) => setForm((f) => ({ ...f, mobileImage: dataUrl }))}
                      getAccessToken={getAccessToken}
                    />
                    {form.mobileImage && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setForm((f) => ({ ...f, mobileImage: '' }))}
                        className="text-destructive"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Remove
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* Gallery Section with Drag & Drop */}
              <div className="space-y-2">
                <Label>Gallery Images</Label>
                {form.gallery && form.gallery.length > 0 && (
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleGalleryDragEnd}
                  >
                    <SortableContext
                      items={form.gallery.map((_, i) => `gallery-${i}`)}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="space-y-3">
                        {form.gallery.map((src, i) => (
                          <SortableGalleryItem
                            key={`gallery-${i}`}
                            id={`gallery-${i}`}
                            src={src}
                            index={i}
                            onRemove={() => {
                              setForm((f) => {
                                const g = [...(f.gallery || [])];
                                g.splice(i, 1);
                                return { ...f, gallery: g };
                              });
                            }}
                            onReplace={(url) => {
                              setForm((f) => {
                                const g = [...(f.gallery || [])];
                                g[i] = url;
                                return { ...f, gallery: g };
                              });
                            }}
                            getAccessToken={getAccessToken}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                )}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setForm((f) => ({ ...f, gallery: [...(f.gallery || []), ''] }))}
                >
                  + Add Gallery Image
                </Button>
              </div>
            </div>

            {/* Advanced Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Advanced</h3>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                >
                  {showAdvanced ? 'Hide' : 'Show'} Advanced
                </Button>
              </div>
              {showAdvanced && (
                <div className="grid md:grid-cols-2 gap-6 space-y-4 border-t pt-6">
                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="longDescription">Long Description (Markdown supported)</Label>
                    <div className="flex gap-2 mb-2">
                      <Button
                        type="button"
                        variant={markdownPreview ? 'outline' : 'default'}
                        size="sm"
                        onClick={() => setMarkdownPreview(false)}
                      >
                        Edit
                      </Button>
                      <Button
                        type="button"
                        variant={markdownPreview ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setMarkdownPreview(true)}
                      >
                        Preview
                      </Button>
                    </div>
                    {markdownPreview ? (
                      <div className="border rounded-md p-4 min-h-[200px] prose prose-sm dark:prose-invert max-w-none">
                        {form.longDescription ? (
                          <ReactMarkdown>{form.longDescription}</ReactMarkdown>
                        ) : (
                          <p className="text-muted-foreground">No content to preview</p>
                        )}
                      </div>
                    ) : (
                      <Textarea
                        id="longDescription"
                        value={form.longDescription}
                        onChange={(e) => setForm((f) => ({ ...f, longDescription: e.target.value }))}
                        placeholder="Write detailed project description in Markdown..."
                        className="min-h-[200px] font-mono text-sm"
                      />
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="websiteUrl">Website URL</Label>
                    <Input
                      id="websiteUrl"
                      type="url"
                      value={form.websiteUrl}
                      onChange={(e) => setForm((f) => ({ ...f, websiteUrl: e.target.value }))}
                      placeholder="https://example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="videoSrc">Video URL</Label>
                    <Input
                      id="videoSrc"
                      type="url"
                      value={form.videoSrc}
                      onChange={(e) => setForm((f) => ({ ...f, videoSrc: e.target.value }))}
                      placeholder="https://youtube.com/watch?v=..."
                    />
                  </div>
                  <div className="md:col-span-2 space-y-4">
                    <Label>Metrics</Label>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="metricImprovement">Improvement Label</Label>
                        <Input
                          id="metricImprovement"
                          value={form.metrics?.improvement || ''}
                          onChange={(e) =>
                            setForm((f) => ({
                              ...f,
                              metrics: { ...(f.metrics || { improvement: '', metric: '' }), improvement: e.target.value },
                            }))
                          }
                          placeholder="e.g., Lighthouse Score"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="metricValue">Metric Value</Label>
                        <Input
                          id="metricValue"
                          value={form.metrics?.metric || ''}
                          onChange={(e) =>
                            setForm((f) => ({
                              ...f,
                              metrics: { ...(f.metrics || { improvement: '', metric: '' }), metric: e.target.value },
                            }))
                          }
                          placeholder="e.g., 98/100"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-4 border-t">
              <Button type="submit" disabled={submitting} size="lg">
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : editing ? (
                  'Save Changes'
                ) : (
                  'Create Project'
                )}
              </Button>
              {editing && (
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => {
                    setEditing(null);
                    resetForm();
                  }}
                  disabled={submitting}
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Projects List */}
      {isLoading ? (
        <div className="text-center py-12">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Loading projects...</p>
        </div>
      ) : projects.length === 0 ? (
        <Card className="border-border/50">
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No projects yet. Create your first project above.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((p) => (
            <Card key={p.id} className="border-border/50 overflow-hidden hover:border-primary/50 transition-colors">
              <CardContent className="p-0">
                <div className="aspect-video w-full bg-muted/20 relative overflow-hidden">
                  {p.image ? (
                    <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground/60 text-sm">
                      No Image
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between gap-2">
                    <div className="font-semibold text-lg">{p.title}</div>
                    {p.isFeatured && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                        Latest Work
                        {p.featuredOrder != null && p.featuredOrder !== undefined && (
                          <span className="text-primary/70">#{p.featuredOrder}</span>
                        )}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground mb-2">{p.category}</div>
                  <div className="text-sm text-muted-foreground line-clamp-2">{p.description}</div>
                  {p.tags && p.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {p.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="text-xs px-2 py-0.5 bg-muted rounded">
                          {tag}
                        </span>
                      ))}
                      {p.tags.length > 3 && <span className="text-xs text-muted-foreground">+{p.tags.length - 3}</span>}
                    </div>
                  )}
                </div>
                <div className="flex gap-2 p-4 pt-0">
                  <Button size="sm" variant="outline" onClick={() => onEdit(p)} disabled={submitting} className="flex-1">
                    Edit
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => onDelete(p.id)} disabled={submitting} className="flex-1">
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectsAdmin;
