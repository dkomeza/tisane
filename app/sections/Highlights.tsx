import React from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  MicVocal,
  Laptop,
  Brain,
  Handshake,
  type LucideIcon,
} from "lucide-react";

interface Highlight {
  icon: LucideIcon;
  brand_color: string;
  title: string;
  description: string;
}

const highlights: Highlight[] = [
  {
    icon: MicVocal,
    brand_color: "#ff2b97",
    title: "Prelekcje i panele",
    description:
      "Trendy, technologie, kompetencje. Najważniejsza wiedza z pierwszej ręki. Słuchaj liderów w dziedzinie AI, CyberSec i DevOps.",
  },
  {
    icon: Laptop,
    brand_color: "#ff2b97",
    title: "Konkurs Innowacji Studenckich IT is ME",
    description:
      "Innowacje studenckie. Arena dla Twojego projektu. Zaprezentuj swój pomysł i zyskaj finansowanie oraz mentoring od najlepszych.",
  },
  {
    icon: Brain,
    brand_color: "#ff2b97",
    title: "Warsztaty i spotkania",
    description:
      "Praktyczna wiedza od ekspertów. Sesje hands-on skupione na narzędziach i technologiach, których używa się w topowych firmach.",
  },
  {
    icon: Handshake,
    brand_color: "#ff2b97",
    title: "Networking",
    description:
      "Spotkania z biznesem i nauką. Nawiąż kontakty, które odmienią Twoją karierę. Idealne miejsce, by znaleźć pracodawcę lub partnera.",
  },
];

export default function Highlights() {
  return (
    <section className="container mx-auto grid p-8 grid-cols-1 gap-7 place-items-stretch md:grid-cols-2 md:gap-10">
      {highlights.map((highlight) => {
        const Icon = highlight.icon;
        return (
          <Card
            key={highlight.title}
            className="transition-all hover:scale-[102%] duration-300"
          >
            <CardHeader>
              <CardTitle className="flex flex-col gap-4 items-start">
                <div>
                  <Icon className="w-10 h-10" color={highlight.brand_color} />
                </div>
                <h3 className="uppercase font-bold">{highlight.title}</h3>
              </CardTitle>
              <CardDescription>{highlight.description}</CardDescription>
            </CardHeader>
          </Card>
        );
      })}
    </section>
  );
}
