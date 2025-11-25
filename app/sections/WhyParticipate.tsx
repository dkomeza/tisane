import React from "react";
import { CheckCircle2 } from "lucide-react";

/**
 * Renders a centered, responsive "Why participate?" section with a heading and benefit items.
 *
 * The section displays a list of benefit cards (each containing an icon and descriptive text)
 * arranged in a column on small screens and a row on larger screens.
 *
 * @returns The React element representing the "Dlaczego warto?" section with benefit items.
 */
export default function WhyParticipate() {
  const benefits = [
    "Możliwość prezentacji przed ekspertami z branży",
    "Profesjonalny feedback i wsparcie mentorskie",
    "Promocja projektu i atrakcyjne nagrody",
  ];

  return (
    <section className="dark:text-white text-brand-dark">
      <div className="container mx-auto grid lg:px-12 text-center">
        <h2 className="text-3xl font-bold mb-12 ">Dlaczego warto?</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 justify-center gap-8 md:gap-16">
          {benefits.map((benefit, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center gap-4 max-w-xs mx-auto bg-brand-softPink/10 rounded-4xl p-5"
            >
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-brand-softPink bg-brand-dark/1">
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