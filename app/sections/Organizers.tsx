import React from "react";
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
    { name: "Wydział Informatyki AGH", desc: "Liderzy technologii" },
    { name: "Fundacja Try IT", desc: "Rozwój kompetencji" },
    { name: "WRSS WI AGH", desc: "Samorząd studencki" },
    { name: "Centrum Spraw Studenckich", desc: "Wsparcie studentów" },
  ];

  return (
    <section id="organizers" className="py-24 container mx-auto px-6 lg:px-12">
      <h2 className="text-3xl font-bold mb-12 text-center text-muted-foreground uppercase tracking-widest text-sm">
        Organizatorzy
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {organizers.map((org, idx) => (
          <div key={idx} className="group text-center">
            <div className="aspect-square bg-secondary rounded-2xl mb-4 flex items-center justify-center text-2xl font-bold text-muted-foreground group-hover:bg-brand-red/5 group-hover:text-brand-red transition-colors duration-300">
              {/* Placeholder for Logo */}
              {org.name.charAt(0)}
            </div>
            <h3 className="font-bold text-sm md:text-base">{org.name}</h3>
            <p className="text-xs text-muted-foreground mt-1">{org.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}