import { site } from "@/lib/site";

export function SocialLinks({
  className = "flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium",
  linkClassName = "text-paper/90 transition hover:text-gold",
}: {
  className?: string;
  linkClassName?: string;
}) {
  if (!site.social.length) return null;

  return (
    <div className={className}>
      {site.social.map((item) => (
        <a
          key={item.label}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClassName}
        >
          {item.label}
        </a>
      ))}
    </div>
  );
}
