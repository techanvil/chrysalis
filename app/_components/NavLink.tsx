"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavLink({
  href,
  children,
}: Readonly<{
  href: string;
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  if (pathname === href) {
    return <span>{children}</span>;
  }

  return <Link href={href}>{children}</Link>;
}
