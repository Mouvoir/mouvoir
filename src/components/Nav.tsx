"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/template", label: "Stylistes des chorés" },
  { href: "/image-bank", label: "Vestiaires visuels" },
  { href: "/useful-links", label: "Flyers des liens" },
  { href: "/about", label: "Anatomie de Mouvoir" },
  { href: "/contact", label: "Connexions de nuits" },
] as const;

const BRAND = "Mouvoir";

export function Nav() {
  const pathname = usePathname();

  const linkBase =
    "inline-block uppercase text-[15px] px-[16px] py-[6px] rounded-full border-[1.5px] whitespace-nowrap transition-colors";
  const activeBorder = "border-white";
  const inactiveHover = "hover:border-white/60 border-transparent";

  return (
    <nav className="flex justify-between items-center gap-6 pt-3 pb-3 text-white">
      <Link
        href="/"
        aria-label={BRAND}
        className="text-[28px] font-normal tracking-[-0.01em] inline-flex"
      >
        {BRAND.split("").map((char, i) => (
          <motion.span
            key={`${char}-${i}`}
            aria-hidden="true"
            className="inline-block"
            animate={{ y: [0, -4, 0, 3, 0] }}
            transition={{
              duration: 2.4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.12,
            }}
          >
            {char}
          </motion.span>
        ))}
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
