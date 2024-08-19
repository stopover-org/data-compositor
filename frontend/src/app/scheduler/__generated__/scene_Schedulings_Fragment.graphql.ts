/**
 * @generated SignedSource<<114e863b9f05871f7e5a11a731c6ed5d>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment, RefetchableFragment } from 'relay-runtime';
export type AdapterType = "TEST_ADAPTER" | "%future added value";
export type SchedulingStatus = "ACTIVE" | "INACTIVE" | "%future added value";
import { FragmentRefs } from "relay-runtime";
export type scene_Schedulings_Fragment$data = {
  readonly schedulings: {
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly adapterType: AdapterType;
        readonly id: string;
        readonly name: string;
        readonly nextScheduleTime: string | null | undefined;
        readonly status: SchedulingStatus;
      };
    }>;
  };
  readonly " $fragmentType": "scene_Schedulings_Fragment";
};
export type scene_Schedulings_Fragment$key = {
  readonly " $data"?: scene_Schedulings_Fragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"scene_Schedulings_Fragment">;
};

const node: ReaderFragment = (function(){
var v0 = [
  "schedulings"
];
return {
  "argumentDefinitions": [
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
  "kind": "Fragment",
  "metadata": {
    "connection": [
      {
        "count": "first",
        "cursor": "after",
        "direction": "forward",
        "path": (v0/*: any*/)
      }
    ],
    "refetch": {
      "connection": {
        "forward": {
          "count": "first",
          "cursor": "after"
        },
        "backward": null,
        "path": (v0/*: any*/)
      },
      "fragmentPathInResult": [],
      "operation": require('./SchedulingsPaginationQuery.graphql')
    }
  },
  "name": "scene_Schedulings_Fragment",
  "selections": [
    {
      "alias": "schedulings",
      "args": null,
      "concreteType": "SchedulingConnection",
      "kind": "LinkedField",
      "name": "__SchedulingsPagination_schedulings_connection",
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
    }
  ],
  "type": "Query",
  "abstractKey": null
};
})();

(node as any).hash = "377ba0ddef567059794937dd8c629a27";

export default node;
