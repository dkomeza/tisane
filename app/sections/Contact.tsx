import React from "react";
import { Button } from "@/components/ui/button";
import { Mail, Linkedin, Facebook, Instagram, Youtube } from "lucide-react";

/**
 * Renders the Contact section containing team contact entries, social action buttons, and a footer notice.
 *
 * @returns A JSX element with contact details (names, roles and mailto links), social icon buttons, and a copyright footer.
 */
export default function Contact() {
  return (
    <section className="py-24 bg-secondary/30 border-t border-border">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <div className="space-y-8">
            <h2 className="text-3xl font-bold">Skontaktuj się z nami</h2>
            <p className="text-lg text-muted-foreground">
              Zostań partnerem wydarzenia! Poznaj ofertę dopasowaną do potrzeb
              Twojej firmy.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-brand-red/10 flex items-center justify-center text-brand-red shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold">Ulana Gocman</h3>
                  <p className="text-sm text-muted-foreground mb-1">
                    Koordynatorka projektu
                  </p>
                  <a
                    href="mailto:ugocman@agh.edu.pl"
                    className="text-brand-red hover:underline font-mono"
                  >
                    ugocman@agh.edu.pl
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-brand-violet/10 flex items-center justify-center text-brand-violet shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold">Jacek Nawrot</h3>
                  <p className="text-sm text-muted-foreground mb-1">
                    Przewodniczący Rady Programowej
                  </p>
                  <a
                    href="mailto:nawrot@agh.edu.pl"
                    className="text-brand-violet hover:underline font-mono"
                  >
                    nawrot@agh.edu.pl
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Socials */}
          <div className="flex flex-col justify-center items-start lg:items-end space-y-6">
            <h3 className="text-xl font-bold">Obserwuj nas</h3>
            <div className="flex gap-4">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full hover:bg-pink-600 hover:text-white hover:border-pink-600 transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors"
              >
                <Youtube className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-24 text-center text-sm text-muted-foreground border-t border-border/50 pt-8">
          &copy; 2026 AGH IT Future Day. Wszelkie prawa zastrzeżone.
        </div>
      </div>
    </section>
  );
}