/**
 * @generated SignedSource<<dd91040c7eb93b602805bf51a6dd39ed>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment, RefetchableFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type scene_Tasks_SchedulingFragment$data = {
  readonly tasks: {
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly id: string;
      };
    }>;
    readonly " $fragmentSpreads": FragmentRefs<"TasksList_TasksConnectionFragment">;
  };
  readonly " $fragmentType": "scene_Tasks_SchedulingFragment";
};
export type scene_Tasks_SchedulingFragment$key = {
  readonly " $data"?: scene_Tasks_SchedulingFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"scene_Tasks_SchedulingFragment">;
};

const node: ReaderFragment = (function(){
var v0 = [
  "tasks"
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
    },
    {
      "kind": "RootArgument",
      "name": "id"
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
      "operation": require('./TasksPaginationQuery.graphql')
    }
  },
  "name": "scene_Tasks_SchedulingFragment",
  "selections": [
    {
      "alias": "tasks",
      "args": [
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
      ],
      "concreteType": "TaskConnection",
      "kind": "LinkedField",
      "name": "__TasksPagination_tasks_connection",
      "plural": false,
      "selections": [
        {
          "args": null,
          "kind": "FragmentSpread",
          "name": "TasksList_TasksConnectionFragment"
        },
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

(node as any).hash = "c494358fc6084544fec6273a20be67a1";

export default node;
