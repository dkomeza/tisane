import TextScramble from "./components/TextScramble";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <>
      <main className="flex items-center justify-center h-screen flex-col gap-16">
        <TextScramble
          phrases={[
            "IT is Future",
            "IT is Technology",
            "IT is You",
            "IT is Us",
            "IT is Knowledge",
            "IT is Now",
          ]}
        />
      </main>
      <section className="container mx-auto px-4">
        <h2 className="text-4xl font-semibold">O wydarzeniu</h2>
        <p className="mt-4 text-lg/snug indent-2">
          Sektor IT zmienia się szybciej niż kiedykolwiek wcześniej – napędzany
          przez sztuczną inteligencję, analizę danych i nowe technologie, które
          redefiniują sposób, w jaki pracujemy, uczymy się i tworzymy innowacje.
        </p>
        <p className="mt-4 text-lg/snug indent-2">
          AGH IT Future Day to nowe wydarzenie organizowane przez Wydział 
          Informatyki AGH, Fundację Try IT, Centrum Spraw Studenckich AGH i
          Wydziałową Radę Samorządu Studentów WI AGH, łączące perspektywy
          studentów, naukowców i biznesu. Dzięki temu powstaje program, który
          odpowiada na realne potrzeby rynku i inspiruje do tworzenia innowacji.
        </p>
        <p className="mt-4 text-lg/snug indent-2">
          Bezpośrednie spotkania z przedstawicielami firm pomogą obrać najlepszą
          ścieżkę kariery, przekształcić pomysły w innowacje i nawiązać
          przyszłościowe współprace. AGH IT Future Day to przestrzeń, w której
          rozmawiamy o trendach i kompetencjach przyszłości – od sztucznej
          inteligencji i data science, przez IoT i chmurę, po zielone IT i
          digital health.
        </p>
        <div className="mt-6">
          <h4>Na wydarzenie szczególnie zapraszamy: </h4>
          <ul>
            <li>
              <Card>
                <CardHeader>
                  <CardTitle>🎓 Studentów</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    zdobądź wiedzę, poznaj ekspertów, zaprezentuj swój potencjał
                  </p>
                </CardContent>
              </Card>
            </li>
            <li>
              🏢 Firmy – spotkaj talenty, zaprezentuj technologie, znajdź
              inspiracje
            </li>
            <li>
              🧑‍🏫 Naukowców – podziel się wiedzą i nawiąż współpracę z biznesem
            </li>
          </ul>
        </div>
      </section>
    </>
  );
}
