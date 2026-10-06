import { site } from "@/lib/site";

export function SocialLinks({
  className = "flex flex-wrap items-center gap-x-3 gap-y-2 text-sm font-medium",
  linkClassName = "text-paper/90 transition hover:text-gold",
  separatorClassName = "text-paper/35 select-none",
}: {
  className?: string;
  linkClassName?: string;
  separatorClassName?: string;
}) {
  if (!site.social.length) return null;

  return (
    <div className={className}>
      {site.social.map((item, index) => (
        <span key={item.label} className="inline-flex items-center gap-3">
          {index > 0 ? (
            <span aria-hidden className={separatorClassName}>
              ·
            </span>
          ) : null}
          <a
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClassName}
          >
            {item.label}
          </a>
        </span>
      ))}
    </div>
  );
}
