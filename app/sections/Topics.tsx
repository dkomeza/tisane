import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cpu, Server, Lightbulb } from "lucide-react";

/**
 * Renders the "Tematy, którymi żyje branża IT" section with three topic cards.
 *
 * Each card shows an icon, a title, and a list of subtopics arranged in a responsive 3-column grid.
 *
 * @returns A JSX element containing the section with three topic cards, each including a header (icon + title) and a list of items.
 */
export default function Topics() {
  const topics = [
    {
      title: "AI & Data",
      icon: <Cpu className="w-6 h-6 text-brand-red" />,
      items: ["AI/ML", "Data Science & Big Data", "Automatyzacja"],
    },
    {
      title: "Infrastruktura i systemy",
      icon: <Server className="w-6 h-6 text-brand-violet" />,
      items: [
        "Cloud & Edge",
        "IoT i systemy rozproszone",
        "Cyberbezpieczeństwo",
      ],
    },
    {
      title: "Innowacje przyszłości",
      icon: <Lightbulb className="w-6 h-6 text-brand-pink" />,
      items: ["Quantum Computing", "Digital Health", "Green/Responsible IT"],
    },
  ];

  return (
    <section id="topics" className="py-24 container mx-auto px-6 lg:px-12">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Tematy, którymi żyje branża IT
        </h2>
        <div className="w-100 h-1 bg-linear-to-r from-brand-red to-brand-pink mx-auto rounded-full" />
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {topics.map((topic, idx) => (
          <Card
            key={idx}
            className="bg-background/50 backdrop-blur-sm border-border/50 hover:border-brand-violet/30 transition-colors duration-300"
          >
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <div className="p-2 bg-secondary rounded-lg">{topic.icon}</div>
              <CardTitle className="text-xl">{topic.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mt-4">
                {topic.items.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-3 text-muted-foreground"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-red/50" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}