// src/data/newproject.ts

import { Project } from './projects';

export const newProjects: Project[] = [
  {
    id: 12,
    title: 'Estate Canvas',
    description: 'Modern real estate platform with beautiful property listings and interactive features.',
    category: 'Real Estate',
    tags: ['Next.js', 'React', 'Tailwind CSS', 'Real Estate', 'Property Listings'],
    image: '/work/estate-canvas.png',
    mobileImage: '/work/estate-canvas-mobile.png',
    longDescription:
      'A sophisticated real estate platform designed to showcase properties with stunning visuals and intuitive navigation. Features include advanced search filters, interactive property maps, virtual tours, and seamless user experience for both buyers and sellers.',
    websiteUrl: 'https://estate-canvas.vercel.app/',
    metrics: {
      improvement: 'User Engagement',
      metric: '+60%'
    },
    isFeatured: true,
    featuredOrder: 1
  },
  {
    id: 13,
    title: 'Aura Cafe Studio',
    description: 'Elegant cafe and studio website with modern design and smooth animations.',
    category: 'Food & Beverage',
    tags: ['Next.js', 'React', 'Tailwind CSS', 'Framer Motion', 'Cafe'],
    image: '/work/aura-cafe.png',
    mobileImage: '/work/aura-cafe-mobile.png',
    longDescription:
      'A beautifully crafted website for a modern cafe and creative studio. Features include menu displays, event booking, gallery showcases, and an immersive experience that captures the essence of the brand. Designed with attention to detail and smooth user interactions.',
    websiteUrl: 'https://aura-cafe-studio.vercel.app/',
    metrics: {
      improvement: 'Lighthouse Score',
      metric: '96/100'
    },
    isFeatured: true,
    featuredOrder: 2
  },
];

