import {
  Highlights,
  About,
  TargetAudience,
  Topics,
  Competition,
  WhyParticipate,
  Organizers,
  Contact,
} from "./sections";
import Hero from "./sections/Hero";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Highlights />
      <About />
      <TargetAudience />
      <Topics />
      <Competition />
      <WhyParticipate />
      <Organizers />
      <Contact />
    </main>
  );
}
