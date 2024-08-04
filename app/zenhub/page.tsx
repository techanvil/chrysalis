import { auth } from "@/auth";

export default async function ZenHub() {
  const session = await auth();

  if (!session) return <div>⛔ please sign in to access this page</div>;

  return <main>👋 this is the ZenHub page</main>;
}
