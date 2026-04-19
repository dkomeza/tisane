import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Trophy,
  ArrowRight,
  ClipboardList,
  FileImage,
  UserCheck,
  Send,
  CalendarClock,
  CheckCircle2,
  Download,
} from "lucide-react";

export default function Competition() {
  return (
    <section id="contest" className="py-24 relative">
      {/* <div className="absolute inset-0 bg-linear-to-b from-brand-violet/5 to-transparent -z-10" /> */}

      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 xl:gap-24 2xl:gap-32 items-start relative">
          {/* --- LEFT COLUMN: Description & Buttons --- */}
          <div className="flex-1 space-y-8">
            <Badge className="bg-brand-violet hover:bg-brand-violet/90 text-white border-none px-4 py-1">
              IT is ME
            </Badge>

            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
              Moc innowacji <br />
              <span className="text-brand-violet">studenckich</span>
            </h2>

            {/* Intro - High contrast, slightly larger */}
            <p className="text-lg text-foreground/90 leading-relaxed">
              Konkurs <strong>IT is ME</strong> to jeden z najważniejszych
              elementów AGH IT Future Day – przestrzeń do zaprezentowania
              innowacji studenckich wykorzystujących metody IT. Do udziału
              zapraszamy min. 2-osobowe zespoły z uczelni publicznych i
              niepublicznych z całej Polski.
            </p>

            {/* Jury section - Standard readable text */}
            <p className="text-base text-foreground/80 leading-7">
              W jury zasiądą naukowcy, dydaktycy, innowatorzy i przedstawiciele
              firm partnerskich, którzy ocenią projekty, podzielą się
              doświadczeniem i pomogą autorom rozwijać ich pomysły.
            </p>

            {/* History Blockquote - More prominent */}
            <div className="pl-6 border-l-4 border-brand-violet/30 italic text-foreground/80 py-2 bg-brand-violet/5 rounded-r-lg">
              Poprzednie edycje IT is ME pokazały, że kreatywność studentów nie
              zna granic – od rozwiązań dla medycyny i ekologii, przez
              technologie kosmiczne i transport, po systemy wspierające
              bezpieczeństwo i jakość życia.
            </div>

            {/* Criteria - Transformed into a clean list for readability */}
            <div className="space-y-3">
              <h4 className="font-bold text-foreground">
                Co bierzemy pod uwagę?
              </h4>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-foreground/80">
                {[
                  "Innowacyjne wykorzystanie IT",
                  "Społeczna użyteczność",
                  "Odpowiedź na współczesne potrzeby",
                  "Praktyczność zastosowania",
                  "Możliwość szybkiej implementacji",
                  "Poziom zaawansowania",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-brand-pink shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Finals Info - Highlighted */}
            <p className="text-lg font-semibold text-foreground border-b pb-4 border-border">
              Finał konkursu – prezentacje 10 wybranych projektów – odbędzie się
              12.05.2026.
            </p>

            {/* MOTIVATION: Clean text */}
            <div className="bg-brand-violet/10 border border-brand-violet/30 p-6 rounded-xl mt-6">
              <p className="text-xl font-bold text-center mb-4">
                <span className="text-brand-violet">Zgłoszenia zakończone</span>{" "}
                – zapraszamy na finał 12 maja na Wydziale Informatyki AGH!
              </p>
              <div className="flex justify-center">
                <a href="/Regulamin wydarzenia_AGH IT Future Day.docx" download>
                  <Button
                    variant="outline"
                    className="border-brand-violet text-brand-violet hover:bg-brand-violet/10 cursor-pointer"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Pobierz regulamin konkursu
                  </Button>
                </a>
              </div>
            </div>
          </div>

          {/* --- RIGHT COLUMN: Finals Card AND Step-by-Step --- */}
          <div className="flex-1 w-full space-y-6 lg:space-y-8 sticky top-24 self-start">
            {/* 1. Finals Details Card */}
            <div className="relative bg-background/40 backdrop-blur-xl border border-white/10 dark:border-white/5 rounded-2xl p-8 shadow-xl">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Trophy className="w-48 h-48" />
              </div>

              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Trophy className="w-6 h-6 text-yellow-500" />
                Finał Konkursu
              </h3>

              <div className="space-y-4 font-mono text-sm">
                <div className="flex justify-between border-b border-border/50 pb-2">
                  <span className="text-muted-foreground">Data:</span>
                  <span className="font-bold">12.05.2026</span>
                </div>
                <div className="flex justify-between border-b border-border/50 pb-2">
                  <span className="text-muted-foreground">Miejsce:</span>
                  <span className="font-bold text-right">
                    Wydział Informatyki AGH
                  </span>
                </div>
                <div className="flex justify-between border-b border-border/50 pb-2">
                  <span className="text-muted-foreground">Finaliści:</span>
                  <span className="font-bold">10 Zespołów</span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-black/20 p-8 rounded-2xl border border-brand-violet/60 shadow-lg text-center flex flex-col items-center justify-center space-y-6">
              <div className="w-16 h-16 bg-brand-violet/20 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-brand-violet" />
              </div>
              <h3 className="text-2xl font-bold">Zgłoszenia zakończone!</h3>
              <p className="text-lg text-muted-foreground">
                Dziękujemy za wszystkie przesłane projekty. Do zobaczenia na
                finale!
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
