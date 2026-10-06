import Image from "next/image";
import Link from "next/link";

export type GuideProductCtaProps = {
  headline: string;
  description: string;
  productTitle: string;
  productHref: string;
  productImage?: string;
  badgeText?: string;
};

/**
 * Soft mid-article product card. One product, one button, no pressure.
 */
export function GuideProductCta({
  headline,
  description,
  productTitle,
  productHref,
  productImage,
  badgeText,
}: GuideProductCtaProps) {
  return (
    <aside
      aria-label={`${headline}: ${productTitle}`}
      className="my-10 overflow-hidden rounded-2xl border border-rule bg-paper-2"
    >
      <div className="flex flex-col sm:flex-row sm:items-stretch">
        {productImage ? (
          <Link
            href={productHref}
            tabIndex={-1}
            aria-hidden
            className="relative block aspect-[4/3] w-full shrink-0 overflow-hidden bg-paper sm:aspect-auto sm:w-44"
          >
            <Image
              src={productImage}
              alt=""
              fill
              sizes="(min-width: 640px) 11rem, 100vw"
              className="object-cover transition duration-300 hover:scale-[1.03]"
            />
          </Link>
        ) : null}

        <div className="flex flex-1 flex-col justify-center gap-3 p-5 sm:p-6">
          {badgeText ? (
            <span className="w-fit rounded-full bg-pine px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-paper">
              {badgeText}
            </span>
          ) : null}
          <div>
            <p className="font-display text-xl leading-snug text-ink sm:text-2xl">
              {headline}
            </p>
            <p className="mt-1.5 text-sm leading-6 text-ink-soft">{description}</p>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <Link
              href={productHref}
              className="rounded-full bg-rust px-4 py-2 text-sm font-semibold text-paper transition hover:bg-rust-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine focus-visible:ring-offset-2 focus-visible:ring-offset-paper-2"
            >
              View the {productTitle}
            </Link>
            <Link
              href="/shop"
              className="text-sm font-medium text-pine transition hover:text-rust"
            >
              Browse the shop →
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}
