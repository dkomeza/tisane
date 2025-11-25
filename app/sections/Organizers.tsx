import React from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

/**
 * Renders the "Organizatorzy" section displaying a responsive grid of organizers.
 *
 * Each organizer is shown as a square placeholder logo (first letter of the name),
 * a bold name, and a short description.
 *
 * @returns A JSX element representing the organizers section with a responsive grid of items.
 */
export default function Organizers() {
  const organizers = [
    {
      name: "Wydział Informatyki AGH",
      desc: "Kształci przyszłych liderów technologii w obszarach takich jak programowanie, AI, Data Science, cyberbezpieczeństwo, IoT czy uczenie maszynowe.",
      img: "/Logo_WI_AGH.png",
    },
    {
      name: "Fundacja Try IT",
      desc: "Wspiera rozwój kompetencji cyfrowych i równe szanse w dostępie do edukacji technologicznej.",
      img: "/Logo_TryIt.png",
    },
    {
      name: "WRSS WI AGH",
      desc: "Wspiera rozwój naukowy i integrację środowiska studenckiego.",
      img: "/Logo_WRSS_WI.png",
    },
    {
      name: "Centrum Spraw Studenckich AGH",
      desc: "Zapewnia wsparcie, stypendia, świadczenia i pomoc psychologiczną dla studentów.",
      img: "/Logo_CSS.png",
    },
  ];

  return (
    <section id="organizers" className="py-24 container mx-auto px-6 lg:px-12">
      <h2 className="text-3xl font-bold mb-12 text-center uppercase tracking-widest">
        Organizatorzy
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {organizers.map((org, idx) => (
          <div key={idx} className="group text-center">
            <div className=" aspect-square border-2 border-brand-softPink/10 bg-white overflow-hidden rounded-2xl mb-4 flex items-center justify-center text-2xl font-bold text-muted-foreground">
              <Image src={org.img} width={250} height={250} alt={org.name} />
            </div>
            <h3 className="font-bold text-sm md:text-base">{org.name}</h3>
            <p className="text-xs text-muted-foreground mt-1 text-left">
              {org.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
