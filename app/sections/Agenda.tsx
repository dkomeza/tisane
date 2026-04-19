import React from "react";
import { Badge } from "@/components/ui/badge";

export default function Agenda() {
  const agendaItems = [
    { time: "09:00 – 09:10", title: "Powitanie" },
    {
      time: "09:10 – 09:30",
      speaker: "Ewa Zborowska, IDC",
      title: "AI to nie wszystko: co jeszcze zdefiniuje 2026?",
    },
    {
      time: "09:30 – 09:55",
      speaker: "Rafał Szczepański, Visa",
      title:
        "Od kodu do odpowiedzialności: jak wygląda inżynieria w globalnych systemach finansowych",
    },
    {
      time: "09:55 – 10:20",
      speaker: "Prof. Joanna Jaworek-Korjakowska, AGH",
      title: "Gdy AI dostaje ciało – jak powstają roboty humanoidalne?",
    },
    {
      time: "10:20 – 10:45",
      speaker: "Marcin Słowiak, GE Healthcare",
      title: "Jak naprawdę wygląda AI w pracy – od modelu do produktu",
    },
    {
      time: "10:45 – 11:05",
      speaker: "Andrzej Wróbel, IBM",
      title: "Wykorzystanie AI w Enterprise Software",
    },
    {
      time: "11:05 – 11:30",
      speaker: "Agnieszka Gramatyka, BNP Paribas",
      title: "Dyplom vs. Prompt: Czy studia przygotują Was na IT AD 2030?",
    },
    {
      time: "11:30 – 11:55",
      speaker: "Krzysztof Wróbel, Bielik.AI",
      title: "Jestem Bielik. Urodziłem się tu obok.",
    },
    { time: "11:55 – 12:15", title: "PRZERWA KAWOWA (20 min)", isBreak: true },
    {
      time: "12:15 – 12:40",
      speaker: "Krzysztof Kuba, FinQbit",
      title: "Od perceptronu do kubitu: Jak nauczyć komputer kwantowy?",
    },
    {
      time: "12:40 – 13:05",
      speaker: "Paweł Wilkosz, Motorola Solutions",
      title: "Ekosystem IoT o znaczeniu krytycznym",
    },
    {
      time: "13:05 – 13:30",
      speaker: "Olivier Roucloux, Euroclear",
      title: "Proposing a blockchain based bond market",
    },
    {
      time: "13:30 – 13:55",
      speaker: "Paulina Gajda-Wałach, Justyna Gajdek, HSBC",
      title:
        "Od chatbota do agenta: kiedy AI naprawdę pomaga, a kiedy tylko komplikuje?",
    },
    {
      time: "13:55 – 14:20",
      speaker: "Piotr Góralczyk",
      title:
        "Startup nie jest dla każdego. Jak rozpoznać, czy budujesz biznes, czy iluzję",
    },
    { time: "14:20 – 15:00", title: "Lunch", isBreak: true },
    { time: "15:00 – 18:00", title: "Finał konkursu IT is Me", isBreak: true },
  ];

  return (
    <section
      id="agenda"
      className="py-24 container mx-auto px-6 lg:px-12 relative overflow-hidden"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-violet/5 blur-[120px] rounded-full -z-10 pointer-events-none" />

      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-6">
          <Badge
            variant="outline"
            className="border-brand-violet text-brand-violet px-4 py-1 text-sm uppercase tracking-widest"
          >
            Agenda
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            Agenda AGH{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-brand-violet to-brand-pink">
              IT Future Day
            </span>
          </h2>
        </div>

        <div className="space-y-4">
          {agendaItems.map((item, index) => (
            <div
              key={index}
              className={`flex flex-col md:flex-row md:items-center gap-4 p-6 rounded-2xl border ${
                item.isBreak
                  ? "bg-secondary border-border/50"
                  : "bg-background/50 backdrop-blur-sm border-brand-violet/20 hover:border-brand-violet/50 transition-colors"
              }`}
            >
              <div className="md:w-48 shrink-0">
                <span
                  className={`font-mono text-lg ${item.isBreak ? "text-muted-foreground" : "text-brand-violet font-bold"}`}
                >
                  {item.time}
                </span>
              </div>
              <div>
                {item.speaker && (
                  <p className="text-sm text-brand-pink font-semibold mb-1">
                    {item.speaker}
                  </p>
                )}
                <p
                  className={`text-lg ${item.isBreak ? "text-muted-foreground uppercase tracking-widest text-sm font-bold" : "text-foreground font-medium"}`}
                >
                  {item.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
