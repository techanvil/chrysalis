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

  console.log("submitEpicQuery", {
    epicGraphDataLength: graphData.length,
    query,
  });

  const { chatSession, sendMessage } = getChat(
    "You are a data analyst tasked with querying a JSON dataset. The dataset represents an epic, across a series of sprints. Reports should be concise and insightful, and formatted using Markdown.\n" +
      "Here is the data:\n" +
      JSON.stringify(graphData)
  );

  const response = await sendMessage(query);

  const session = await auth();

  return {
    userName: session?.user?.name,
    query,
    response,
  };
}
