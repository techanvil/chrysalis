import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Authentication } from "@/components/Authentication";
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
          <Authentication />
        </nav>
        {children}
      </body>
    </html>
  );
}
