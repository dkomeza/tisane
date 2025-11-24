import React from "react";
import { CheckCircle2 } from "lucide-react";

export default function WhyParticipate() {
  const benefits = [
    "Możliwość prezentacji przed ekspertami z branży",
    "Profesjonalny feedback i wsparcie mentorskie",
    "Promocja projektu i atrakcyjne nagrody",
  ];

  return (
    <section className="py-16 bg-brand-dark text-white">
      <div className="container mx-auto px-6 lg:px-12 text-center">
        <h2 className="text-3xl font-bold mb-12">Dlaczego warto?</h2>

        <div className="flex flex-col md:flex-row justify-center gap-8 md:gap-16">
          {benefits.map((benefit, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center gap-4 max-w-xs mx-auto"
            >
              <div className="w-12 h-12 rounded-full bg-brand-red/20 flex items-center justify-center text-brand-red">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <p className="text-lg font-medium">{benefit}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
