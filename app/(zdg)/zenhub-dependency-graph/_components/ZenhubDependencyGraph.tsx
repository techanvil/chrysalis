"use client";

import { use, useEffect, useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import dynamic from "next/dynamic";
import { signIn, signOut, useSession, SessionProvider } from "next-auth/react";
// import App from "zenhub-dependency-graph/src/App";
import "zenhub-dependency-graph/src/index.css";
import { submitEpicQuery, EpicChatEntry } from "../_actions/submit-epic-query";
import { useDebouncedCallback } from "use-debounce";
import styles from "./ZenhubDependencyGraph.module.css";
import { Session } from "next-auth";

const DynamicApp = dynamic(() => import("zenhub-dependency-graph/src/App"), {
  ssr: false,
});

export function ZenHubDependencyGraph({
  session,
}: {
  session: Session | null;
}) {
  return (
    <DynamicApp
      authentication={{
        session,
        signIn: () => signIn("google"),
        // signIn("google", { redirectTo: "/zenhub-dependency-graph" }),
        signOut,
      }}
      panel={{
        buttonTitle: "Gemini",
        PanelComponent: ({ graphData }) => {
          if (!session) {
            return <p>⚠️ Please sign in to use this feature.</p>;
          }

          const [latestChatEntry, setLatestChatEntry] =
            useState<EpicChatEntry | null>(null);

          // TODO: Fix epicGraphData type.
          const queryEpic = useDebouncedCallback(async (epicGraphData) => {
            console.log("graphData", epicGraphData);

            const query = ""; // TODO: Get query from user input.

            const chatEntry = await submitEpicQuery(graphData, query);

            setLatestChatEntry(chatEntry);
          }, 1000);

          useEffect(() => {
            queryEpic(graphData);
          }, [graphData, queryEpic]);

          // useEffect(() => {
          //   (async () => {
          //     console.log("graphData", graphData);

          //     const query = ""; // TODO: Get query from user input.
          //     const chatEntry = await submitEpicQuery(graphData, query);

          //     setLatestChatEntry(chatEntry);
          //   })();
          // }, [graphData]);

          return (
            <div className={`${styles.container} zdg-chat-container`}>
              {!latestChatEntry && <p>⏳ loading...</p>}
              {latestChatEntry && (
                <Markdown remarkPlugins={[remarkGfm]}>
                  {latestChatEntry.response}
                </Markdown>
              )}
            </div>
          );
        },
      }}
    />
  );
}
