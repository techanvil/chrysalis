// import { cache } from "react";
import { revalidatePath, unstable_cache } from "next/cache";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getChat } from "@/gemini/chat-factory";
import { getGraphData } from "../_data/graph-data";
import { EpicQueryForm } from "./_components/EpicQueryForm";
import { auth } from "@/auth";

const getCachedGraphData = unstable_cache(
  async (epic: number) => {
    if (!process.env.ZENHUB_WORKSPACE_ID) {
      throw new Error("ZENHUB_WORKSPACE_ID is not set");
    }

    return getGraphData(process.env.ZENHUB_WORKSPACE_ID, epic, {
      showNonEpicBlockedIssues: false,
    });
  },
  ["get-graph-data"],
  {
    revalidate: 3600, // 1 hour
  }
);

interface EpicChatEntry {
  userName?: string | null;
  query: string;
  response: string;
}

// TODO: Store this in a database.
const epicChats: { [epic: string]: EpicChatEntry[] } = {};

export default function Epic({
  params: { epic },
}: {
  params: { epic: string };
}) {
  async function submitEpicQuery(formData: FormData) {
    "use server";

    const rawFormData = {
      query: formData.get("query") as string,
    };

    console.log("rawFormData", rawFormData);

    const result = await getCachedGraphData(parseInt(epic, 10));

    if (!result) {
      console.error("No graph data");
      return;
    }

    const { graphData } = result;

    console.log("epicGraph", {
      epic: epic,
      length: graphData.length,
    });

    const session = await auth();

    if (!session?.user?.email) {
      console.error("Not authenticated");
      return;
    }

    const { chatSession, sendMessage } = getChat(
      session.user.email,
      "You are a data analyst tasked with querying a JSON dataset. The dataset represents an epic, across a series of sprints. Reports should be concise and insightful, and formatted using Markdown.\n" +
        "Here is the data:\n" +
        JSON.stringify(graphData)
    );

    const response = await sendMessage(rawFormData.query);

    epicChats[epic] = epicChats[epic] || [];
    epicChats[epic].push({
      userName: session?.user?.name,
      query: rawFormData.query,
      response,
    });

    // const chatHistory = await chatSession.getHistory();
    // console.log("chatHistory", chatHistory);

    revalidatePath(`/zenhub/${epic}`, "page");
  }

  console.log("rendering epic page");

  return (
    <>
      {epicChats[epic] &&
        epicChats[epic].map(({ query, response }, index) => (
          <div key={index}>
            <div>{query}</div>
            <div>
              <MDXRemote source={response} />
            </div>
          </div>
        ))}
      <EpicQueryForm submitEpicQuery={submitEpicQuery} />
    </>
  );
}
