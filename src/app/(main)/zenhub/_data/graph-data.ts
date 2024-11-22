/**
 * Initially copied from https://github.com/techanvil/zenhub-dependency-graph/blob/main/src/data/graph-data.js
 *
 * TODO: Extract to a shared library.
 */

import { createClient, fetchExchange } from "urql";
import { authExchange } from "@urql/exchange-auth";
import { registerUrql } from "@urql/next/rsc";

interface AppSettings {
  showNonEpicBlockedIssues: boolean;
}

const makeClient = () => {
  if (!process.env.ZENHUB_ENDPOINT_URL) {
    throw new Error("ZENHUB_ENDPOINT_URL is required");
  }

  return createClient({
    url: process.env.ZENHUB_ENDPOINT_URL,
    exchanges: [
      authExchange(async (utils) => {
        return {
          addAuthToOperation(operation) {
            if (!process.env.ZENHUB_API_KEY) return operation;
            return utils.appendHeaders(operation, {
              Authorization: `Bearer ${process.env.ZENHUB_API_KEY}`,
            });
          },
          didAuthError(error, operation) {
            console.log("didAuthError", { error, operation });

            return !!error;
          },
          async refreshAuth() {},
        };
      }),
      fetchExchange,
    ],
    // exchanges: [cacheExchange, fetchExchange],
  });
};

const { getClient } = registerUrql(makeClient);

import {
  // GET_WORKSPACE_QUERY,
  getRepoAndPipelinesQueryDocument,
  getEpicLinkedIssuesQueryDocument,
  getIssueByNumberQueryDocument,
  // GET_ALL_ORGANIZATIONS,
  getAllEpicsQueryDocument,
} from "./queries";
import { ChrysalisGetEpicLinkedIssuesQuery } from "@/gql/graphql";

type Issue = NonNullable<
  ChrysalisGetEpicLinkedIssuesQuery["linkedIssues"]
>["nodes"][0];
type ExtendedIssue = Issue & { isNonEpicIssue?: boolean };

function getNonEpicIssues(
  issues: ExtendedIssue[],
  relationshipProperty: "blockingIssues" | "blockedIssues"
) {
  return issues.map((issue) =>
    issue[relationshipProperty].nodes.filter(
      (relatedIssue) =>
        !issues.some((issue) => issue.number === relatedIssue.number)
    )
  );
}

async function getAllIssues(
  issues: ExtendedIssue[],
  variables: { workspaceId: string; repositoryGhId: number },
  appSettings: AppSettings
) {
  const { workspaceId, repositoryGhId } = variables;

  const nonEpicBlockingIssues = getNonEpicIssues(issues, "blockingIssues");

  const nonEpicIssues = [
    ...nonEpicBlockingIssues,
    ...(appSettings.showNonEpicBlockedIssues
      ? getNonEpicIssues(issues, "blockedIssues")
      : []),
  ].flatMap((a) => a);

  const dedupedNonEpicIssues = Object.values(
    nonEpicIssues.reduce(
      (
        issueMap: {
          [key: string]: ReturnType<typeof getNonEpicIssues>[0][0];
          // NonNullable<GetEpicLinkedIssuesQuery["linkedIssues"]>["nodes"][0]["blockingIssues"]["nodes"][0]
        },
        issue
      ) => {
        issueMap[issue.number] = issue;
        return issueMap;
      },
      {}
    )
  );

  if (dedupedNonEpicIssues.length === 0) {
    return issues;
  }

  const client = getClient();

  // FIXME: Find a way to avoid making a query per single issue!
  const nonEpicIssuesFull = await Promise.all(
    dedupedNonEpicIssues.map(async (issue) => {
      const result = await client.query(getIssueByNumberQueryDocument, {
        workspaceId,
        repositoryGhId,
        issueNumber: issue.number,
      });

      if (!result.data?.issueByInfo) {
        console.warn("No issueByInfo", { issue });
        return null;
      }

      const { issueByInfo } = result.data;

      return { ...issueByInfo, isNonEpicIssue: true };
    })
  );

  const allIssues = [...issues, ...nonEpicIssuesFull].filter(
    (issue) => !!issue
  ); // as ExtendedIssue[];

  return getAllIssues(allIssues, variables, appSettings);
}

async function getLinkedIssues(
  {
    workspaceId,
    repositoryId,
    repositoryGhId,
    epicIssueNumber,
    pipelineIds,
  }: {
    workspaceId: string;
    repositoryId: string;
    repositoryGhId: number;
    epicIssueNumber: number;
    pipelineIds: string[];
  },
  appSettings: { showNonEpicBlockedIssues: boolean }
) {
  const result = await getClient().query(getEpicLinkedIssuesQueryDocument, {
    workspaceId,
    repositoryId,
    repositoryGhId,
    epicIssueNumber,
    pipelineIds,
  });

  if (!result.data?.linkedIssues) {
    console.warn("No linkedIssues", { result });
    return [];
  }

  const { linkedIssues } = result.data;

  return getAllIssues(
    linkedIssues.nodes,
    {
      workspaceId,
      repositoryGhId,
    },
    appSettings
  );
}

