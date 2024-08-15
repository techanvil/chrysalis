"use client";

import { use, useEffect, useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import dynamic from "next/dynamic";
// import App from "zenhub-dependency-graph/src/App";
import "zenhub-dependency-graph/src/index.css";
import { submitEpicQuery, EpicChatEntry } from "./_actions/submit-epic-query";
import { useDebouncedCallback } from "use-debounce";
import "./globals.css";
import styles from "./page.module.css";

const DynamicApp = dynamic(() => import("zenhub-dependency-graph/src/App"), {
  ssr: false,
});

export default function ZenHubDependencyGraphPage() {
  return (
    <DynamicApp
      panel={{
        buttonTitle: "Gem",
        PanelComponent: ({ graphData }) => {
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
