import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin, Mail } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-1">
            <h3 className="text-xl font-display font-bold text-gradient mb-4">WebMatrix</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Crafting fast, beautiful web experiences with 3D and motion design.
            </p>
            <div className="flex gap-3">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" 
                className="text-muted-foreground hover:text-primary transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="mailto:hello@webmatrix.com"
                className="text-muted-foreground hover:text-primary transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">About</Link></li>
              <li><Link to="/work" className="text-muted-foreground hover:text-primary transition-colors">Work</Link></li>
              <li><Link to="/process" className="text-muted-foreground hover:text-primary transition-colors">Process</Link></li>
              <li><Link to="/blog" className="text-muted-foreground hover:text-primary transition-colors">Blog</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/services" className="text-muted-foreground hover:text-primary transition-colors">Web Design</Link></li>
              <li><Link to="/services" className="text-muted-foreground hover:text-primary transition-colors">Development</Link></li>
              <li><Link to="/services" className="text-muted-foreground hover:text-primary transition-colors">3D & WebGL</Link></li>
              <li><Link to="/services" className="text-muted-foreground hover:text-primary transition-colors">Performance</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Get in Touch</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>hello@webmatrix.com</li>
              <li>+1 (555) 123-4567</li>
              <li className="pt-2">
                <Link to="/contact" className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:shadow-glow transition-all">
                  Start a Project
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} WebMatrix. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
