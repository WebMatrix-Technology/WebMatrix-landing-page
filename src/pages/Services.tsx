import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';

const packages = [
  {
    name: 'Starter',
    price: '₹5,000',
    description: 'Perfect for small businesses and startups',
    features: [
      'Up to 5 pages',
      'Responsive design',
      'SEO optimization',
      'Contact forms',
      'Basic animations',
      '1 month support',
    ],
  },
  {
    name: 'Professional',
    price: '₹15,000',
    description: 'For growing businesses that need more',
    features: [
      'Up to 15 pages',
      'Custom design system',
      'Advanced animations',
      'CMS integration',
      '3D elements',
      'Performance optimization',
      '3 months support',
      'Analytics setup',
    ],
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'Full-scale applications with premium features',
    features: [
      'Unlimited pages',
      'Custom functionality',
      'Full-stack development',
      'Advanced 3D/WebGL',
      'API integrations',
      'Security audit',
      '6+ months support',
      'Dedicated team',
    ],
  },
];

const Services = () => {
  return (
    <div className="min-h-screen pt-32 pb-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl lg:text-display-lg font-display mb-6">
            Our <span className="text-gradient">Services</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Choose the perfect package for your project needs
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {packages.map((pkg, index) => (
            <motion.div
              key={pkg.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`h-full relative ${pkg.popular ? 'border-primary shadow-glow' : 'border-border/50'}`}>
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                <CardContent className="p-8">
                  <h3 className="text-2xl font-display font-bold mb-2">{pkg.name}</h3>
                  <div className="text-4xl font-bold text-primary mb-4">{pkg.price}</div>
                  <p className="text-muted-foreground mb-6">{pkg.description}</p>
                  <ul className="space-y-3 mb-8">
                    {pkg.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-success shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button asChild className="w-full" variant={pkg.popular ? 'default' : 'outline'}>
                    <Link to="/contact">Get Started</Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Process Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <h2 className="text-3xl md:text-4xl font-display mb-4">
            Not sure which package?
          </h2>
          <p className="text-muted-foreground mb-6">
            Let's discuss your project and find the perfect fit
          </p>
          <Button asChild size="lg">
            <Link to="/contact">Schedule a Call</Link>
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default Services;
