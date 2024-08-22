import { auth } from "@/auth";
import { ZenHubDependencyGraph } from "./_components/ZenhubDependencyGraph";
import "./globals.css";
import { Session } from "next-auth";

export default async function ZenHubDependencyGraphPage() {
  const session = await auth();

  return <ZenHubDependencyGraph session={session} />;
}
