// src/pages/Work.tsx

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { projects } from '@/data/projects';
import { DevicePreview } from '@/components/ui/device-preview';

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
          {projects.map((project, index) => ( // Use the imported projects
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={`/work/${project.id}`}>
                <Card className="group overflow-hidden border-border/50 hover:border-primary/50 transition-all hover:shadow-glow cursor-pointer h-full">
                  <div className="relative aspect-[4/3] md:aspect-[16/9] overflow-hidden">
                    <DevicePreview
                      desktopImage={project.image}
                      mobileImage={project.mobileImage}
                      title={project.title}
                      className="transform transition-transform duration-500 group-hover:scale-105"
                    />
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute top-4 right-4 z-10">
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