import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const projects = [
  {
    id: 1,
    title: 'FinTech Dashboard',
    description: 'Real-time financial analytics platform with 3D data visualization',
    category: 'Finance',
    tags: ['React', 'Three.js', 'WebGL', 'D3.js'],
    image: '/placeholder.svg',
  },
  {
    id: 2,
    title: 'E-commerce Platform',
    description: 'High-performance storefront with advanced micro-interactions',
    category: 'E-commerce',
    tags: ['Next.js', 'Framer Motion', 'Stripe', 'Tailwind'],
    image: '/placeholder.svg',
  },
  {
    id: 3,
    title: 'SaaS Marketing Site',
    description: 'Premium landing page with scroll-linked animations',
    category: 'SaaS',
    tags: ['React', 'GSAP', 'Tailwind', 'TypeScript'],
    image: '/placeholder.svg',
  },
  {
    id: 4,
    title: 'Healthcare Portal',
    description: 'HIPAA-compliant patient management system',
    category: 'Healthcare',
    tags: ['React', 'Node.js', 'PostgreSQL', 'AWS'],
    image: '/placeholder.svg',
  },
  {
    id: 5,
    title: 'Real Estate Platform',
    description: 'Interactive property showcase with virtual tours',
    category: 'Real Estate',
    tags: ['Next.js', 'Three.js', 'Mapbox', 'Sanity'],
    image: '/placeholder.svg',
  },
  {
    id: 6,
    title: 'Education LMS',
    description: 'Modern learning management system with gamification',
    category: 'Education',
    tags: ['React', 'Firebase', 'Framer Motion', 'WebRTC'],
    image: '/placeholder.svg',
  },
];

const Work = () => {
  return (
    <div className="min-h-screen pt-32 pb-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl lg:text-display-lg font-display mb-6">
            Our <span className="text-gradient">Work</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Explore our portfolio of successful projects across various industries
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={`/work/${project.id}`}>
                <Card className="group overflow-hidden border-border/50 hover:border-primary/50 transition-all hover:shadow-glow cursor-pointer h-full">
                  <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/50">
                      [Project Screenshot]
                    </div>
                    <div className="absolute top-4 right-4">
                      <ExternalLink className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity text-white" />
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <Badge className="mb-3" variant="secondary">{project.category}</Badge>
                    <h3 className="text-xl font-display font-semibold mb-2 group-hover:text-gradient transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-muted-foreground mb-4">{project.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <Badge key={tag} variant="outline">
                          {tag}
                        </Badge>
                      ))}
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

export default Work;
