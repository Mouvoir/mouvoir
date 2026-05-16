"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";

const NAV_LINKS = [
  { href: "/template", key: "template" },
  { href: "/image-bank", key: "imageBank" },
  { href: "/useful-links", key: "usefulLinks" },
  { href: "/about", key: "about" },
] as const;

interface NavProps {
  variant?: "pink" | "white";
}

export function Nav({ variant = "white" }: NavProps) {
  const pathname = usePathname();
  const t = useTranslations("Nav");
  const isPink = variant === "pink";

  const linkBase =
    "inline-block text-[20px] px-[22px] py-[8px] rounded-full border-[1.5px] whitespace-nowrap transition-colors";
  const activeBorder = isPink ? "border-white" : "border-[#1a1a1a]";
  const inactiveHover = isPink
    ? "hover:border-white/60 border-transparent"
    : "hover:border-black/25 border-transparent";

  return (
    <nav
      className={`flex items-center justify-between pt-3 pb-12 ${
        isPink ? "text-white" : "text-[#1a1a1a]"
      }`}
    >
      <Link href="/" className="text-[28px] font-normal tracking-[-0.01em]">
        Partycule
      </Link>

      <div className="flex items-center gap-[72px] flex-1 justify-center pl-[80px]">
        {NAV_LINKS.map(({ href, key }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`${linkBase} ${active ? activeBorder : inactiveHover}`}
            >
              {t(key)}
            </Link>
          );
        })}
      </div>

      <span aria-hidden="true" className="w-[40px]" />
    </nav>
  );
}
