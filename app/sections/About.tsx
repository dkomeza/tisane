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
          Wiedza. <br />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-brand-red to-brand-pink">
            Technologie. Relacje.
          </span>
        </h2>

        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
          Sektor IT zmienia się szybciej niż kiedykolwiek wcześniej – napędzany
          przez sztuczną inteligencję, dane i nowe technologie. Ale dziś to nie tylko kwestia tego, co działa. Coraz częściej kluczowe jest to, czy rozwiązanie ma sens, skaluje się i odpowiada na realne potrzeby.
        </p>

        <div className="text-left bg-secondary/30 p-8 rounded-2xl border border-border/50 backdrop-blur-sm">
          <p className="text-lg leading-relaxed mb-4">
            <strong className="text-foreground">AGH IT Future Day</strong> to wydarzenie, które pokazuje praktyczną stronę IT: moment, w którym projekt przestaje być koncepcją, a zaczyna działać w praktyce.
          </p>
          <p className="text-lg leading-relaxed">
            Łączymy studentów, naukowców i praktyków biznesu, żeby wspólnie rozmawiać o tym, jak naprawdę wygląda współczesna branża IT. Tego nie nauczysz się na wykładach!
          </p>
        </div>
      </div>
    </section>
  );
}
