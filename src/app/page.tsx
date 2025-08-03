
import Hero from '@/components/ui/hero';
import LogoScroller from '@/components/ui/logo-scroller';
import Features from '@/components/ui/features';
import CTA from '@/components/ui/cta';
import Footer from '@/components/ui/footer';

export default function Home() {
  return (
    <main>
      <Hero />
      <LogoScroller />
      <Features />
      <CTA />
      <Footer />
    </main>
  );
}
