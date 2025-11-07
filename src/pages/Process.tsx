import { motion } from 'framer-motion';
import { Search, Palette, Code, TestTube, Rocket, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const steps = [
  {
    icon: Search,
    title: 'Discover',
    description: 'We dive deep into your business goals, target audience, and competitive landscape to create a solid foundation.',
  },
  {
    icon: Palette,
    title: 'Design',
    description: 'Our designers craft beautiful, user-centric interfaces that align with your brand and convert visitors.',
  },
  {
    icon: Code,
    title: 'Build',
    description: 'Clean, performant code brought to life with cutting-edge technologies and best practices.',
  },
  {
    icon: TestTube,
    title: 'QA',
    description: 'Rigorous testing across devices, browsers, and scenarios to ensure flawless functionality.',
  },
  {
    icon: Rocket,
    title: 'Launch',
    description: 'Smooth deployment with monitoring, analytics, and training to ensure a successful go-live.',
  },
  {
    icon: TrendingUp,
    title: 'Grow',
    description: 'Ongoing support, optimization, and iterative improvements to maximize your ROI.',
  },
];

const Process = () => {
  return (
    <div className="min-h-screen pt-32 pb-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl lg:text-display-lg font-display mb-6">
            Our <span className="text-gradient">Process</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A proven methodology that delivers exceptional results every time
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="absolute left-[2.75rem] top-[5.5rem] w-0.5 h-16 bg-gradient-to-b from-primary to-accent" />
              )}

              <div className="flex gap-6 mb-8">
                <div className="shrink-0">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center shadow-glow">
                    <step.icon className="h-10 w-10 text-primary" />
                  </div>
                </div>
                <Card className="flex-1 border-border/50 hover:border-primary/50 transition-all hover:shadow-medium">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-4xl font-display font-bold text-muted-foreground/20">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <h3 className="text-2xl font-display font-bold">{step.title}</h3>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-16 p-12 rounded-3xl glass"
        >
          <h2 className="text-3xl font-display font-bold mb-4">
            Timeline & Investment
          </h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Most projects are completed within 6-12 weeks, depending on scope and complexity.
            We provide transparent timelines and milestone-based payments for your peace of mind.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Process;