/*
export async function getAllOrganizations(endpointUrl, zenhubApiKey, signal) {
  const gqlQuery = createGqlQuery(endpointUrl, zenhubApiKey, signal);

  const {
    viewer: {
      zenhubOrganizations: { nodes: organizations },
    },
  } = await gqlQuery(GET_ALL_ORGANIZATIONS, "ChrysalisGetAllOrganizations", {});

  return organizations.map((organization) => ({
    id: organization.id,
    name: organization.name,
    workspaces: organization.workspaces.nodes.map(({ id, name }) => ({
      id,
      name,
    })),
  }));
}

export async function getWorkspaces(
  workspaceName,
  endpointUrl,
  zenhubApiKey,
  signal
) {
  const gqlQuery = createGqlQuery(endpointUrl, zenhubApiKey, signal);

  const {
    viewer: {
      searchWorkspaces: { nodes: workspaces },
    },
  } = await gqlQuery(GET_WORKSPACE_QUERY, "ChrysalisGetWorkSpace", {
    workspaceName,
  });

  return workspaces.map(
    ({
      id,
      name,
      zenhubOrganization: { name: zenhubOrganizationName },
      sprints,
      activeSprint,
    }) => ({
      id,
      name,
      zenhubOrganizationName,
      sprints: sprints.nodes,
      activeSprint,
    })
  );
}
*/

export async function getAllEpics(workspaceId: string) {
  const result = await getClient().query(getAllEpicsQueryDocument, {
    workspaceId,
  });

  if (!result.data?.workspace?.epics?.nodes) {
    console.warn("No epics", { result });
    return [];
  }

  const {
    workspace: {
      epics: { nodes: epics },
    },
  } = result.data;

  return epics.map((epic) => epic.issue);
}

// export function useAllEpics() {
//   const [result] = useQuery({ query: getAllEpicsQueryDocument });
// }

export async function getGraphData(
  // workspaceName,
  workspaceId: string,
  // sprintName,
  epicIssueNumber: number,
  appSettings: { showNonEpicBlockedIssues: boolean }
) {
  console.log("getGraphData", workspaceId, epicIssueNumber);

  // const {
  //   viewer: {
  //     searchWorkspaces: {
  //       nodes: [{ id: workspaceId }],
  //     },
  //   },
  // } = await gqlQuery(GET_WORKSPACE_QUERY, "ChrysalisGetWorkSpace", {
  //   workspaceName,
  // });

  // const {
  //   workspace: {
  //     defaultRepository: { id: repositoryId, ghId: repositoryGhId },
  //     pipelinesConnection: { nodes: pipelines },
  //   },
  // } = await gqlQuery(GET_REPO_AND_PIPELINES_QUERY, "ChrysalisGetRepoAndPipelines", {
  //   workspaceId,
  // });

  const client = getClient();

  const repoAndPipelinesResult = await client.query(
    getRepoAndPipelinesQueryDocument,
    {
      workspaceId,
    }
  );

  if (!repoAndPipelinesResult.data?.workspace?.defaultRepository) {
    console.warn("No defaultRepository", { repoAndPipelinesResult });
    return null;
  }

  const {
    workspace: {
      defaultRepository: { id: repositoryId, ghId: repositoryGhId },
      pipelinesConnection: { nodes: pipelines },
    },
  } = repoAndPipelinesResult.data;

  const linkedIssues = await getLinkedIssues(
    {
      workspaceId,
      repositoryId,
      repositoryGhId,
      epicIssueNumber,
      pipelineIds: pipelines.map((pipeline) => pipeline.id),
    },
    appSettings
  );

  const epicGraphData = linkedIssues
    .map((issue) => {
      if (!issue.pipelineIssue?.pipeline) {
        console.warn("No pipeline", { issue });
        return null;
      }

      const {
        number: id,
        title,
        htmlUrl,
        state,
        isNonEpicIssue,
        assignees: { nodes: assignees },
        blockingIssues,
        pipelineIssue: {
          pipeline: { name: pipelineName },
        },
        estimate,
        sprints,
      } = issue;
      return {
        id: `${id}`,
        title,
        htmlUrl,
        isNonEpicIssue,
        assignees: assignees.map(({ login }) => login),
        parentIds: blockingIssues.nodes.map(({ number }) => `${number}`),
        pipelineName: state === "CLOSED" ? "Closed" : pipelineName,
        estimate: estimate?.value,
        sprints: sprints.nodes.map(({ name }) => name),
        // isChosenSprint: sprints.nodes.some(({ name }) => name === sprintName),
      };
    })
    .filter((issue) => !!issue);

  const issueByNumberResult = await client.query(
    getIssueByNumberQueryDocument,
    {
      workspaceId,
      repositoryGhId,
      issueNumber: epicIssueNumber,
    }
  );

  if (!issueByNumberResult.data?.issueByInfo) {
    console.warn("No issueByInfo", { issueByNumberResult });
    return null;
  }

  const { issueByInfo: epicIssue } = issueByNumberResult.data;

  // console.log("epicIssue", epicIssue);
  // console.log("workspace", workspaceId);
  // console.log("repository", repositoryId, repositoryGhId);
  // console.log("pipelines", pipelines);
  // console.log("linkedIssues", linkedIssues);
  // console.log("d3GraphData", d3GraphData);

  // window.zdgDebugInfo = {
  //   ...(window.zdgDebugInfo || {}),
  //   epicIssue,
  //   workspaceId,
  //   repositoryId,
  //   repositoryGhId,
  //   pipelines,
  //   linkedIssues,
  //   d3GraphData,
  // };

  return {
    graphData: epicGraphData,
    epicIssue,
  };
}
