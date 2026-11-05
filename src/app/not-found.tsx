import { ActionLink } from "@/components/action-link";
import { EditorialLabel } from "@/components/editorial-label";

export const metadata = {
  title: "Not found",
};

export default function NotFound() {
  return (
    <section aria-labelledby="not-found-title" className="nm-container py-32 md:py-48">
      <EditorialLabel tone="accent" marker as="p">
        N/404
      </EditorialLabel>
      <h1 id="not-found-title" className="mt-8 text-headline font-semibold">
        Nothing here yet.
      </h1>
      <p className="mt-6 max-w-md text-lg text-muted">
        This page does not exist. It may have moved, or it may still be a question.
      </p>
      <div className="mt-10">
        <ActionLink href="/">Back to nummio.dev</ActionLink>
      </div>
    </section>
  );
}
