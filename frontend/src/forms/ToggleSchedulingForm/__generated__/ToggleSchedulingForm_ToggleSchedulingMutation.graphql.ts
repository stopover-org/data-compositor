/**
 * @generated SignedSource<<6779cb750e68279ca1402950036fac76>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type ToggleSchedulingForm_ToggleSchedulingMutation$variables = {
  id: string;
};
export type ToggleSchedulingForm_ToggleSchedulingMutation$data = {
  readonly toggleScheduling: {
    readonly " $fragmentSpreads": FragmentRefs<"ToggleSchedulingForm_SchedulingFragment" | "scene_SchedulingFragment">;
  } | null | undefined;
};
export type ToggleSchedulingForm_ToggleSchedulingMutation = {
  response: ToggleSchedulingForm_ToggleSchedulingMutation$data;
  variables: ToggleSchedulingForm_ToggleSchedulingMutation$variables;
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
    "name": "ToggleSchedulingForm_ToggleSchedulingMutation",
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
    "name": "ToggleSchedulingForm_ToggleSchedulingMutation",
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
    "cacheID": "993c86de1f1a9cdd4bf256a306b5c92f",
    "id": null,
    "metadata": {},
    "name": "ToggleSchedulingForm_ToggleSchedulingMutation",
    "operationKind": "mutation",
    "text": "mutation ToggleSchedulingForm_ToggleSchedulingMutation(\n  $id: ID!\n) {\n  toggleScheduling(id: $id) {\n    ...ToggleSchedulingForm_SchedulingFragment\n    ...scene_SchedulingFragment\n    id\n  }\n}\n\nfragment DeleteSchedulingForm_SchedulingFragment on Scheduling {\n  id\n  status\n}\n\nfragment ScheduleSchedulingNowForm_SchedulingFragment on Scheduling {\n  id\n}\n\nfragment ToggleSchedulingForm_SchedulingFragment on Scheduling {\n  id\n}\n\nfragment scene_SchedulingFragment on Scheduling {\n  id\n  name\n  status\n  nextScheduleTime\n  adapterType\n  configuration\n  ...ToggleSchedulingForm_SchedulingFragment\n  ...ScheduleSchedulingNowForm_SchedulingFragment\n  ...DeleteSchedulingForm_SchedulingFragment\n}\n"
  }
};
})();

(node as any).hash = "bcfbd7b86952277ab3af70beeb8aaa73";

export default node;
