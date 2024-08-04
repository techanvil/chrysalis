import { getGraphData } from "../_data/graph-data";
import { EpicQueryForm } from "./_components/EpicQueryForm";

const epicGraphs: { [key: string]: object } = {}; // TODO: Improve type when TS is working for GraphQL.
// TODO: Use unstable_cache

export default function Epic() {
  async function submitEpicQuery(formData: FormData) {
    "use server";

    const rawFormData = {
      epic: formData.get("epic") as string,
      query: formData.get("query") as string,
    };

    console.log("rawFormData", rawFormData);

    if (!epicGraphs[rawFormData.epic]) {
      // TODO: Reorg to avoid needing to pass these in.
      const workspaceId = process.env.ZENHUB_WORKSPACE_ID;
      const endpointUrl = process.env.ZENHUB_ENDPOINT_URL;
      const zenhubApiKey = process.env.ZENHUB_API_KEY;

      epicGraphs[rawFormData.epic] = await getGraphData(
        workspaceId,
        parseInt(rawFormData.epic, 10),
        endpointUrl,
        zenhubApiKey,
        undefined, // no signal
        {
          showNonEpicBlockedIssues: false,
        }
      );
    }

    console.log("epicGraphs[rawFormData.epic]", epicGraphs[rawFormData.epic]);
  }

  return <EpicQueryForm submitEpicQuery={submitEpicQuery} />;
}
