// import { cache } from "react";
import { unstable_cache } from "next/cache";
import { sendMessage } from "@/gemini/send-message";
import { getGraphData } from "../_data/graph-data";
import { EpicQueryForm } from "./_components/EpicQueryForm";

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

    // const response = await sendMessage(
    //   "This json describes the epic being queried\n" +
    //     // JSON.stringify(epicGraphs[epic]) +
    //     JSON.stringify(graphData) +
    //     `\n${rawFormData.query}`
    // );

    // console.log("response", response);
  }

  console.log("rendering epic page");

  return <EpicQueryForm submitEpicQuery={submitEpicQuery} />;
}
