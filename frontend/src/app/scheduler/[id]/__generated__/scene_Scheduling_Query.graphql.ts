/**
 * @generated SignedSource<<4f3b39fbf0e5ddb5cd388fcb65f19e82>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type scene_Scheduling_Query$variables = {
  id: string;
};
export type scene_Scheduling_Query$data = {
  readonly scheduling: {
    readonly " $fragmentSpreads": FragmentRefs<"scene_SchedulingFragment">;
  } | null | undefined;
  readonly " $fragmentSpreads": FragmentRefs<"scene_Tasks_SchedulingFragment">;
};
export type scene_Scheduling_Query = {
  response: scene_Scheduling_Query$data;
  variables: scene_Scheduling_Query$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "id"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "id"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "status",
  "storageKey": null
},
v4 = [
  {
    "kind": "Literal",
    "name": "after",
    "value": ""
  },
  {
    "kind": "Literal",
    "name": "first",
    "value": 10
  },
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
    "name": "scene_Scheduling_Query",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Scheduling",
        "kind": "LinkedField",
        "name": "scheduling",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "scene_SchedulingFragment"
          }
        ],
        "storageKey": null
      },
      {
        "args": null,
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
    "name": "scene_Scheduling_Query",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Scheduling",
        "kind": "LinkedField",
        "name": "scheduling",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "name",
            "storageKey": null
          },
          (v3/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "nextScheduleTime",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "adapterType",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "configuration",
            "storageKey": null
          }
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": (v4/*: any*/),
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
                  (v2/*: any*/),
                  (v3/*: any*/),
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
        "args": (v4/*: any*/),
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
    "cacheID": "4c86a95e0f547001c5e0546ec00b43d7",
    "id": null,
    "metadata": {},
    "name": "scene_Scheduling_Query",
    "operationKind": "query",
    "text": "query scene_Scheduling_Query(\n  $id: ID!\n) {\n  scheduling(id: $id) {\n    ...scene_SchedulingFragment\n    id\n  }\n  ...scene_Tasks_SchedulingFragment\n}\n\nfragment DeleteSchedulingForm_SchedulingFragment on Scheduling {\n  id\n  status\n}\n\nfragment ScheduleSchedulingNowForm_SchedulingFragment on Scheduling {\n  id\n}\n\nfragment TasksList_TasksConnectionFragment on TaskConnection {\n  edges {\n    node {\n      id\n      status\n    }\n  }\n}\n\nfragment ToggleSchedulingForm_SchedulingFragment on Scheduling {\n  id\n}\n\nfragment scene_SchedulingFragment on Scheduling {\n  id\n  name\n  status\n  nextScheduleTime\n  adapterType\n  configuration\n  ...ToggleSchedulingForm_SchedulingFragment\n  ...ScheduleSchedulingNowForm_SchedulingFragment\n  ...DeleteSchedulingForm_SchedulingFragment\n}\n\nfragment scene_Tasks_SchedulingFragment on Query {\n  tasks(input: {schedulingId: $id}, first: 10, after: \"\") {\n    ...TasksList_TasksConnectionFragment\n    edges {\n      node {\n        id\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "6086e70bc86fcb4bf5fe4f207507e853";

export default node;
