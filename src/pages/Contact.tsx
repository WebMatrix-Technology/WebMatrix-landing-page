import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mail, MapPin, Phone } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { apiRequest } from '@/lib/api';

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeline, setTimeline] = useState<string | undefined>(undefined);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const form = new FormData(e.currentTarget);
      const name = String(form.get('name') || '').trim();
      const email = String(form.get('email') || '').trim();
      const budget = String(form.get('budget') || '').trim();
      const message = String(form.get('message') || '').trim();

      // Submit to API (no auth token needed for public endpoint)
      await apiRequest('/api/leads', {
        method: 'POST',
        body: JSON.stringify({
          name,
          email,
          budget: budget || undefined,
          timeline: timeline || undefined,
          message,
        }),
      });

      toast.success('Message sent successfully! We\'ll be in touch soon.');
      (e.target as HTMLFormElement).reset();
      setTimeline(undefined);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl lg:text-display-lg font-display mb-6">
            Get in <span className="text-gradient">Touch</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Ready to start your project? Let's discuss how we can help bring your vision to life.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 space-y-6"
          >
            <Card className="border-border/50">
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Email</h3>
                    <a href="mailto:webmatrix.work@gmail.com" className="text-muted-foreground hover:text-primary transition-colors">
                      webmatrix.work@gmail.com
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                    <Phone className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Phone</h3>
                    <a href="tel:+919112144335" className="text-muted-foreground hover:text-primary transition-colors">
                      +91 9112144335 / +91 7448223550
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center shrink-0">
                    <MapPin className="h-6 w-6 text-success" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Location</h3>
                    <p className="text-muted-foreground">
                      Mumbai, Maharashtra
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-gradient-to-br from-primary/5 to-accent/5">
              <CardContent className="p-6">
                <h3 className="font-display font-semibold text-lg mb-2">Quick Response</h3>
                <p className="text-sm text-muted-foreground">
                  We typically respond within 24 hours. For urgent inquiries, please call us directly.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <Card className="border-border/50">
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name *</Label>
                      <Input id="name" name="name" placeholder="John Doe" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input id="email" name="email" type="email" placeholder="john@example.com" required />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="budget">Budget</Label>
                      <Input id="budget" name="budget" placeholder="Enter budget (e.g., ₹50,000)" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timeline">Timeline</Label>
                      <Select value={timeline} onValueChange={setTimeline}>
                        <SelectTrigger id="timeline">
                          <SelectValue placeholder="Select timeline" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="urgent">ASAP</SelectItem>
                          <SelectItem value="1-2m">1-2 months</SelectItem>
                          <SelectItem value="2-3m">2-3 months</SelectItem>
                          <SelectItem value="3m+">3+ months</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Project Details *</Label>
                    <Textarea 
                      id="message"
                      name="message"
                      placeholder="Tell us about your project..." 
                      className="min-h-[150px]" 
                      required 
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
