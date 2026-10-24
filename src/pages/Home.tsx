import Hero from '../components/sections/Hero';
import ServiceGrid from '../components/sections/ServiceGrid';
import ProcessSteps from '../components/sections/ProcessSteps';
import WhyVeltrion from '../components/sections/WhyVeltrion';
import Marquee3D from '../components/sections/Marquee3D';
import PageSections from '../components/layout/PageSections';

export default function Home() {
  const sections = {
    hero: <Hero />,
    services: <ServiceGrid />,
    process: <ProcessSteps />,
    why: <WhyVeltrion />,
  };

  return (
    <>
      <PageSections page="home" sections={sections} />
      {/* Signature 3D scroll band — always on, between the Why section and footer. */}
      <Marquee3D />
    </>
  );
}
