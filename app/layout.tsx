import { Suspense } from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Authentication } from "@/components/Authentication";
import { NavLink } from "@/components/NavLink";
// import "./globals.css";
import styles from "./layout.module.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Chrysalis",
  description: "A place where things might happen.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className={styles.nav}>
          <NavLink href="/">Home</NavLink>
          <NavLink href="/zenhub">ZenHub</NavLink>
          <Authentication />
        </nav>
        <Suspense fallback={<p>⏳ loading...</p>}>{children}</Suspense>
      </body>
    </html>
  );
}
