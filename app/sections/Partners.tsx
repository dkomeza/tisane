import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Partners() {
  return (
    <section id="partners" className="py-24 container mx-auto px-6 lg:px-12">
      <div className="text-center mb-16 space-y-4">
        <Badge
          variant="outline"
          className="border-brand-pink text-brand-pink px-4 py-1 text-sm uppercase tracking-widest"
        >
          Współpraca
        </Badge>
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
          Nasi Partnerzy
        </h2>
      </div>

      <div className="space-y-16">
        {/* Partnerzy Merytoryczni (6) */}
        <div>
          <h3 className="text-2xl font-bold text-center mb-8 text-foreground/80">
            Partnerzy Merytoryczni
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={`merit-${i}`} className="bg-white/5 border-white/10 hover:border-brand-violet/50 transition-colors flex items-center justify-center aspect-video">
                <CardContent className="p-0 flex flex-col items-center justify-center w-full h-full text-muted-foreground bg-white rounded-xl">
                  {/* Placeholder for white square/rectangle logo */}
                  <span className="text-sm font-mono text-black/50">Logo</span>
                  <span className="text-xs font-mono text-black/40">400x200 px</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Partnerzy (3) */}
        <div>
          <h3 className="text-2xl font-bold text-center mb-8 text-foreground/80">
            Partnerzy
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={`partner-${i}`} className="bg-white/5 border-white/10 hover:border-brand-pink/50 transition-colors flex items-center justify-center aspect-video">
                <CardContent className="p-0 flex flex-col items-center justify-center w-full h-full text-muted-foreground bg-white rounded-xl">
                  <span className="text-sm font-mono text-black/50">Logo</span>
                  <span className="text-xs font-mono text-black/40">400x200 px</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Patroni Medialni (2) */}
        <div>
          <h3 className="text-2xl font-bold text-center mb-8 text-foreground/80">
            Patroni Medialni
          </h3>
          <div className="flex flex-col sm:flex-row justify-center gap-6 max-w-2xl mx-auto">
            {Array.from({ length: 2 }).map((_, i) => (
              <Card key={`media-${i}`} className="bg-white/5 border-white/10 hover:border-brand-red/50 transition-colors flex items-center justify-center aspect-video w-full sm:w-1/2">
                <CardContent className="p-0 flex flex-col items-center justify-center w-full h-full text-muted-foreground bg-white rounded-xl">
                  <span className="text-sm font-mono text-black/50">Logo</span>
                  <span className="text-xs font-mono text-black/40">400x200 px</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
