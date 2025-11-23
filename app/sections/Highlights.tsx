import React from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MicVocal, Laptop, Brain, Handshake } from "lucide-react";

export default function Highlights() {
  return (
    <section className="container mx-auto grid p-8 grid-cols-1 gap-7 place-items-stretch md:grid-cols-2 md:gap-10">
      <Card className=" transition-all cursor-pointer hover:scale-105">
        <CardHeader>
          <CardTitle className="flex flex-col gap-4 items-start">
            <div>
              <MicVocal className="w-10 h-10" color="#ff2b97" />
            </div>
            <h3 className="uppercase font-bold">Prelekcje i panele</h3>
          </CardTitle>
          <CardDescription>
            Trendy, technologie, kompetencje. Najważniejsza wiedza z pierwszej
            ręki. Słuchaj liderów w dziedzinie AI, CyberSec i DevOps.
          </CardDescription>
        </CardHeader>
      </Card>
      <Card className=" transition-all cursor-pointer hover:scale-105">
        <CardHeader>
          <CardTitle className="flex flex-col gap-4 items-start">
            <div>
              <Laptop className="w-10 h-10" color="#ff2b97" />
            </div>
            <h3 className="uppercase font-bold">
              Konkurs Innowacji Studenckich IT is ME
            </h3>
          </CardTitle>
          <CardDescription>
            Innowacje studenckie. Arena dla Twojego projektu. Zaprezentuj swój
            pomysł i zyskaj finansowanie oraz mentoring od najlepszych.
          </CardDescription>
        </CardHeader>
      </Card>

      <Card className=" transition-all cursor-pointer hover:scale-105">
        <CardHeader>
          <CardTitle className="flex flex-col gap-4 items-start">
            <div>
              <Brain className="w-10 h-10" color="#ff2b97" />
            </div>
            <h3 className="uppercase font-bold">Warsztaty i spotkania</h3>
          </CardTitle>
          <CardDescription>
            Praktyczna wiedza od ekspertów. Sesje hands-on skupione na
            narzędziach i technologiach, których używa się w topowych firmach.
          </CardDescription>
        </CardHeader>
      </Card>

      <Card className=" transition-all cursor-pointer hover:scale-105">
        <CardHeader>
          <CardTitle className="flex flex-col gap-4 items-start">
            <div>
              <Handshake className="w-10 h-10" color="#ff2b97" />
            </div>
            <h3 className="uppercase font-bold">Networking</h3>
          </CardTitle>
          <CardDescription>
            Spotkania z biznesem i nauką. Nawiąż kontakty, które odmienią Twoją
            karierę. Idealne miejsce, by znaleźć pracodawcę lub partnera.
          </CardDescription>
        </CardHeader>
      </Card>
    </section>
  );
}
