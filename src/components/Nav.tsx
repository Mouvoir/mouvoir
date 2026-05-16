"use client";

import {motion} from "framer-motion";
import {useTranslations} from "next-intl";
import {Link, usePathname} from "@/i18n/navigation";

const NAV_LINKS = [
    {href: "/template", key: "template"},
    {href: "/image-bank", key: "imageBank"},
    {href: "/useful-links", key: "usefulLinks"},
    {href: "/about", key: "about"},
    {href: "/contact", key: "contact"},
] as const;

export function Nav() {
    const pathname = usePathname();
    const t = useTranslations("Nav");

    const linkBase =
        "inline-block uppercase text-[15px] px-[16px] py-[6px] rounded-full border-[1.5px] whitespace-nowrap transition-colors";
    const activeBorder = "border-white";
    const inactiveHover = "hover:border-white/60 border-transparent";

    const brand = t("brand");

    return (
        <nav className="flex justify-between items-center gap-6 pt-3 pb-3 text-white">
            <Link
                href="/"
                aria-label={brand}
                className="text-[28px] font-normal tracking-[-0.01em] inline-flex"
            >
                {brand.split("").map((char, i) => (
                    <motion.span
                        key={`${char}-${i}`}
                        aria-hidden="true"
                        className="inline-block"
                        animate={{y: [0, -4, 0, 3, 0]}}
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

            {NAV_LINKS.map(({href, key}) => {
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
        </nav>
    );
}
