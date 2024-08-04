import { getAllEpics } from "../_data/graph-data";
import { EpicSelect } from "./EpicSelect";
import styles from "./EpicChooser.module.css";

export function EpicChooser() {
  const workspaceId = process.env.ZENHUB_WORKSPACE_ID;
  const endpointUrl = process.env.ZENHUB_ENDPOINT_URL;
  const zenhubApiKey = process.env.ZENHUB_API_KEY;
  const epicsPromise = getAllEpics(
    workspaceId,
    endpointUrl,
    zenhubApiKey
    // no signal
  ).then((epics) => epics.filter(({ closedAt }) => !closedAt));

  return (
    <div className={styles.container}>
      🚀 epic: <EpicSelect epicsPromise={epicsPromise} />
    </div>
  );
}
