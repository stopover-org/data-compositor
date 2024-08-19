/**
 * @generated SignedSource<<0fd8dc1762ad906d96a56a282f1dee6d>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type DeleteSchedulingForm_DeleteSchedulingMutation$variables = {
  id: string;
};
export type DeleteSchedulingForm_DeleteSchedulingMutation$data = {
  readonly removeScheduling: {
    readonly " $fragmentSpreads": FragmentRefs<"DeleteSchedulingForm_SchedulingFragment" | "scene_SchedulingFragment">;
  } | null | undefined;
};
export type DeleteSchedulingForm_DeleteSchedulingMutation = {
  response: DeleteSchedulingForm_DeleteSchedulingMutation$data;
  variables: DeleteSchedulingForm_DeleteSchedulingMutation$variables;
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
    "name": "DeleteSchedulingForm_DeleteSchedulingMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Scheduling",
        "kind": "LinkedField",
        "name": "removeScheduling",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "DeleteSchedulingForm_SchedulingFragment"
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
    "name": "DeleteSchedulingForm_DeleteSchedulingMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Scheduling",
        "kind": "LinkedField",
        "name": "removeScheduling",
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
            "name": "name",
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
    "cacheID": "defa26baed59de58d070a2197b3901f5",
    "id": null,
    "metadata": {},
    "name": "DeleteSchedulingForm_DeleteSchedulingMutation",
    "operationKind": "mutation",
    "text": "mutation DeleteSchedulingForm_DeleteSchedulingMutation(\n  $id: ID!\n) {\n  removeScheduling(id: $id) {\n    ...DeleteSchedulingForm_SchedulingFragment\n    ...scene_SchedulingFragment\n    id\n  }\n}\n\nfragment DeleteSchedulingForm_SchedulingFragment on Scheduling {\n  id\n  status\n}\n\nfragment ScheduleSchedulingNowForm_SchedulingFragment on Scheduling {\n  id\n}\n\nfragment ToggleSchedulingForm_SchedulingFragment on Scheduling {\n  id\n}\n\nfragment scene_SchedulingFragment on Scheduling {\n  id\n  name\n  status\n  nextScheduleTime\n  adapterType\n  configuration\n  ...ToggleSchedulingForm_SchedulingFragment\n  ...ScheduleSchedulingNowForm_SchedulingFragment\n  ...DeleteSchedulingForm_SchedulingFragment\n}\n"
  }
};
})();

(node as any).hash = "b0aaf8819bf4b8d43be7d5b620db643d";

export default node;
