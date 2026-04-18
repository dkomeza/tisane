"use client";

import { useRef } from "react";

import gsap from "gsap";
import TextPlugin from "gsap/TextPlugin";
import { useGSAP } from "@gsap/react";
gsap.registerPlugin(TextPlugin);

export const TypewriterEffect = ({ phrases }: { phrases: string[] }) => {
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
                Math.ceil(proxy.val),
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
                  Math.ceil(proxy.val),
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
    { scope: container, dependencies: [phrases] },
  );

  return (
    <span ref={container} className="inline-block min-w-[200px]">
      <span ref={textRef} className="text"></span>
      <span className="cursor">_</span>
    </span>
  );
};
