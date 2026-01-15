'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { apiRequest } from '@/lib/api';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Clock, Share2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface BlogPost {
    id: string;
    title: string;
    excerpt: string;
    category: string;
    content: string;
    read_time?: string;
    published_at?: string;
    hero_image?: string;
    tags?: string[];
}

export default function BlogPostPage() {
    const { id } = useParams();
    const router = useRouter();
    const [post, setPost] = useState<BlogPost | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (id) loadPost(id as string);
    }, [id]);

    const loadPost = async (postId: string) => {
        try {
            setLoading(true);
            const data = await apiRequest<BlogPost>(`/api/posts/${postId}`);
            setPost(data);
        } catch (err) {
            console.error('Failed to load post:', err);
            setError('Article not found.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="min-h-screen pt-32 pb-24 container mx-auto px-4 text-center">
                <h1 className="text-2xl font-bold mb-4">Oops!</h1>
                <p className="text-muted-foreground mb-8">{error || 'Something went wrong.'}</p>
                <Button onClick={() => router.push('/blog')}>Back to Blog</Button>
            </div>
        );
    }

    return (
        <article className="min-h-screen pt-24 pb-24">
            {/* Hero Section */}
            <div className="relative w-full h-[40vh] md:h-[50vh] bg-muted overflow-hidden">
                {post.hero_image ? (
                    <img
                        src={post.hero_image}
                        alt={post.title}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                        <span className="text-muted-foreground/30 text-4xl font-display">No Cover Image</span>
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
            </div>

            <div className="container mx-auto px-4 -mt-32 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-4xl mx-auto"
                >
                    <Button
                        variant="ghost"
                        className="mb-8 hover:bg-background/50 backdrop-blur-sm"
                        onClick={() => router.push('/blog')}
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Blog
                    </Button>

                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <Badge variant="secondary" className="px-3 py-1">{post.category}</Badge>
                            {post.read_time && (
                                <div className="flex items-center text-sm text-foreground/80 bg-background/50 backdrop-blur-md px-3 py-1 rounded-full border border-border/50">
                                    <Clock className="h-3 w-3 mr-1" />
                                    {post.read_time}
                                </div>
                            )}
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground leading-tight">
                            {post.title}
                        </h1>

                        <div className="flex items-center justify-between text-muted-foreground py-6 border-b border-border/50">
                            <div className="flex items-center gap-4">
                                {post.published_at && (
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4" />
                                        <span>{new Date(post.published_at).toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
                                    </div>
                                )}
                            </div>
                            <Button variant="ghost" size="icon">
                                <Share2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </motion.div>

                {/* Content */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="max-w-3xl mx-auto mt-12"
                >
                    <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-display prose-a:text-primary hover:prose-a:text-primary/80">
                        <ReactMarkdown>{post.content}</ReactMarkdown>
                    </div>

                    {post.tags && post.tags.length > 0 && (
                        <div className="mt-16 pt-8 border-t border-border">
                            <h3 className="text-sm font-semibold uppercase text-muted-foreground mb-4">Tags</h3>
                            <div className="flex flex-wrap gap-2">
                                {post.tags.map(tag => (
                                    <Badge key={tag} variant="outline" className="px-3 py-1 text-sm bg-background">
                                        #{tag}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
        </article>
    );
}
