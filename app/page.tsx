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

/**
 * Render the homepage composed of the primary site sections inside a main container.
 *
 * @returns The React element for the homepage, containing Hero, Highlights, About, TargetAudience, Topics, Competition, WhyParticipate, Organizers, and Contact sections.
 */
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