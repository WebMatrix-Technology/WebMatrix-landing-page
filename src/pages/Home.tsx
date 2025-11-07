import { Hero } from '@/components/home/Hero';
import { FeaturedWork } from '@/components/home/FeaturedWork';
import { Services } from '@/components/home/Services';
import { Testimonials } from '@/components/home/Testimonials';
import { CTA } from '@/components/home/CTA';

const Home = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <FeaturedWork />
      <Services />
      <Testimonials />
      <CTA />
    </div>
  );
};

export default Home;
