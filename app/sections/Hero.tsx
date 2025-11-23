"use client";
import { useRef } from "react";
import { Button } from "@/components/ui/button"; // Assuming Shadcn button
import { Calendar, MapPin, Trophy } from "lucide-react";
import { Card } from "@/components/ui/card";

import gsap from "gsap";
import TextPlugin from "gsap/TextPlugin";
import { useGSAP } from "@gsap/react";
gsap.registerPlugin(TextPlugin);

import "./hero.css";

const TypewriterEffect = ({ phrases }: { phrases: string[] }) => {
  const container = useRef<HTMLSpanElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 0 });

      phrases.forEach((phrase) => {
        const len = phrase.length;
        const proxy = { val: 0 };

        tl.to(proxy, {
          val: len,
          duration: len * 0.15,
          ease: `steps(${len})`,
          onUpdate: () => {
            if (textRef.current) {
              textRef.current.textContent = phrase.substring(
                0,
                Math.ceil(proxy.val)
              );
            }
          },
        })
          .to({}, { duration: 3 })
          .to(proxy, {
            val: 0,
            duration: len * 0.1, // 100ms per char (faster)
            ease: `steps(${len})`,
            onUpdate: () => {
              if (textRef.current) {
                textRef.current.textContent = phrase.substring(
                  0,
                  Math.ceil(proxy.val)
                );
              }
            },
          });
      });

      gsap.to(".cursor", {
        opacity: 0,
        duration: 0.5,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut",
      });
    },
    { scope: container, dependencies: [phrases] }
  );

  return (
    <span ref={container} className="inline-block min-w-[200px]">
      <span ref={textRef} className="text"></span>
      <span className="cursor">_</span>
    </span>
  );
};

const HeroSection = () => {
  return (
    <section
      className="hero relative w-full min-h-screen flex items-center justify-center mb-8 overflow-hidden"
      style={
        {
          // backgroundImage: `
          //         linear-gradient(to bottom, transparent calc(100% - 15vh), #000000 100%),
          //         linear-gradient(135deg,rgba(8, 8, 8, 0.5) 0%, rgba(46,46,46, 0.5) 100%),
          //         linear-gradient(to right, rgba(255,255,255,0.15) 2px, transparent 2px),
          //         linear-gradient(to bottom, rgba(255,255,255,0.15) 2px, transparent 2px)`,
          // backgroundSize: "cover, 40px 40px, 40px 40px, 40px 40px",
        }
      }
    >
      <div className="-z-10 absolute top-0 right-0 w-[500px] h-[500px] bg-brand-softPink/20 dark:bg-brand-violet/20 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/4 pointer-events-none" />
      <div className="-z-10 absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-cream/40 dark:bg-brand-purple/20 blur-[120px] rounded-full -translate-x-1/2 translate-y-1/4 pointer-events-none" />

      <div className="container mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center relative z-10">
        <div className="flex flex-col items-start space-y-6">
          <div className="flex flex-wrap items-center gap-4 text-sm font-medium tracking-wide">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground border border-border">
              <Calendar className="w-4 h-4 text-brand-red" />
              <span>26.03.2026</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground border border-border">
              <MapPin className="w-4 h-4 text-brand-red" />
              <span>WI AGH Kraków</span>
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
              AGH IT <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-brand-red to-brand-pink">
                FUTURE DAY
              </span>
            </h1>
            <div className="text-2xl lg:text-3xl font-mono text-muted-foreground">
              <span className="text-foreground">IT is </span>
              <span className="text-brand-violet dark:text-brand-pink">
                <TypewriterEffect
                  phrases={["Future", "You", "Knowledge", "Innovation", "Now"]}
                />
              </span>
            </div>
          </div>

          <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
            Sektor IT zmienia się szybciej niż kiedykolwiek.{" "}
            <br className="hidden lg:block" />
            Dołącz do wydarzenia, gdzie pomysły nabierają mocy, a kariery
            obierają właściwy kierunek.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Button
              size="lg"
              className="cursor-pointer bg-brand-red hover:bg-brand-pink text-white border-0 shadow-lg shadow-brand-red/20 transition-all duration-300 font-semibold"
            >
              Zarejestruj się
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="cursor-pointer border-brand-violet text-brand-violet hover:bg-brand-violet hover:text-white dark:border-brand-softPink dark:text-brand-softPink dark:hover:bg-brand-softPink dark:hover:text-brand-dark transition-all duration-300 group"
            >
              <Trophy className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
              Konkurs IT is ME
            </Button>
          </div>
        </div>

        <div className="hidden lg:flex items-center justify-center relative">
          <div className="relative w-full max-w-md aspect-square">
            <div className="absolute top-0 -left-4 w-72 h-72 bg-brand-violet mix-blend-multiply filter blur-xl opacity-20 animate-blob dark:mix-blend-screen dark:opacity-30"></div>
            <div className="absolute top-0 -right-4 w-72 h-72 bg-brand-pink mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000 dark:mix-blend-screen dark:opacity-30"></div>
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-brand-red mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000 dark:mix-blend-screen dark:opacity-30"></div>

            <Card className="relative z-10 h-full w-full py-0 shadow-none overflow-hidden">
              <div className="h-10 border-b border-black/5 dark:border-white/10 flex items-center px-4 gap-2 bg-black/5 dark:bg-white/5">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                <span className="ml-2 text-xs font-mono text-muted-foreground opacity-50">
                  agh_future_v2026.sh
                </span>
              </div>

              <div className="p-6 font-mono text-sm space-y-4 flex-1 overflow-hidden">
                <div className="flex gap-2 text-muted-foreground">
                  <span className="text-brand-violet">➜</span>
                  <span>~/future-day</span>
                  <span className="text-brand-pink">git status</span>
                </div>
                <div className="text-foreground/80 pl-4">
                  On branch{" "}
                  <span className="text-brand-red font-bold">main</span>
                  <br />
                  Your career is up to date.
                  <br />
                  <br />
                  Changes to be committed:
                  <br />
                  <span className="text-green-500">
                    new file: innovations.ts
                  </span>
                  <br />
                  <span className="text-green-500">
                    new file: networking.tsx
                  </span>
                  <br />
                  <span className="text-green-500">
                    modified: future-skills.css
                  </span>
                </div>

                <div className="flex gap-2 text-muted-foreground pt-2">
                  <span className="text-brand-violet">➜</span>
                  <span>~/future-day</span>
                  <span className="text-brand-pink">./init_event.sh</span>
                </div>
                <div className="text-foreground/80 pl-4">
                  Loading modules...{" "}
                  <span className="animate-pulse">██████</span>
                </div>
              </div>

              {/* Decorative "Sticker" */}
              <div className="absolute bottom-4 right-4 rotate-[-5deg]">
                <div className="bg-brand-red rounded-sm text-white text-xs font-bold px-3 py-1 shadow-lg transform hover:scale-110 transition-transform cursor-default">
                  #AGH2026
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
