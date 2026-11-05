import { Arrival } from "@/components/chapters/arrival";
import { Closing } from "@/components/chapters/closing";
import { Curiosity } from "@/components/chapters/curiosity";
import { Method } from "@/components/chapters/method";
import { Philosophy } from "@/components/chapters/philosophy";
import { Research } from "@/components/chapters/research";
import { SelectedWork } from "@/components/chapters/selected-work";
import { ScrollRefresh } from "@/components/motion/scroll-refresh";

/*
 * One continuous narrative in seven chapters:
 * Thought (Curiosity) → Computation (Method, Research) → Construction (Work).
 */
export default function Home() {
  return (
    <>
      <Arrival />
      <Curiosity />
      <Method />
      <SelectedWork />
      <Research />
      <Philosophy />
      <Closing />
      <ScrollRefresh />
    </>
  );
}
