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
            <p className="text-foreground/90 font-light -mt-2">
              Niezależnie od tego, czy Wasz projekt jest na etapie badań i
              testów, czy też ma już za sobą pierwsze wdrożenie – weźcie udział
              w konkursie!
            </p>
            <div className="flex flex-col gap-4 pt-4">
              <a
                href="https://forms.office.com/e/nbZ7xL0EAm"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full"
              >
                <Button
                  size="lg"
                  className="bg-brand-violet hover:bg-brand-purple text-white shadow-lg shadow-brand-violet/20 cursor-pointer w-full"
                >
                  Zgłoś projekt <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </a>
              <div className="flex flex-wrap gap-4">
                <a
                  href="/Regulamin_ITisME_ogolnopolski.docx"
                  className="flex-1"
                  download
                >
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-brand-violet text-brand-violet hover:bg-brand-violet/10 cursor-pointer w-full"
                  >
                    Regulamin konkursu
                  </Button>
                </a>
                <a
                  href="/Oswiadczenie-opiekuna_naukowego.docx"
                  className="flex-1"
                  download
                >
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-brand-pink text-brand-pink hover:bg-brand-pink/10 cursor-pointer w-full"
                  >
                    Oświadczenie opiekuna
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

            {/* 2. Step by Step Guide Card */}
            <div className="bg-white dark:bg-black/20 p-8 rounded-2xl border border-brand-violet/60 shadow-lg">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                Jak wziąć udział?
              </h3>

              <div className="space-y-6 relative">
                {/* Connecting line for the timeline effect */}
                {/* <div className="absolute left-[19px] top-2 bottom-4 w-0.5 bg-brand-violet/10 -z-10" /> */}

                {/* Step 1 */}
                <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-brand-violet/20 flex items-center justify-center text-brand-violet font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm flex items-center gap-2">
                      <ClipboardList className="w-4 h-4 text-brand-violet" />{" "}
                      Zgłoś zespół
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1 leading-snug">
                      Wypełnij formularz. Pamiętaj – zgłasza tylko{" "}
                      <strong>jeden przedstawiciel</strong>.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-brand-violet/20 flex items-center justify-center text-brand-violet font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm flex items-center gap-2">
                      <FileImage className="w-4 h-4 text-brand-violet" />{" "}
                      Przygotuj wizualizacje
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1 leading-snug">
                      PDF zawierający wyłącznie zrzuty ekranu / grafiki + krótki
                      komentarz.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-brand-violet/20 flex items-center justify-center text-brand-violet font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-brand-violet" /> Zgoda
                      opiekuna
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1 leading-snug">
                      Pobierz i poproś Opiekuna Naukowego o podpis.
                    </p>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-brand-violet/20 flex items-center justify-center text-brand-violet font-bold">
                    4
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm flex items-center gap-2">
                      <Send className="w-4 h-4 text-brand-violet" /> Wyślij
                      zgłoszenie
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1 leading-snug">
                      PDF i skan zgody na{" "}
                      <a
                        href="mailto:itisme@agh.edu.pl"
                        className="text-brand-violet hover:underline"
                      >
                        itisme@agh.edu.pl
                      </a>{" "}
                      (w tytule nazwa projektu).
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom Timeline Section */}
              <div className="mt-8 pt-6 border-t border-dashed border-gray-200 dark:border-gray-700">
                <div className="flex gap-4 items-start">
                  <div className="p-2 bg-brand-pink/10 rounded-lg text-brand-pink">
                    <CalendarClock className="w-5 h-5" />
                  </div>
                  <div className="space-y-1 text-sm">
                    <p className="font-bold text-foreground">
                      Gotowe! A teraz:
                    </p>
                    <div className="grid grid-cols-1 gap-1 text-muted-foreground">
                      <span>
                        Preselekcja:{" "}
                        <span className="font-mono text-brand-violet font-bold">
                          28.04.2026
                        </span>
                      </span>
                      <span>
                        Finał:{" "}
                        <span className="font-mono text-brand-violet font-bold">
                          12.05.2026
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
