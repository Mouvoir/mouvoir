import type { Metadata } from "next";
import { Libre_Franklin } from "next/font/google";
import { CharterConsent } from "@/components/charter/CharterConsent";
import { Nav } from "@/components/nav/Nav";
import "./globals.css";

const libreFranklin = Libre_Franklin({
  subsets: ["latin"],
  variable: "--font-libre-franklin",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mouvoir — Make your VJing interactive",
  description:
    "Mouvoir is an interactive VJing device that places the public at the heart of visuals in real time.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${libreFranklin.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <div className="page-shell">
          <div className="page-content">
            <Nav />
            {children}
          </div>
        </div>
        <CharterConsent />
      </body>
    </html>
  );
}
