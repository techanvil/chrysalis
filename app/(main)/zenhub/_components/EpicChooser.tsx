import { unstable_cache } from "next/cache";
import { getAllEpics } from "../_data/graph-data";
import { EpicSelect } from "./EpicSelect";
import styles from "./EpicChooser.module.css";

const getCachedEpics = unstable_cache(
  async () => {
    if (!process.env.ZENHUB_WORKSPACE_ID) {
      throw new Error("ZENHUB_WORKSPACE_ID is required");
    }

    return getAllEpics(process.env.ZENHUB_WORKSPACE_ID);
  },
  ["get-all-epics"],
  {
    revalidate: 3600, // 1 hour
  }
);

// const getCachedEpics = unstable_cache(
//   async () =>
//     getAllEpics(
//       process.env.ZENHUB_WORKSPACE_ID,
//       process.env.ZENHUB_ENDPOINT_URL,
//       process.env.ZENHUB_API_KEY,
//       undefined // no signal
//     ),
//   ["get-all-epics"],
//   {
//     revalidate: 3600, // 1 hour
//   }
// );

export function EpicChooser() {
  // TODO: Reorg to avoid needing to pass these in.
  const workspaceId = process.env.ZENHUB_WORKSPACE_ID;
  const endpointUrl = process.env.ZENHUB_ENDPOINT_URL;
  const zenhubApiKey = process.env.ZENHUB_API_KEY;

  const epicsPromise = getCachedEpics().then((epics) =>
    epics.filter(({ closedAt }) => !closedAt)
  );

  return (
    <div className={styles.container}>
      🚀 epic: <EpicSelect epicsPromise={epicsPromise} />
    </div>
  );
}
