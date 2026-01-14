'use client';

import { motion } from 'framer-motion';
import { Code, Palette, Zap, Layers, Sparkles, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const services = [
  {
    icon: Palette,
    title: 'Web Design',
    description: 'Stunning, user-centric interfaces that convert visitors into customers',
  },
  {
    icon: Code,
    title: 'Frontend Development',
    description: 'Pixel-perfect, responsive code with React, Vue, or your preferred stack',
  },
  {
    icon: Layers,
    title: 'Full-Stack',
    description: 'End-to-end solutions with robust backends and seamless integrations',
  },
  {
    icon: Zap,
    title: 'Performance',
    description: 'Lightning-fast load times and 90+ Lighthouse scores guaranteed',
  },
  {
    icon: Sparkles,
    title: '3D & WebGL',
    description: 'Immersive 3D experiences with Three.js and cutting-edge WebGL',
  },
  {
    icon: TrendingUp,
    title: 'AI Integration',
    description: 'Smart features powered by modern AI and machine learning',
  },
];

export const Services = () => {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-display-sm font-display mb-4">
            What We <span className="text-gradient">Do Best</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Comprehensive web solutions from design to deployment
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.5,
                delay: index * 0.12,
                ease: [0.22, 1, 0.36, 1]
              }}
            >
              <Card className="group h-full border-border/60 dark:border-border/50 hover:border-primary/60 dark:hover:border-primary/50 transition-all hover:shadow-medium bg-card/50 dark:bg-card">
                <CardContent className="p-8">
                  <div className="mb-6 w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center group-hover:shadow-glow transition-all">
                    <service.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-display font-semibold mb-3 group-hover:text-gradient transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {service.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
