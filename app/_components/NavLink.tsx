"use client";

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

  return <a href={href}>{children}</a>;
}
