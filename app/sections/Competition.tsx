import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, ArrowRight } from "lucide-react";

export default function Competition() {
  return (
    <section id="contest" className="py-24 relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-brand-violet/5 to-transparent -z-10" />

      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <div className="flex-1 space-y-8">
            <Badge className="bg-brand-violet hover:bg-brand-violet/90 text-white border-none px-4 py-1">
              IT is ME
            </Badge>

            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              Moc innowacji <br />
              <span className="text-brand-violet">studenckich</span>
            </h2>

            <p className="text-lg text-muted-foreground leading-relaxed">
              Konkurs <strong>IT is ME</strong> to przestrzeń do zaprezentowania
              innowacji studenckich. Zapraszamy min. 2-osobowe zespoły z całej
              Polski. Pokażcie, że kreatywność nie zna granic - od medycyny po
              technologie kosmiczne.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button
                size="lg"
                className="bg-brand-violet hover:bg-brand-purple text-white shadow-lg shadow-brand-violet/20"
              >
                Zgłoś projekt <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-brand-violet text-brand-violet hover:bg-brand-violet/10"
              >
                Regulamin konkursu
              </Button>
            </div>
          </div>

          <div className="flex-1 w-full">
            <div className="relative bg-background/40 backdrop-blur-xl border border-white/10 dark:border-white/5 rounded-2xl p-8 md:p-12 shadow-2xl">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Trophy className="w-64 h-64" />
              </div>

              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Trophy className="w-6 h-6 text-yellow-500" />
                Finał Konkursu
              </h3>

              <div className="space-y-6 font-mono text-sm">
                <div className="flex justify-between border-b border-border/50 pb-2">
                  <span className="text-muted-foreground">Data:</span>
                  <span className="font-bold">26.03.2026</span>
                </div>
                <div className="flex justify-between border-b border-border/50 pb-2">
                  <span className="text-muted-foreground">Miejsce:</span>
                  <span className="font-bold">Wydział Informatyki AGH</span>
                </div>
                <div className="flex justify-between border-b border-border/50 pb-2">
                  <span className="text-muted-foreground">Finaliści:</span>
                  <span className="font-bold">10 Zespołów</span>
                </div>
              </div>

              <div className="mt-8 p-4 bg-brand-violet/10 rounded-lg border border-brand-violet/20">
                <p className="text-sm text-center font-medium">
                  Oceniamy innowacyjność, użyteczność społeczną i poziom
                  technologiczny.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
