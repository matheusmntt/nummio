import { Arrival } from "@/components/chapters/arrival";
import { Closing } from "@/components/chapters/closing";
import { Curiosity } from "@/components/chapters/curiosity";
import { Method } from "@/components/chapters/method";
import { Philosophy } from "@/components/chapters/philosophy";
import { Practice } from "@/components/chapters/practice";
import { ScrollRefresh } from "@/components/motion/scroll-refresh";

/*
 * One continuous narrative in six chapters: the question (Curiosity), the
 * method (Explore → Understand → Build), what the lab does with it, and why.
 */
export default function Home() {
  return (
    <>
      <Arrival />
      <Curiosity />
      <Method />
      <Practice />
      <Philosophy />
      <Closing />
      <ScrollRefresh />
    </>
  );
}
