import { Arrival } from "@/components/chapters/arrival";
import { Closing } from "@/components/chapters/closing";
import { Curiosity } from "@/components/chapters/curiosity";
import { Method } from "@/components/chapters/method";
import { Philosophy } from "@/components/chapters/philosophy";
import { ScrollRefresh } from "@/components/motion/scroll-refresh";

/*
 * One continuous narrative in five chapters:
 * Thought (Curiosity) → Computation → Construction (Method), then the lab.
 */
export default function Home() {
  return (
    <>
      <Arrival />
      <Curiosity />
      <Method />
      <Philosophy />
      <Closing />
      <ScrollRefresh />
    </>
  );
}
