// src/components/home/FeaturedWork.tsx

import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { projects } from '@/data/projects'; // Import data

const featuredProjects = projects.slice(0, 3); // Get first 3 projects for the homepage

export const FeaturedWork = () => {
  return (
    <section className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
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
          {featuredProjects.map((project, index) => ( // Use featuredProjects
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.15,
                ease: [0.22, 1, 0.36, 1]
              }}
            >
              {/* This Link tag now wraps the entire card */}
              <Link to={`/work/${project.id}`}>
                <Card className="group overflow-hidden border-border/50 hover:border-primary/50 transition-all hover:shadow-glow h-full">
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
                    {project.metrics && ( // Check if metrics exist
                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        <div>
                          <div className="text-2xl font-bold text-primary">{project.metrics.improvement}</div>
                          <div className="text-xs text-muted-foreground">{project.metrics.metric}</div>
                        </div>
                        {/* Changed the Link to plain text since the card is the link */}
                        <div className="text-primary text-sm font-medium">
                          View Case Study →
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
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