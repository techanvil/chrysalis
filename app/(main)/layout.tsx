import { Suspense } from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Authentication } from "./_components/Authentication";
import { NavLink } from "./_components/NavLink";
// import "./globals.css";
import styles from "./layout.module.css";
import { UnderConstruction } from "./_components/UnderConstruction";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Chrysalis",
  description: "A place where things might happen.",
};

// TODO: Show "under construction" for production.

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <UnderConstruction>
          <nav className={styles.nav}>
            <NavLink href="/">Home</NavLink>
            <NavLink href="/zenhub">ZenHub</NavLink>
            <Authentication />
          </nav>
          <Suspense fallback={<p>⏳ loading...</p>}>{children}</Suspense>
        </UnderConstruction>
      </body>
    </html>
  );
}
