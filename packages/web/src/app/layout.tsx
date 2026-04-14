import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fullstack Challenge",
  description: "Buchverwaltung – Fullstack Challenge",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body>
        <div className="container">
          <nav>
            <Link href="/" className="nav-brand">
              Fullstack Challenge
            </Link>
            <Link href="/">Home</Link>
            <Link href="/books">Bücher</Link>
            <Link href="/api-doc">API Docs</Link>
          </nav>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
