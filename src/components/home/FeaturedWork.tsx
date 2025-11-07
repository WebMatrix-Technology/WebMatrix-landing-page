import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const projects = [
  {
    id: 1,
    title: 'FinTech Dashboard',
    description: 'Real-time financial analytics with 3D data visualization',
    tags: ['React', 'Three.js', 'WebGL'],
    image: '/placeholder.svg',
    metrics: { improvement: '45%', metric: 'User Engagement' },
  },
  {
    id: 2,
    title: 'E-commerce Platform',
    description: 'High-performance storefront with micro-interactions',
    tags: ['Next.js', 'Framer Motion', 'Stripe'],
    image: '/placeholder.svg',
    metrics: { improvement: '3x', metric: 'Conversion Rate' },
  },
  {
    id: 3,
    title: 'SaaS Marketing Site',
    description: 'Premium landing with scroll-linked animations',
    tags: ['React', 'GSAP', 'Tailwind'],
    image: '/placeholder.svg',
    metrics: { improvement: '95+', metric: 'Lighthouse Score' },
  },
];

export const FeaturedWork = () => {
  return (
    <section className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-display-sm font-display mb-4">
            Featured <span className="text-gradient">Work</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Explore our latest projects showcasing cutting-edge web experiences
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="group overflow-hidden border-border/50 hover:border-primary/50 transition-all hover:shadow-glow">
                <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/50">
                    [Project Screenshot]
                  </div>
                  <div className="absolute top-4 right-4">
                    <ExternalLink className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-display font-semibold mb-2 group-hover:text-gradient transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-muted-foreground mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div>
                      <div className="text-2xl font-bold text-primary">{project.metrics.improvement}</div>
                      <div className="text-xs text-muted-foreground">{project.metrics.metric}</div>
                    </div>
                    <Link to={`/work/${project.id}`} className="text-primary hover:text-accent transition-colors">
                      View Case Study →
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Link 
            to="/work"
            className="inline-flex items-center gap-2 text-primary hover:text-accent transition-colors font-medium"
          >
            View All Projects
            <ArrowRight className="h-5 w-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
