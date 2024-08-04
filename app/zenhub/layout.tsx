import { auth } from "@/auth";
import { EpicChooser } from "./_components/EpicChooser";

export default async function ZenHubLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) return <div>⛔ please sign in to access this page</div>;

  return (
    <>
      <section>
        <EpicChooser />
      </section>
      {children}
    </>
  );
}
