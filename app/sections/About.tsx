import React from "react";
import { Badge } from "@/components/ui/badge";

/**
 * Render the "About" section presenting the event overview and organizing partners.
 *
 * The section includes a decorative background, a labeled badge, a headline with
 * highlighted gradient text, an explanatory paragraph about IT trends, and a
 * styled informational block describing "AGH IT Future Day" and its partners.
 *
 * @returns A JSX element representing the About section of the page
 */
export default function About() {
  return (
    <section
      id="about"
      className="py-24 container mx-auto px-6 lg:px-12 relative overflow-hidden"
    >
      <div className="absolute top-1/2 right-50 -translate-y-1/2 w-[300px] h-[300px] bg-brand-violet/15 blur-[100px] rounded-full -z-10 pointer-events-none" />
      <div className="absolute top-1/2 left-30 -translate-y-1/2 w-[300px] h-[300px] bg-brand-pink/15 blur-[100px] rounded-full -z-10 pointer-events-none" />

      <div className="max-w-4xl mx-auto text-center space-y-8">
        <Badge
          variant="outline"
          className="border-brand-red text-brand-red px-4 py-1 text-sm uppercase tracking-widest"
        >
          O wydarzeniu
        </Badge>

        <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
          Gdzie pomysły nabierają mocy, <br />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-brand-red to-brand-pink">
            a kariery kierunku
          </span>
        </h2>

        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
          Sektor IT zmienia się szybciej niż kiedykolwiek wcześniej - napędzany
          przez sztuczną inteligencję, analizę danych i nowe technologie, które
          redefiniują sposób, w jaki pracujemy, uczymy się i tworzymy innowacje.
        </p>

        <div className="text-left bg-secondary/30 p-8 rounded-2xl border border-border/50 backdrop-blur-sm">
          <p className="text-lg leading-relaxed">
            <strong className="text-foreground">AGH IT Future Day</strong> to
            nowe wydarzenie organizowane przez{" "}
            <span className="font-semibold text-brand-violet">
              Wydział Informatyki AGH
            </span>
            ,{" "}
            <span className="font-semibold text-brand-pink">
              Fundację Try IT
            </span>
            ,{" "}
            <span className="font-semibold text-brand-red">
              Centrum Spraw Studenckich AGH
            </span>{" "}
            i{" "}
            <span className="font-semibold text-brand-softPink">
              Wydziałową Radę Samorządu Studentów WI AGH
            </span>
            . Łączymy perspektywy studentów, naukowców i biznesu, tworząc
            program odpowiadający na realne potrzeby rynku.
          </p>
        </div>
      </div>
    </section>
  );
}