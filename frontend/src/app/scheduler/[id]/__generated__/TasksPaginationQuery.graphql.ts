/**
 * @generated SignedSource<<4b8471b4ee388a3bac7de826f96e1c8c>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type TasksPaginationQuery$variables = {
  after?: string | null | undefined;
  first?: number | null | undefined;
  id: string;
};
export type TasksPaginationQuery$data = {
  readonly " $fragmentSpreads": FragmentRefs<"scene_Tasks_SchedulingFragment">;
};
export type TasksPaginationQuery = {
  response: TasksPaginationQuery$data;
  variables: TasksPaginationQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": "",
    "kind": "LocalArgument",
    "name": "after"
  },
  {
    "defaultValue": 10,
    "kind": "LocalArgument",
    "name": "first"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "id"
  }
],
v1 = {
  "kind": "Variable",
  "name": "after",
  "variableName": "after"
},
v2 = {
  "kind": "Variable",
  "name": "first",
  "variableName": "first"
},
v3 = [
  (v1/*: any*/),
  (v2/*: any*/),
  {
    "fields": [
      {
        "kind": "Variable",
        "name": "schedulingId",
        "variableName": "id"
      }
    ],
    "kind": "ObjectValue",
    "name": "input"
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "TasksPaginationQuery",
    "selections": [
      {
        "args": [
          (v1/*: any*/),
          (v2/*: any*/)
        ],
        "kind": "FragmentSpread",
        "name": "scene_Tasks_SchedulingFragment"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "TasksPaginationQuery",
    "selections": [
      {
        "alias": null,
        "args": (v3/*: any*/),
        "concreteType": "TaskConnection",
        "kind": "LinkedField",
        "name": "tasks",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "TaskEdge",
            "kind": "LinkedField",
            "name": "edges",
            "plural": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "Task",
                "kind": "LinkedField",
                "name": "node",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "id",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "status",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "__typename",
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "cursor",
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "PageInfo",
            "kind": "LinkedField",
            "name": "pageInfo",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "endCursor",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "hasNextPage",
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": (v3/*: any*/),
        "filters": [
          "input"
        ],
        "handle": "connection",
        "key": "TasksPagination_tasks",
        "kind": "LinkedHandle",
        "name": "tasks"
      }
    ]
  },
  "params": {
    "cacheID": "ab9861dfd272e000efd55fd34b38877c",
    "id": null,
    "metadata": {},
    "name": "TasksPaginationQuery",
    "operationKind": "query",
    "text": "query TasksPaginationQuery(\n  $after: String = \"\"\n  $first: Int = 10\n  $id: ID!\n) {\n  ...scene_Tasks_SchedulingFragment_2HEEH6\n}\n\nfragment TasksList_TasksConnectionFragment on TaskConnection {\n  edges {\n    node {\n      id\n      status\n    }\n  }\n}\n\nfragment scene_Tasks_SchedulingFragment_2HEEH6 on Query {\n  tasks(input: {schedulingId: $id}, first: $first, after: $after) {\n    ...TasksList_TasksConnectionFragment\n    edges {\n      node {\n        id\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "c494358fc6084544fec6273a20be67a1";

export default node;
