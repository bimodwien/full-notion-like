import { BuildStatus } from '@/component/home/build.status';
import { Hero } from '@/component/home/hero';
import { SiteNav } from '@/component/home/site.nav';

export default function Home() {
  return (
    <>
      <SiteNav />
      <main className="flex-1">
        <Hero />
        <BuildStatus />
      </main>
    </>
  );
}
