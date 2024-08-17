"use client";

import { useEffect, useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useSession } from "next-auth/react";
// import App from "zenhub-dependency-graph/src/App";
import "zenhub-dependency-graph/src/index.css";
import { submitEpicQuery, EpicChatEntry } from "../_actions/submit-epic-query";
import { useDebouncedCallback } from "use-debounce";
import styles from "./GeminiPanel.module.css";

export function GeminiPanel({ graphData }) {
  const session = useSession();
  if (!session) {
    return <p>⚠️ Please sign in to use this feature.</p>;
  }

  if (!graphData?.length) {
    return <p>⚠️ No graph data available.</p>;
  }

  const [latestChatEntry, setLatestChatEntry] = useState<EpicChatEntry | null>(
    null
  );

  // TODO: Fix epicGraphData type.
  const queryEpic = useDebouncedCallback(async (epicGraphData) => {
    setLatestChatEntry(null);

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
        <>
          <Markdown remarkPlugins={[remarkGfm]}>
            {latestChatEntry.response}
          </Markdown>
          <div className={styles.messageBox}>
            <textarea
              placeholder="Tell me more..."
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  console.log("Enter pressed");
                }
              }}
            ></textarea>
            <button aria-label="Enter">&#9166;</button>
          </div>
        </>
      )}
    </div>
  );
}
