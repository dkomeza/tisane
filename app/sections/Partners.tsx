import React from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const partnerzyMerytoryczni = [
  { id: "01", src: "/partnerzy_merytoryczni/logo_www-01.png", link: "https://www.bnpparibas.pl/", alt: "BNP Paribas" },
  { id: "02", src: "/partnerzy_merytoryczni/logo_www-02.png", link: "https://www.euroclear.com/en.html", alt: "Euroclear" },
  { id: "03", src: "/partnerzy_merytoryczni/logo_www-03.png", link: "https://www.gehealthcare.pl/", alt: "GE HealthCare" },
  { id: "04", src: "/partnerzy_merytoryczni/logo_www-04.png", link: "https://www.hsbc.pl/", alt: "HSBC" },
  { id: "05", src: "/partnerzy_merytoryczni/logo_www-05.png", link: "https://www.motorolasolutions.com/pl_pl.html", alt: "Motorola Solutions" },
  { id: "06", src: "/partnerzy_merytoryczni/logo_www-06.png", link: "https://www.visa.pl/", alt: "Visa" },
  { id: "07", src: "/partnerzy_merytoryczni/logo_www-07.png", link: "https://www.innoagh.pl/", alt: "INNOAGH" },
];

const partnerzy = [
  { id: "08", src: "/partnerzy/logo_www-08.png", link: "https://www.cae.com/", alt: "CAE" },
  { id: "09", src: "/partnerzy/logo_www-09.png", link: "https://kms.org.pl/", alt: "KMS" },
  { id: "10", src: "/partnerzy/logo_www-10.png", link: "https://www.zooplus.pl/", alt: "Zooplus" },
];

const patroniMedialni = [
  { id: "11", src: "/patroni_medialni/logo_www-11.png", link: "https://www.rp.pl/", alt: "Rzeczpospolita" },
  { id: "12", src: "/patroni_medialni/logo_www-12.png", link: "https://www.rp.pl/", alt: "Rzeczpospolita" },
  { id: "13", src: "/patroni_medialni/logo_www-13.png", link: "https://www.eska.pl/", alt: "Eska" },
  { id: "14", src: "/patroni_medialni/logo_www-14.png", link: "https://itprofessional.pl/", alt: "IT Professional" },
];

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
        {/* Partnerzy Merytoryczni (7) */}
        <div>
          <h3 className="text-2xl font-bold text-center mb-8 text-foreground/80">
            Partnerzy Merytoryczni
          </h3>
          <div className="flex flex-wrap justify-center gap-6 max-w-5xl mx-auto">
            {partnerzyMerytoryczni.map((partner) => (
              <a href={partner.link} target="_blank" rel="noopener noreferrer" key={partner.id} className="block group outline-none w-full sm:w-[calc(50%-0.75rem)] md:w-[calc(33.333%-1rem)]">
                <Card className="bg-white/5 border-white/10 group-hover:border-brand-violet/50 transition-colors flex items-center justify-center p-2 sm:p-3 aspect-video">
                  <CardContent className="relative p-0 flex flex-col items-center justify-center w-full h-full text-muted-foreground bg-white rounded-xl overflow-hidden group-hover:scale-[1.02] transition-transform duration-300">
                    <Image
                      src={partner.src}
                      alt={partner.alt}
                      fill
                      className="object-contain p-4 sm:p-6"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>
        </div>

        {/* Partnerzy (3) */}
        <div>
          <h3 className="text-2xl font-bold text-center mb-8 text-foreground/80">
            Partnerzy
          </h3>
          <div className="flex flex-wrap justify-center gap-6 max-w-4xl mx-auto">
            {partnerzy.map((partner) => (
              <a href={partner.link} target="_blank" rel="noopener noreferrer" key={partner.id} className="block group outline-none w-full sm:w-[calc(50%-0.75rem)] md:w-[calc(33.333%-1rem)]">
                <Card className="bg-white/5 border-white/10 group-hover:border-brand-pink/50 transition-colors flex items-center justify-center p-2 sm:p-3 aspect-video">
                  <CardContent className="relative p-0 flex flex-col items-center justify-center w-full h-full text-muted-foreground bg-white rounded-xl overflow-hidden group-hover:scale-[1.02] transition-transform duration-300">
                    <Image
                      src={partner.src}
                      alt={partner.alt}
                      fill
                      className="object-contain p-6 sm:p-8"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>
        </div>

        {/* Patroni Medialni (4) */}
        <div>
          <h3 className="text-2xl font-bold text-center mb-8 text-foreground/80">
            Patroni Medialni
          </h3>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 max-w-4xl mx-auto">
            {patroniMedialni.map((partner) => (
              <a href={partner.link} target="_blank" rel="noopener noreferrer" key={partner.id} className="block group outline-none w-[calc(50%-0.5rem)] sm:w-[calc(50%-0.75rem)] md:w-[calc(25%-1.125rem)]">
                <Card className="bg-white/5 border-white/10 group-hover:border-brand-red/50 transition-colors flex items-center justify-center p-2 sm:p-3 aspect-video">
                  <CardContent className="relative p-0 flex flex-col items-center justify-center w-full h-full text-muted-foreground bg-white rounded-xl overflow-hidden group-hover:scale-[1.02] transition-transform duration-300">
                    <Image
                      src={partner.src}
                      alt={partner.alt}
                      fill
                      className="object-contain p-4 sm:p-6"
                      sizes="(max-width: 640px) 50vw, 25vw"
                    />
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
