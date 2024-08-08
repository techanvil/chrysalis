// import { cache } from "react";
import { revalidatePath, unstable_cache } from "next/cache";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getChat } from "@/gemini/chat-factory";
import { getGraphData } from "../_data/graph-data";
import { EpicQueryForm } from "./_components/EpicQueryForm";
import { auth } from "@/auth";

const getCachedGraphData = unstable_cache(
  async (epic: number) =>
    getGraphData(
      process.env.ZENHUB_WORKSPACE_ID,
      epic,
      process.env.ZENHUB_ENDPOINT_URL,
      process.env.ZENHUB_API_KEY,
      undefined, // no signal
      {
        showNonEpicBlockedIssues: false,
      }
    ),
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

    const { graphData } = await getCachedGraphData(parseInt(epic, 10));

    console.log("epicGraph", {
      epic: epic,
      length: graphData.length,
    });

    const { chatSession, sendMessage } = getChat(
      "You are a data analyst tasked with querying a JSON dataset. The dataset represents an epic, across a series of sprints. Reports should be concise and insightful, and formatted using Markdown.\n" +
        "Here is the data:\n" +
        JSON.stringify(graphData)
    );

    const response = await sendMessage(rawFormData.query);

    const session = await auth();

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
