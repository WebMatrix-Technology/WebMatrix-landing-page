// src/data/projects.ts

export interface Project {
  id: number;
  title: string;
  description: string;
  category: string;
  tags: string[];
  image: string;
  mobileImage?: string; // Mobile screenshot
  gallery?: string[]; // Multiple images for slider
  metrics?: { improvement: string; metric: string };
  longDescription?: string; // For the detail page
  websiteUrl?: string; // For external links
  videoSrc?: string; // For the video embed
}

export const projects: Project[] = [
  {
    id: 11,
    title: 'Photography Portfolio Template',
    description: 'Modern, responsive portfolio template for photographers and visual artists.',
    category: 'Portfolio',
    tags: ['Next.js', 'React', 'Tailwind CSS', 'Framer Motion', 'Photography'],
    image: '/work/photography/photogrphy.png',
    mobileImage: '/work/photography/photography-mobile.png',
    longDescription: 
      'A sophisticated portfolio template designed specifically for photographers and visual artists. Features include a masonry gallery layout, smooth page transitions, image lightbox, and contact form integration. The design emphasizes visual storytelling while maintaining optimal performance.',
    websiteUrl: 'https://photography-template-five.vercel.app',
    metrics: {
      improvement: 'Lighthouse Score',
      metric: '98/100'
    }
  },
  {
    id: 7,
    title: 'CryptoTrade Platform',
    description: 'Next-gen crypto trading platform with advanced features and security.',
    category: 'FinTech',
    tags: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Real-time Data', 'Crypto'],
    image: '/work/ai-trading-dashboard.png',
    mobileImage: '/work/ai-trading-mobile.png',
    longDescription:
      'Experience seamless cryptocurrency trading with advanced features, real-time analytics, and institutional-grade security. The platform offers a comprehensive dashboard, detailed reports, and a robust trading interface.',
    websiteUrl: 'https://ai-trading-platform-psi.vercel.app/',
    metrics: { improvement: 'Security Score', metric: '98/100' }
  },
  {
    id: 8,
    title: 'AegisVPN Hosting',
    description: 'Enterprise-grade VPN hosting with ultra-secure infrastructure.',
    category: 'SaaS / Hosting',
    tags: ['Next.js', 'React', 'Tailwind CSS', 'Security'],
    image: '/work/vps-hosting-landing.png',
    mobileImage: '/work/vps-hosting-mobile.png',
    longDescription:
      'Next-gen VPN hosting powered by AMD compute and industry-leading infrastructure. Features enterprise-grade security, ultra-fast speeds, and comprehensive documentation.',
    websiteUrl: 'https://vpshosting.vercel.app/',
    metrics: { improvement: 'Speed Score', metric: '95/100' }
  },
  {
    id: 9,
    title: 'NEX Api Platform',
    description: 'Multi-channel CPaaS platform for enterprise communication.',
    category: 'SaaS / API',
    tags: ['Next.js', 'React', 'Tailwind CSS', 'TypeScript'],
    image: '/work/nexapi-platform.png',
    mobileImage: '/work/nexapi-mobile.png',
    longDescription:
      'A powerful multi-channel CPaaS platform that accelerates lead generation, drives commerce and sales, and delights customers with personalized support. Operating in 200+ countries with 220+ carriers.',
    websiteUrl: 'https://nexapi.netlify.app/',
    metrics: { improvement: 'Uptime', metric: '99.99%' }
  },
  {
    id: 10,
    title: 'Cuirkrafts Leather Store',
    description: 'Premium leather goods e-commerce platform.',
    category: 'E-commerce',
    tags: ['Next.js', 'Tailwind CSS', 'E-commerce'],
    image: '/work/leather-store.png',
    mobileImage: '/work/leather-store-mobile.png',
    longDescription:
      'Timeless leather bags that blend premium craftsmanship with modern functionality. Each piece tells a story of dedication to quality. Features a luxurious shopping experience with 15+ years of crafting excellence.',
    websiteUrl: 'https://cuirkrafts-leather.netlify.app/',
    metrics: { improvement: 'Conversion Rate', metric: '+45%' }
  },
];
