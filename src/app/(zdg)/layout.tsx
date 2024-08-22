import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Zenhub Dependency Graph",
  description: "Visualize dependencies between Zenhub issues.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script defer src="/zdg/svg-pan-zoom.js"></script>
      </head>
      <body>
        <Suspense fallback={<p>⏳ loading...</p>}>{children}</Suspense>
      </body>
    </html>
  );
}
