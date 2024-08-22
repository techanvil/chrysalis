"use client";

import dynamic from "next/dynamic";
import { signIn, signOut, SessionProvider } from "next-auth/react";
// import App from "zenhub-dependency-graph/src/App";
import "zenhub-dependency-graph/src/index.css";
import { Session } from "next-auth";
import { GeminiPanel } from "./GeminiPanel";
import { GraphData } from "./types";

const DynamicApp = dynamic(() => import("zenhub-dependency-graph/src/App"), {
  ssr: false,
});

export function ZenHubDependencyGraph({
  session,
}: {
  session: Session | null;
}) {
  return (
    <SessionProvider session={session}>
      <DynamicApp
        authentication={{
          session,
          signIn: () => signIn("google"),
          signInLabel: "Sign in with Google",
          // signIn("google", { redirectTo: "/zenhub-dependency-graph" }),
          signOut,
        }}
        panel={{
          buttonTitle: "Gemini",
          PanelComponent: ({ graphData }: { graphData: GraphData }) => {
            if (!session) {
              return <p>⚠️ Please sign in to use this feature.</p>;
            }

            if (!graphData?.length) {
              return <p>⚠️ No graph data available.</p>;
            }

            return <GeminiPanel graphData={graphData} />;
          },
        }}
      />
    </SessionProvider>
  );
}
