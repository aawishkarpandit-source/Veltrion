import Hero from '../components/sections/Hero';
import ServiceGrid from '../components/sections/ServiceGrid';
import ProcessSteps from '../components/sections/ProcessSteps';
import WhyVeltrion from '../components/sections/WhyVeltrion';

export default function Home() {
  return (
    <>
      <Hero />
      <ServiceGrid />
      <ProcessSteps />
      <WhyVeltrion />
    </>
  );
}
