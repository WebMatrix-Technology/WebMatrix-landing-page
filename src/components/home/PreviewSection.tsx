import { motion } from 'framer-motion';
import { DevicePreview } from '@/components/ui/device-preview';
import { projects } from '@/data/projects';

export const PreviewSection = () => {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-display mb-6">
            Latest <span className="text-gradient">Work</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our featured project showcasing our attention to detail and commitment to excellence.
          </p>
        </motion.div>

        {projects[0] && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-6xl mx-auto"
          >
            {/* Container with padding for mobile preview overflow */}
            <div className="relative px-16 pb-16">
              {/* Desktop preview */}
              <div className="relative w-full">
                <DevicePreview
                  desktopImage={projects[0].image}
                  mobileImage={projects[0].mobileImage}
                  title={projects[0].title}
                  className="mx-auto"
                  display="both"
                />
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};