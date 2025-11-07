import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Award, Users, Zap, Target } from 'lucide-react';

const values = [
  {
    icon: Target,
    title: 'User-First',
    description: 'Every decision we make prioritizes the end user experience',
  },
  {
    icon: Zap,
    title: 'Performance',
    description: 'Lightning-fast, optimized experiences are our standard',
  },
  {
    icon: Users,
    title: 'Collaboration',
    description: 'We work as an extension of your team, not just a vendor',
  },
  {
    icon: Award,
    title: 'Excellence',
    description: 'Quality and attention to detail in every pixel and line of code',
  },
];

const team = [
  {
    name: 'Alex Morgan',
    role: 'Founder & Creative Director',
    bio: '10+ years crafting digital experiences',
  },
  {
    name: 'Jordan Lee',
    role: 'Lead Developer',
    bio: 'Full-stack expert & performance enthusiast',
  },
  {
    name: 'Sam Rivera',
    role: 'UX Designer',
    bio: 'Turning complex problems into elegant solutions',
  },
  {
    name: 'Casey Kim',
    role: '3D Specialist',
    bio: 'WebGL wizard & creative technologist',
  },
];

const About = () => {
  return (
    <div className="min-h-screen pt-32 pb-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl lg:text-display-lg font-display mb-6">
            About <span className="text-gradient">Us</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto leading-relaxed">
            We're a team of passionate designers, developers, and creative technologists 
            dedicated to pushing the boundaries of what's possible on the web. Since 2018, 
            we've helped over 50 companies transform their digital presence with 
            cutting-edge web experiences.
          </p>
        </motion.div>

        {/* Values */}
        <section className="mb-20">
          <h2 className="text-3xl md:text-4xl font-display text-center mb-12">
            Our <span className="text-gradient">Values</span>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full border-border/50 hover:border-primary/50 transition-all hover:shadow-medium text-center">
                  <CardContent className="p-6">
                    <div className="mb-4 w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                      <value.icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-display font-semibold mb-2">{value.title}</h3>
                    <p className="text-muted-foreground text-sm">{value.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Team */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-display mb-4">
              Meet the <span className="text-gradient">Team</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Talented individuals united by a passion for creating exceptional web experiences
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
              >
                <Card className="border-border/50 hover:border-primary/50 transition-all hover:shadow-medium text-center">
                  <CardContent className="p-6">
                    <Avatar className="w-24 h-24 mx-auto mb-4">
                      <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="text-xl font-display font-semibold mb-1">{member.name}</h3>
                    <p className="text-primary text-sm mb-2">{member.role}</p>
                    <p className="text-muted-foreground text-sm">{member.bio}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-20 grid md:grid-cols-3 gap-8 text-center"
        >
          <div className="p-8 rounded-2xl glass">
            <div className="text-5xl font-display font-bold text-gradient mb-2">50+</div>
            <p className="text-muted-foreground">Projects Delivered</p>
          </div>
          <div className="p-8 rounded-2xl glass">
            <div className="text-5xl font-display font-bold text-gradient mb-2">95+</div>
            <p className="text-muted-foreground">Avg. Lighthouse Score</p>
          </div>
          <div className="p-8 rounded-2xl glass">
            <div className="text-5xl font-display font-bold text-gradient mb-2">100%</div>
            <p className="text-muted-foreground">Client Satisfaction</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
