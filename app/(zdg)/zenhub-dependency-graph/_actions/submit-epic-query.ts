"use server";

import { auth } from "@/auth";
import { getChat } from "@/gemini/chat-factory";

// TODO: Deduplicate this interface.
export interface EpicChatEntry {
  userName?: string | null;
  query: string;
  response: string;
}

// TODO: Improve graphData type.
export async function submitEpicQuery(
  graphData: object[],
  query: string
): Promise<EpicChatEntry> {
  "use server";

  const session = await auth();

  if (!session?.user?.email) {
    throw new Error("Not authenticated");
  }

  console.log("submitEpicQuery", {
    epicGraphDataLength: graphData.length,
    query,
  });

  const { chatSession, sendMessage } = getChat(
    session.user.email,
    // "You are a data analyst tasked with querying a JSON dataset. The dataset represents an epic, across a series of sprints. Reports should be concise and insightful, no more than 350 words, and formatted using Markdown.\n" +
    // "You are a data analyst tasked with querying a JSON dataset. The dataset represents an epic, across a series of sprints. Reports should be within 300 words and formatted using Markdown.\n" +
    "You are a data analyst tasked with querying a JSON dataset. The dataset represents an epic, across a series of sprints. Reports should be concise, insightful and fun, no more than 350 words, and formatted using Markdown.\n" +
      "Here is the data:\n" +
      JSON.stringify(graphData)
  );

  const response = await sendMessage(query);

  return {
    userName: session?.user?.name,
    query,
    response,
  };
}
