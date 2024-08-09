/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n  query GetWorkSpace($workspaceName: String!) {\n    viewer {\n      searchWorkspaces(query: $workspaceName) {\n        nodes {\n          id\n          name\n          zenhubOrganization {\n            name\n          }\n          activeSprint {\n            # id\n            name\n          }\n          sprints(filters: { state: { eq: OPEN } }) {\n            nodes {\n              id\n              name\n            }\n          }\n        }\n      }\n    }\n  }\n": types.GetWorkSpaceDocument,
    "\n  query GetRepoAndPipelines($workspaceId: ID!) {\n    workspace(id: $workspaceId) {\n      defaultRepository {\n        id\n        ghId\n      }\n      pipelinesConnection {\n        nodes {\n          id\n        }\n      }\n    }\n  }\n": types.GetRepoAndPipelinesDocument,
    "\n  query GetEpicLinkedIssues(\n    $workspaceId: ID!\n    $repositoryId: ID!\n    $repositoryGhId: Int!\n    $epicIssueNumber: Int!\n    $pipelineIds: [ID!]!\n  ) {\n    linkedIssues: searchIssues(\n      workspaceId: $workspaceId\n      epicIssueByInfo: {\n        repositoryGhId: $repositoryGhId\n        issueNumber: $epicIssueNumber\n      }\n      includeClosed: true\n      filters: { repositoryIds: [$repositoryId], pipelineIds: $pipelineIds }\n    ) {\n      nodes {\n        number\n        title\n        htmlUrl\n        state\n        assignees {\n          nodes {\n            login\n            # name\n          }\n        }\n        blockingIssues {\n          nodes {\n            number\n          }\n        }\n        blockedIssues {\n          nodes {\n            number\n          }\n        }\n        pipelineIssue(workspaceId: $workspaceId) {\n          pipeline {\n            name\n          }\n        }\n        estimate {\n          value\n        }\n        sprints {\n          nodes {\n            # id\n            name\n          }\n        }\n      }\n    }\n  }\n": types.GetEpicLinkedIssuesDocument,
    "\n  query GetIssueByNumber(\n    $workspaceId: ID!\n    $repositoryGhId: Int!\n    $issueNumber: Int!\n  ) {\n    issueByInfo(issueNumber: $issueNumber, repositoryGhId: $repositoryGhId) {\n      number\n      title\n      htmlUrl\n      state\n      assignees {\n        nodes {\n          login\n          # name\n        }\n      }\n      pipelineIssue(workspaceId: $workspaceId) {\n        pipeline {\n          name\n        }\n      }\n      blockingIssues {\n        nodes {\n          number\n        }\n      }\n      blockedIssues {\n        nodes {\n          number\n        }\n      }\n      sprints {\n        nodes {\n          # id\n          name\n        }\n      }\n      estimate {\n        value\n      }\n    }\n  }\n": types.GetIssueByNumberDocument,
    "\n  query GetAllOrganizations {\n    viewer {\n      zenhubOrganizations {\n        nodes {\n          id\n          name\n          workspaces {\n            nodes {\n              id\n              name\n            }\n          }\n        }\n      }\n    }\n  }\n": types.GetAllOrganizationsDocument,
    "\n  query GetAllEpics($workspaceId: ID!) {\n    workspace(id: $workspaceId) {\n      epics {\n        nodes {\n          issue {\n            number\n            title\n            closedAt\n          }\n        }\n      }\n    }\n  }\n": types.GetAllEpicsDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetWorkSpace($workspaceName: String!) {\n    viewer {\n      searchWorkspaces(query: $workspaceName) {\n        nodes {\n          id\n          name\n          zenhubOrganization {\n            name\n          }\n          activeSprint {\n            # id\n            name\n          }\n          sprints(filters: { state: { eq: OPEN } }) {\n            nodes {\n              id\n              name\n            }\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetWorkSpace($workspaceName: String!) {\n    viewer {\n      searchWorkspaces(query: $workspaceName) {\n        nodes {\n          id\n          name\n          zenhubOrganization {\n            name\n          }\n          activeSprint {\n            # id\n            name\n          }\n          sprints(filters: { state: { eq: OPEN } }) {\n            nodes {\n              id\n              name\n            }\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetRepoAndPipelines($workspaceId: ID!) {\n    workspace(id: $workspaceId) {\n      defaultRepository {\n        id\n        ghId\n      }\n      pipelinesConnection {\n        nodes {\n          id\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetRepoAndPipelines($workspaceId: ID!) {\n    workspace(id: $workspaceId) {\n      defaultRepository {\n        id\n        ghId\n      }\n      pipelinesConnection {\n        nodes {\n          id\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetEpicLinkedIssues(\n    $workspaceId: ID!\n    $repositoryId: ID!\n    $repositoryGhId: Int!\n    $epicIssueNumber: Int!\n    $pipelineIds: [ID!]!\n  ) {\n    linkedIssues: searchIssues(\n      workspaceId: $workspaceId\n      epicIssueByInfo: {\n        repositoryGhId: $repositoryGhId\n        issueNumber: $epicIssueNumber\n      }\n      includeClosed: true\n      filters: { repositoryIds: [$repositoryId], pipelineIds: $pipelineIds }\n    ) {\n      nodes {\n        number\n        title\n        htmlUrl\n        state\n        assignees {\n          nodes {\n            login\n            # name\n          }\n        }\n        blockingIssues {\n          nodes {\n            number\n          }\n        }\n        blockedIssues {\n          nodes {\n            number\n          }\n        }\n        pipelineIssue(workspaceId: $workspaceId) {\n          pipeline {\n            name\n          }\n        }\n        estimate {\n          value\n        }\n        sprints {\n          nodes {\n            # id\n            name\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetEpicLinkedIssues(\n    $workspaceId: ID!\n    $repositoryId: ID!\n    $repositoryGhId: Int!\n    $epicIssueNumber: Int!\n    $pipelineIds: [ID!]!\n  ) {\n    linkedIssues: searchIssues(\n      workspaceId: $workspaceId\n      epicIssueByInfo: {\n        repositoryGhId: $repositoryGhId\n        issueNumber: $epicIssueNumber\n      }\n      includeClosed: true\n      filters: { repositoryIds: [$repositoryId], pipelineIds: $pipelineIds }\n    ) {\n      nodes {\n        number\n        title\n        htmlUrl\n        state\n        assignees {\n          nodes {\n            login\n            # name\n          }\n        }\n        blockingIssues {\n          nodes {\n            number\n          }\n        }\n        blockedIssues {\n          nodes {\n            number\n          }\n        }\n        pipelineIssue(workspaceId: $workspaceId) {\n          pipeline {\n            name\n          }\n        }\n        estimate {\n          value\n        }\n        sprints {\n          nodes {\n            # id\n            name\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetIssueByNumber(\n    $workspaceId: ID!\n    $repositoryGhId: Int!\n    $issueNumber: Int!\n  ) {\n    issueByInfo(issueNumber: $issueNumber, repositoryGhId: $repositoryGhId) {\n      number\n      title\n      htmlUrl\n      state\n      assignees {\n        nodes {\n          login\n          # name\n        }\n      }\n      pipelineIssue(workspaceId: $workspaceId) {\n        pipeline {\n          name\n        }\n      }\n      blockingIssues {\n        nodes {\n          number\n        }\n      }\n      blockedIssues {\n        nodes {\n          number\n        }\n      }\n      sprints {\n        nodes {\n          # id\n          name\n        }\n      }\n      estimate {\n        value\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetIssueByNumber(\n    $workspaceId: ID!\n    $repositoryGhId: Int!\n    $issueNumber: Int!\n  ) {\n    issueByInfo(issueNumber: $issueNumber, repositoryGhId: $repositoryGhId) {\n      number\n      title\n      htmlUrl\n      state\n      assignees {\n        nodes {\n          login\n          # name\n        }\n      }\n      pipelineIssue(workspaceId: $workspaceId) {\n        pipeline {\n          name\n        }\n      }\n      blockingIssues {\n        nodes {\n          number\n        }\n      }\n      blockedIssues {\n        nodes {\n          number\n        }\n      }\n      sprints {\n        nodes {\n          # id\n          name\n        }\n      }\n      estimate {\n        value\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetAllOrganizations {\n    viewer {\n      zenhubOrganizations {\n        nodes {\n          id\n          name\n          workspaces {\n            nodes {\n              id\n              name\n            }\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetAllOrganizations {\n    viewer {\n      zenhubOrganizations {\n        nodes {\n          id\n          name\n          workspaces {\n            nodes {\n              id\n              name\n            }\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetAllEpics($workspaceId: ID!) {\n    workspace(id: $workspaceId) {\n      epics {\n        nodes {\n          issue {\n            number\n            title\n            closedAt\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetAllEpics($workspaceId: ID!) {\n    workspace(id: $workspaceId) {\n      epics {\n        nodes {\n          issue {\n            number\n            title\n            closedAt\n          }\n        }\n      }\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;