import Image from "next/image";

export function ClubLogo({
  size = 44,
  className = "",
  priority = false,
}: {
  size?: number;
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src="/brand/club-logo.png"
      alt="Broke Dads Club"
      width={size}
      height={size}
      priority={priority}
      className={`rounded-full ${className}`.trim()}
    />
  );
}
