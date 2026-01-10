'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Award, Users, Zap, Target, TrendingUp, CheckCircle2, Sparkles, Linkedin, Mail, Github } from 'lucide-react';

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
    name: 'Jay Tiwary',
    role: 'CEO & Founder',
    bio: 'A passionate entrepreneur with a knack for building innovative digital solutions. With a background in computer science and business, Jay is dedicated to creating meaningful impact through technology. He is the driving force behind the company, ensuring that every project is delivered with precision and excellence. He is a 10x developer and a master of his craft.',
  },
  {
    name: 'Abhi Singh',
    role: 'Lead Developer',
    bio: 'A full-stack engineering expert specializing in modern web technologies and performance optimization. With expertise across React, Node.js, and cloud architectures, Abhi builds scalable, high-performance applications that exceed client expectations. Passionate about clean code, best practices, and mentoring the next generation of developers.',
  },
  {
    name: 'Shubham Mulye',
    role: 'Sr. Designer',
    bio: 'A creative design leader with a keen eye for aesthetics and user experience. Specializes in crafting intuitive interfaces that blend beautiful visuals with functional design. Expert in design systems, prototyping, and translating complex requirements into elegant, user-centric solutions that drive engagement and conversions.',
  },
  {
    name: 'Pawan Mishra',
    role: 'Manager',
    bio: 'A strategic operations leader with expertise in project management, team coordination, and client relations. Pawan ensures seamless project delivery by aligning resources, managing timelines, and maintaining clear communication. Known for building high-performing teams and fostering a collaborative environment that drives innovation and excellence.',
  },
  {
    name: 'Mahadev Patil',
    role: 'Content and Blog Writer',
    bio: 'A skilled wordsmith with expertise in crafting compelling narratives that resonate with audiences. Specializes in SEO-optimized content, technical writing, and storytelling that drives engagement and conversions.',
  },
  {
    name: 'Ishita Naik',
    role: 'Social Media Manager',
    bio: 'A creative strategist who transforms brands through innovative social media campaigns. Expert in community building, content curation, and analytics-driven growth strategies that amplify brand presence across platforms.',
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-32 pb-24 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm font-medium mb-6"
          >
            <Sparkles className="h-4 w-4 text-accent" />
            <span>Our Story</span>
          </motion.div>
          <h1 className="text-5xl md:text-6xl lg:text-display-lg font-display mb-6">
            About <span className="text-gradient">Us</span>
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            We're a team of passionate designers, developers, and creative technologists 
            dedicated to pushing the boundaries of what's possible on the web. 
            We've helped over 10 companies transform their digital presence with 
            cutting-edge web experiences.
          </p>
        </motion.div>

        <section className="mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display mb-4">
              Our <span className="text-gradient">Values</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Card className="h-full border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-glow hover:-translate-y-1 group cursor-pointer">
                  <CardContent className="p-8">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="mb-6 w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center group-hover:from-primary/30 group-hover:to-accent/30 transition-all duration-300"
                    >
                      <value.icon className="h-10 w-10 text-primary group-hover:text-accent transition-colors duration-300" />
                    </motion.div>
                    <h3 className="text-xl font-display font-semibold mb-3 group-hover:text-primary transition-colors duration-300">
                      {value.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{value.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display mb-4">
              Meet the <span className="text-gradient">Team</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Talented individuals united by a passion for creating exceptional web experiences
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  delay: index * 0.1, 
                  duration: 0.6,
                  ease: [0.22, 1, 0.36, 1]
                }}
              >
                <Card className="h-full border-border/50 hover:border-primary/50 transition-all duration-500 hover:shadow-glow hover:-translate-y-2 group relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                  
                  <CardContent className="p-8 relative z-10">
                    <div className="flex flex-col items-center text-center">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="mb-6"
                      >
                        <Avatar className="w-32 h-32 mx-auto ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all duration-300">
                          <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/20 text-primary text-3xl font-semibold">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                      </motion.div>
                      
                      <div className="mb-4">
                        <h3 className="text-2xl font-display font-semibold mb-2 group-hover:text-gradient transition-all duration-300">
                          {member.name}
                        </h3>
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 group-hover:bg-primary/20 border border-primary/20 group-hover:border-primary/40 transition-all duration-300">
                          <span className="text-primary text-sm font-medium">{member.role}</span>
                        </div>
                      </div>
                      
                      <p className="text-muted-foreground text-sm leading-relaxed mb-6 min-h-[4.5rem]">
                        {member.bio}
                      </p>
                      
                      <div className="flex items-center gap-3 pt-4 border-t border-border/50 group-hover:border-primary/30 transition-colors duration-300">
                        <motion.a
                          href="#"
                          whileHover={{ scale: 1.2, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          className="w-10 h-10 rounded-lg bg-card border border-border/50 hover:border-primary/50 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300"
                          aria-label="LinkedIn"
                        >
                          <Linkedin className="h-4 w-4" />
                        </motion.a>
                        <motion.a
                          href="#"
                          whileHover={{ scale: 1.2, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          className="w-10 h-10 rounded-lg bg-card border border-border/50 hover:border-primary/50 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300"
                          aria-label="Email"
                        >
                          <Mail className="h-4 w-4" />
                        </motion.a>
                        <motion.a
                          href="#"
                          whileHover={{ scale: 1.2, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          className="w-10 h-10 rounded-lg bg-card border border-border/50 hover:border-primary/50 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300"
                          aria-label="GitHub"
                        >
                          <Github className="h-4 w-4" />
                        </motion.a>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-24"
        >
          <div className="grid md:grid-cols-3 gap-6">
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              className="p-10 rounded-2xl glass border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-glow text-center group"
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center group-hover:from-primary/30 group-hover:to-accent/30 transition-all duration-300">
                <CheckCircle2 className="h-8 w-8 text-primary" />
              </div>
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-5xl md:text-6xl font-display font-bold text-gradient mb-3"
              >
                10+
              </motion.div>
              <p className="text-muted-foreground font-medium">Projects Delivered</p>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              className="p-10 rounded-2xl glass border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-glow text-center group"
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center group-hover:from-primary/30 group-hover:to-accent/30 transition-all duration-300">
                <TrendingUp className="h-8 w-8 text-accent" />
              </div>
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="text-5xl md:text-6xl font-display font-bold text-gradient mb-3"
              >
                90+
              </motion.div>
              <p className="text-muted-foreground font-medium">Avg. Lighthouse Score</p>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              className="p-10 rounded-2xl glass border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-glow text-center group"
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center group-hover:from-primary/30 group-hover:to-accent/30 transition-all duration-300">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="text-5xl md:text-6xl font-display font-bold text-gradient mb-3"
              >
                100%
              </motion.div>
              <p className="text-muted-foreground font-medium">Client Satisfaction</p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
