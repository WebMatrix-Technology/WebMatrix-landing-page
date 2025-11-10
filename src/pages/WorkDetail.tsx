// src/pages/WorkDetail.tsx

import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProjects } from '@/data/contentStore';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import NotFound from './NotFound';
import { PreviewModes } from '@/components/work/PreviewModes';
import { MediaSlider } from '@/components/ui/media-slider';

const WorkDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [previewMode, setPreviewMode] = useState<'both' | 'desktop' | 'mobile' | 'video'>(
    'both'
  );
  const project = getProjects().find((p) => p.id === Number(id));

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!project) {
    return <NotFound />;
  }

  return (
    <div className="min-h-screen pt-32 pb-24">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Button variant="outline" asChild>
            <Link to="/work">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to All Work
            </Link>
          </Button>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <Badge className="mb-4" variant="secondary">
            {project.category}
          </Badge>
          <h1 className="text-4xl md:text-5xl lg:text-display-lg font-display mb-4">
            {project.title}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl">{project.description}</p>
        </motion.div>

        {/* Project Preview - keep Desktop/Mobile/Both/Video controls */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-12"
        >
          <PreviewModes
            desktopImage={project.image}
            mobileImage={project.mobileImage}
            videoSrc={project.videoSrc}
            title={project.title}
            mode={previewMode}
            onModeChange={setPreviewMode}
            className="max-w-6xl mx-auto"
            showDevicePreview={previewMode === 'both'}
          />
        </motion.div>

        {/* Gallery Slider reacting to selected mode */}
        {project.gallery && project.gallery.length > 0 && (previewMode === 'desktop' || previewMode === 'mobile') && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="mb-12"
          >
            <div className={previewMode === 'mobile' ? 'max-w-[420px] mx-auto' : 'max-w-6xl mx-auto'}>
              <MediaSlider
                media={project.gallery
                  .filter(src => {
                    const s = src.toLowerCase();
                    const isMobileName = s.includes('mobile') || s.includes('phone') || s.endsWith('-m.png') || s.endsWith('-m.jpg') || s.endsWith('-mobile.png') || s.endsWith('-mobile.jpg');
                    return previewMode === 'mobile' ? isMobileName : !isMobileName;
                  })
                  .map(src => ({ type: 'image' as const, src }))}
                interval={3000}
              />
            </div>
          </motion.div>
        )}
        {/* Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-2 space-y-6"
          >
            <h2 className="text-3xl font-display text-gradient">About the Project</h2>
            <div className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
              <p>{project.longDescription || 'No detailed description available.'}</p>
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="lg:col-span-1"
          >
            <Card className="border-border/50 sticky top-32">
              {project.metrics && (
                <CardHeader>
                  <CardTitle className="text-lg">Key Result</CardTitle>
                  <div className="pt-4">
                    <div className="text-4xl font-bold text-primary">{project.metrics.improvement}</div>
                    <div className="text-sm text-muted-foreground">{project.metrics.metric}</div>
                  </div>
                </CardHeader>
              )}
              <CardContent className={!project.metrics ? 'pt-6' : ''}>
                <h4 className="font-semibold mb-3">Tech Stack</h4>
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {project.websiteUrl && (
                  <Button asChild className="w-full">
                    <a href={project.websiteUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View Live Project
                    </a>
                  </Button>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default WorkDetail;