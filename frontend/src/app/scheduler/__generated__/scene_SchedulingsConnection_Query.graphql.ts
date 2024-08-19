/**
 * @generated SignedSource<<45558592dc52578815183d51d4f17606>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type scene_SchedulingsConnection_Query$variables = Record<PropertyKey, never>;
export type scene_SchedulingsConnection_Query$data = {
  readonly " $fragmentSpreads": FragmentRefs<"scene_Schedulings_Fragment">;
};
export type scene_SchedulingsConnection_Query = {
  response: scene_SchedulingsConnection_Query$data;
  variables: scene_SchedulingsConnection_Query$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "Literal",
    "name": "after",
    "value": ""
  },
  {
    "kind": "Literal",
    "name": "first",
    "value": 10
  }
];
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "scene_SchedulingsConnection_Query",
    "selections": [
      {
        "args": null,
        "kind": "FragmentSpread",
        "name": "scene_Schedulings_Fragment"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "scene_SchedulingsConnection_Query",
    "selections": [
      {
        "alias": null,
        "args": (v0/*: any*/),
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
        "storageKey": "schedulings(after:\"\",first:10)"
      },
      {
        "alias": null,
        "args": (v0/*: any*/),
        "filters": null,
        "handle": "connection",
        "key": "SchedulingsPagination_schedulings",
        "kind": "LinkedHandle",
        "name": "schedulings"
      }
    ]
  },
  "params": {
    "cacheID": "faff9c9e48d824105404d91c4557e04c",
    "id": null,
    "metadata": {},
    "name": "scene_SchedulingsConnection_Query",
    "operationKind": "query",
    "text": "query scene_SchedulingsConnection_Query {\n  ...scene_Schedulings_Fragment\n}\n\nfragment scene_Schedulings_Fragment on Query {\n  schedulings(first: 10, after: \"\") {\n    edges {\n      node {\n        id\n        name\n        status\n        nextScheduleTime\n        adapterType\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "7e62d392cf837bab526e34bcff2ae92a";

export default node;
