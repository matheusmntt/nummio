import { cacheLife } from "next/cache";
import { contactHref, primaryNav, site } from "@/content/site";
import { BrandMark } from "./brand-mark";
import { EditorialLabel } from "./editorial-label";
import { Rise } from "./motion/rise";

async function CopyrightYear() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}

export function SiteFooter() {
  return (
    <footer className="border-t border-line pt-20 pb-10 md:pt-28">
      <div className="nm-wide">
        <div className="grid gap-y-14 md:grid-cols-12 md:gap-x-8">
          <div className="md:col-span-6">
            <p className="text-3xl font-semibold tracking-tightest md:text-4xl">
              <em className="not-italic">{site.tagline}</em>
            </p>
            <p className="mt-4 max-w-sm text-muted">
              {site.descriptor} for software and applied research.
            </p>
          </div>

          <nav aria-label="Footer" className="md:col-span-3">
            <EditorialLabel as="p">Index</EditorialLabel>
            <ul className="mt-4">
              {primaryNav.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="inline-flex min-h-11 items-center text-foreground no-underline transition-colors hover:text-accent"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-3">
            <EditorialLabel as="p">Contact</EditorialLabel>
            <ul className="mt-4 text-muted">
              <li>
                <a
                  href={contactHref}
                  className="inline-flex min-h-11 items-center text-foreground no-underline transition-colors hover:text-accent"
                >
                  {site.email}
                </a>
              </li>
              <li>
                <a
                  href={site.url}
                  className="inline-flex min-h-11 items-center text-foreground no-underline transition-colors hover:text-accent"
                >
                  {site.domain}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <Rise className="mt-20 md:mt-28">
          {/* Same file as the header mark (already loaded); eager keeps Next's LCP check accurate. */}
          <BrandMark label="" preload className="w-full" />
        </Rise>

        <div className="mt-10 flex flex-col gap-4 border-t border-line pt-6 font-mono text-xs text-subtle sm:flex-row sm:items-center sm:justify-between">
          <p>
            © <CopyrightYear /> {site.name} · {site.domain}
          </p>
          <p>Explore → Understand → Build</p>
          <a href="#top" className="inline-flex min-h-11 items-center text-muted no-underline hover:text-foreground">
            Back to top ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
