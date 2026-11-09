import { FeatureCards } from '@/component/home/feature.cards';
import { Hero } from '@/component/home/hero';
import { SiteNav } from '@/component/home/site.nav';

export default function Home() {
  return (
    <>
      <SiteNav />
      <main className="flex-1 bg-canvas">
        <Hero />
        <FeatureCards />
      </main>
    </>
  );
}
