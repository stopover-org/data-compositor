/**
 * @generated SignedSource<<2de869f27bec799ad1cb54fb132702cf>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
export type TaskStatus = "COMPLETED" | "FAILED" | "PENDING" | "PROCESSING" | "TERMINATED" | "%future added value";
import { FragmentRefs } from "relay-runtime";
export type TasksList_TasksConnectionFragment$data = {
  readonly edges: ReadonlyArray<{
    readonly node: {
      readonly id: string;
      readonly status: TaskStatus;
    };
  }>;
  readonly " $fragmentType": "TasksList_TasksConnectionFragment";
};
export type TasksList_TasksConnectionFragment$key = {
  readonly " $data"?: TasksList_TasksConnectionFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"TasksList_TasksConnectionFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "TasksList_TasksConnectionFragment",
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
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "TaskConnection",
  "abstractKey": null
};

(node as any).hash = "ac9511c8888bd69f9ce8dfa0d409bc51";

export default node;
