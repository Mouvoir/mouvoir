"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getLogoVariant } from "./logoConfig";

const NAV_LINKS = [
  { href: "/choreography-styles", label: "Choreography Styles" },
  { href: "/mouvoir-anatomy", label: "Mouvoir's Anatomy" },
  { href: "/flyers-links", label: "Flyer's Links" },
  { href: "/movement-rehearsal", label: "Movement Rehearsal" },
  { href: "/connexions", label: "Connexions" },
] as const;

const BRAND = "Mouvoir";

export function Nav() {
  const pathname = usePathname();
  const logo = getLogoVariant(pathname);

  const linkBase =
    "inline-block uppercase text-[15px] px-[16px] py-[6px] rounded-full border-[1.5px] whitespace-nowrap transition-colors";
  const activeBorder = "border-white";
  const inactiveHover = "hover:border-white/60 border-transparent";

  return (
    <nav className="flex justify-around items-center gap-6 pt-3 pb-3 text-white">
      <Link href="/" aria-label={BRAND} className="inline-flex shrink-0">
        <video
          key={logo}
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
          className="w-[160px] object-contain"
        >
          <source src={`/mouvoir_${logo}/mouvoir_${logo}.webm`} type="video/webm" />
          <source src={`/mouvoir_${logo}/mouvoir_${logo}.mov`} type="video/quicktime" />
        </video>
      </Link>

      {NAV_LINKS.map(({ href, label }) => {
        const active = pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`${linkBase} ${active ? activeBorder : inactiveHover}`}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
