/**
 * @generated SignedSource<<548c42e4f105fc614722c53a924f7643>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type ToggleSchedulingForm_CreateSchedulingMutation$variables = {
  id: string;
};
export type ToggleSchedulingForm_CreateSchedulingMutation$data = {
  readonly toggleScheduling: {
    readonly " $fragmentSpreads": FragmentRefs<"ToggleSchedulingForm_SchedulingFragment" | "scene_SchedulingFragment">;
  } | null | undefined;
};
export type ToggleSchedulingForm_CreateSchedulingMutation = {
  response: ToggleSchedulingForm_CreateSchedulingMutation$data;
  variables: ToggleSchedulingForm_CreateSchedulingMutation$variables;
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
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "ToggleSchedulingForm_CreateSchedulingMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Scheduling",
        "kind": "LinkedField",
        "name": "toggleScheduling",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "ToggleSchedulingForm_SchedulingFragment"
          },
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "scene_SchedulingFragment"
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "ToggleSchedulingForm_CreateSchedulingMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Scheduling",
        "kind": "LinkedField",
        "name": "toggleScheduling",
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
            "name": "configuration",
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "0f0e2987fdd75fe44b5cfa72eb945b9f",
    "id": null,
    "metadata": {},
    "name": "ToggleSchedulingForm_CreateSchedulingMutation",
    "operationKind": "mutation",
    "text": "mutation ToggleSchedulingForm_CreateSchedulingMutation(\n  $id: ID!\n) {\n  toggleScheduling(id: $id) {\n    ...ToggleSchedulingForm_SchedulingFragment\n    ...scene_SchedulingFragment\n    id\n  }\n}\n\nfragment ToggleSchedulingForm_SchedulingFragment on Scheduling {\n  id\n}\n\nfragment scene_SchedulingFragment on Scheduling {\n  id\n  name\n  status\n  nextScheduleTime\n  adapterType\n  configuration\n  ...ToggleSchedulingForm_SchedulingFragment\n}\n"
  }
};
})();

(node as any).hash = "57e21785ea5f3d8b01b0d5b63208f453";

export default node;
