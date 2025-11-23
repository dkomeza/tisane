import TextScramble from "./components/TextScramble";

import { Highlights } from "./sections";

export default function Home() {
  return (
    <>
      <main className="flex items-center justify-center h-screen flex-col gap-16 md:gap-20">
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
      <Highlights />
    </>
  );
}
