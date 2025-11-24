import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Building2, Microscope } from "lucide-react";

/**
 * Render the target audience section containing three informational cards.
 *
 * The section includes a centered heading and a responsive three-column grid
 * of cards for "Studenci", "Firmy", and "Naukowcy", each with an icon, title,
 * and short description.
 *
 * @returns A JSX element containing the complete target audience section with three cards.
 */
export default function TargetAudience() {
  const audiences = [
    {
      icon: <GraduationCap className="w-10 h-10 text-brand-red" />,
      title: "Studenci",
      desc: "Zdobądź wiedzę, poznaj ekspertów, zaprezentuj swój potencjał",
    },
    {
      icon: <Building2 className="w-10 h-10 text-brand-violet" />,
      title: "Firmy",
      desc: "Spotkaj talenty, zaprezentuj technologie, znajdź inspiracje",
    },
    {
      icon: <Microscope className="w-10 h-10 text-brand-pink" />,
      title: "Naukowcy",
      desc: "Podziel się wiedzą i nawiąż współpracę z biznesem",
    },
  ];

  return (
    <section id="target" className="py-24 bg-secondary/20">
      <div className="container mx-auto px-6 lg:px-12">
        <h2 className="text-3xl font-bold mb-12 text-center">
          Na wydarzenie szczególnie zapraszamy
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {audiences.map((item, idx) => (
            <Card
              key={idx}
              className="bg-background border-none shadow-lg shadow-black/5 dark:shadow-white/5 hover:-translate-y-1 transition-transform duration-300"
            >
              <CardHeader className="text-center pb-2">
                <div className="mx-auto bg-secondary p-4 rounded-full mb-4 w-fit">
                  {item.icon}
                </div>
                <CardTitle className="text-2xl font-bold">
                  {item.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground">{item.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}