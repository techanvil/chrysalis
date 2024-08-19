"use client";

import { useEffect, useRef, useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useSession } from "next-auth/react";
// import App from "zenhub-dependency-graph/src/App";
import "zenhub-dependency-graph/src/index.css";
import { submitEpicQuery, EpicChatEntry } from "../_actions/submit-epic-query";
import { useDebouncedCallback } from "use-debounce";
import styles from "./GeminiPanel.module.css";
import { GraphData } from "./types";

export function GeminiPanel({ graphData }: { graphData: GraphData }) {
  const session = useSession();

  const [chatHistory, setChatHistory] = useState<EpicChatEntry[]>([]);
  const [submittingQuery, setSubmittingQuery] = useState(false);

  async function queryEpic(epicGraphData: GraphData, query: string) {
    setSubmittingQuery(true);

    console.log("graphData", epicGraphData);

    const chatEntry = await submitEpicQuery(graphData, query);

    setChatHistory((currentChatHistory) => [...currentChatHistory, chatEntry]);
    setSubmittingQuery(false);
  }

  const debouncedQueryEpic = useDebouncedCallback(queryEpic, 1000);

  useEffect(() => {
    if (chatHistory.length === 0) {
      debouncedQueryEpic(graphData, "");
    } else {
      setChatHistory([
        ...chatHistory,
        {
          userName: "System",
          query: "",
          response: "🔄 graph data updated...",
        },
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- Omit chatHistory/debouncedQueryEpic to avoid infinite loop.
  }, [graphData]); //

  useEffect(() => {
    // Scroll the top of the latest chat entry to the top of the scrollable element.
    const scrollWrapper = document.querySelector(".panel-scroll-wrapper");

    if (scrollWrapper) {
      const offset = chatHistory.length % 2 === 0 ? 1 : 2;
      const latestChatEntry = scrollWrapper.querySelector(
        ".zdg-chat-entry-" + (chatHistory.length - offset)
      );

      if (latestChatEntry) {
        const chatContainerTop = scrollWrapper.getBoundingClientRect().top;
        const latestChatEntryTop = latestChatEntry.getBoundingClientRect().top;

        scrollWrapper.scrollTo({
          top: scrollWrapper.scrollTop + latestChatEntryTop - chatContainerTop,
          behavior: "smooth",
        });
      }
    }
  }, [chatHistory]);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function handleSendMessage() {
    if (textareaRef.current) {
      const query = textareaRef.current.value;
      if (query.trim() === "") {
        return;
      }

      setChatHistory([
        ...chatHistory,
        {
          userName: session.data?.user?.name,
          query: "",
          response: query, // TODO: Use a simplified type for chat entries.
        },
      ]);

      queryEpic(graphData, query);
      textareaRef.current.value = "";
    }
  }

  return (
    <div className={`${styles.container} zdg-chat-container`}>
      {chatHistory.length === 0 && <p>⏳ loading...</p>}
      {chatHistory.length > 0 && (
        <>
          {chatHistory.map((chatEntry, index) => (
            <>
              <Markdown
                className={`${styles.chatEntry} zdg-chat-entry-${index}`}
                remarkPlugins={[remarkGfm]}
              >
                {chatEntry.response}
              </Markdown>
              {index < chatHistory.length - 1 && (
                <div className={styles.chatEntryDivider} />
              )}
            </>
          ))}
          {submittingQuery && <p>⏳ submitting query...</p>}
          <div className={styles.messageBox}>
            <textarea
              ref={textareaRef}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  console.log("Enter pressed");

                  handleSendMessage();
                }
              }}
              placeholder="Tell me more..."
            ></textarea>
            <button
              onClick={handleSendMessage}
              disabled={submittingQuery}
              aria-label="Enter"
            >
              &#9166;
            </button>
          </div>
        </>
      )}
    </div>
  );
}
