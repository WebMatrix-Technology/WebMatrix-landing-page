import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const articles = [
  {
    id: 1,
    title: 'Building Performant 3D Web Experiences with Three.js',
    excerpt: 'Learn best practices for creating smooth, optimized 3D web applications that run at 60fps.',
    category: 'Tutorial',
    date: '2024-01-15',
    readTime: '8 min',
    tags: ['Three.js', 'WebGL', 'Performance'],
  },
  {
    id: 2,
    title: 'The Future of Web Animations: Framer Motion vs GSAP',
    excerpt: 'A comprehensive comparison of two leading animation libraries for modern web development.',
    category: 'Comparison',
    date: '2024-01-10',
    readTime: '6 min',
    tags: ['Framer Motion', 'GSAP', 'Animations'],
  },
  {
    id: 3,
    title: 'Achieving 100 Lighthouse Score: A Complete Guide',
    excerpt: 'Step-by-step strategies for optimizing your website to achieve perfect Lighthouse scores.',
    category: 'Guide',
    date: '2024-01-05',
    readTime: '10 min',
    tags: ['Performance', 'SEO', 'Best Practices'],
  },
  {
    id: 4,
    title: 'Implementing Micro-interactions That Delight Users',
    excerpt: 'How subtle animations and transitions can significantly improve user experience.',
    category: 'Design',
    date: '2023-12-28',
    readTime: '5 min',
    tags: ['UX', 'Design', 'Interactions'],
  },
  {
    id: 5,
    title: 'Modern CSS: Grid, Flexbox, and Container Queries',
    excerpt: 'Master modern CSS layout techniques for building responsive, maintainable interfaces.',
    category: 'Tutorial',
    date: '2023-12-20',
    readTime: '7 min',
    tags: ['CSS', 'Layout', 'Responsive'],
  },
  {
    id: 6,
    title: 'WebGL Shaders: From Basics to Advanced Techniques',
    excerpt: 'Dive deep into shader programming and create stunning visual effects for the web.',
    category: 'Advanced',
    date: '2023-12-15',
    readTime: '12 min',
    tags: ['WebGL', 'Shaders', 'Graphics'],
  },
];

const Blog = () => {
  return (
    <div className="min-h-screen pt-32 pb-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl lg:text-display-lg font-display mb-6">
            Our <span className="text-gradient">Blog</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Insights, tutorials, and thoughts on modern web development
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article, index) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={`/blog/${article.id}`}>
                <Card className="group h-full border-border/50 hover:border-primary/50 transition-all hover:shadow-glow cursor-pointer">
                  <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/50">
                      [Article Cover]
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <Badge className="mb-3" variant="secondary">{article.category}</Badge>
                    <h3 className="text-xl font-display font-semibold mb-3 group-hover:text-gradient transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-muted-foreground mb-4 line-clamp-2">{article.excerpt}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {article.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground pt-4 border-t border-border">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(article.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{article.readTime}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;
