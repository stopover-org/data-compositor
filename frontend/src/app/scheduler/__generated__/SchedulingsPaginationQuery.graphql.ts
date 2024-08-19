/**
 * @generated SignedSource<<05a5caed4eb5b9982a5478723ff5c993>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type SchedulingsPaginationQuery$variables = {
  after?: string | null | undefined;
  first?: number | null | undefined;
};
export type SchedulingsPaginationQuery$data = {
  readonly " $fragmentSpreads": FragmentRefs<"scene_Schedulings_Fragment">;
};
export type SchedulingsPaginationQuery = {
  response: SchedulingsPaginationQuery$data;
  variables: SchedulingsPaginationQuery$variables;
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
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "after",
    "variableName": "after"
  },
  {
    "kind": "Variable",
    "name": "first",
    "variableName": "first"
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "SchedulingsPaginationQuery",
    "selections": [
      {
        "args": (v1/*: any*/),
        "kind": "FragmentSpread",
        "name": "scene_Schedulings_Fragment"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "SchedulingsPaginationQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "SchedulingConnection",
        "kind": "LinkedField",
        "name": "schedulings",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "SchedulingEdge",
            "kind": "LinkedField",
            "name": "edges",
            "plural": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "Scheduling",
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
                    "name": "name",
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
        "args": (v1/*: any*/),
        "filters": null,
        "handle": "connection",
        "key": "SchedulingsPagination_schedulings",
        "kind": "LinkedHandle",
        "name": "schedulings"
      }
    ]
  },
  "params": {
    "cacheID": "f7f3fc5b4d30f330245887716b148096",
    "id": null,
    "metadata": {},
    "name": "SchedulingsPaginationQuery",
    "operationKind": "query",
    "text": "query SchedulingsPaginationQuery(\n  $after: String = \"\"\n  $first: Int = 10\n) {\n  ...scene_Schedulings_Fragment_2HEEH6\n}\n\nfragment scene_Schedulings_Fragment_2HEEH6 on Query {\n  schedulings(first: $first, after: $after) {\n    edges {\n      node {\n        id\n        name\n        status\n        nextScheduleTime\n        adapterType\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "377ba0ddef567059794937dd8c629a27";

export default node;
