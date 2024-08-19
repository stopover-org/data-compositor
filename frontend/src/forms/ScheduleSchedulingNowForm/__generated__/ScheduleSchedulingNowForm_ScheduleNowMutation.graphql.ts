/**
 * @generated SignedSource<<1833f38fce2dc4a0266644da74f2bca7>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type ScheduleSchedulingNowForm_ScheduleNowMutation$variables = {
  id: string;
};
export type ScheduleSchedulingNowForm_ScheduleNowMutation$data = {
  readonly scheduleNow: {
    readonly scheduling: {
      readonly " $fragmentSpreads": FragmentRefs<"ToggleSchedulingForm_SchedulingFragment" | "scene_SchedulingFragment">;
    };
  } | null | undefined;
};
export type ScheduleSchedulingNowForm_ScheduleNowMutation = {
  response: ScheduleSchedulingNowForm_ScheduleNowMutation$data;
  variables: ScheduleSchedulingNowForm_ScheduleNowMutation$variables;
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
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "ScheduleSchedulingNowForm_ScheduleNowMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Task",
        "kind": "LinkedField",
        "name": "scheduleNow",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "Scheduling",
            "kind": "LinkedField",
            "name": "scheduling",
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
    "name": "ScheduleSchedulingNowForm_ScheduleNowMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Task",
        "kind": "LinkedField",
        "name": "scheduleNow",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
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
          },
          (v2/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "4340edffe3700eb93080ce28e5a0cd31",
    "id": null,
    "metadata": {},
    "name": "ScheduleSchedulingNowForm_ScheduleNowMutation",
    "operationKind": "mutation",
    "text": "mutation ScheduleSchedulingNowForm_ScheduleNowMutation(\n  $id: ID!\n) {\n  scheduleNow(id: $id) {\n    scheduling {\n      ...ToggleSchedulingForm_SchedulingFragment\n      ...scene_SchedulingFragment\n      id\n    }\n    id\n  }\n}\n\nfragment DeleteSchedulingForm_SchedulingFragment on Scheduling {\n  id\n  status\n}\n\nfragment ScheduleSchedulingNowForm_SchedulingFragment on Scheduling {\n  id\n}\n\nfragment ToggleSchedulingForm_SchedulingFragment on Scheduling {\n  id\n}\n\nfragment scene_SchedulingFragment on Scheduling {\n  id\n  name\n  status\n  nextScheduleTime\n  adapterType\n  configuration\n  ...ToggleSchedulingForm_SchedulingFragment\n  ...ScheduleSchedulingNowForm_SchedulingFragment\n  ...DeleteSchedulingForm_SchedulingFragment\n}\n"
  }
};
})();

(node as any).hash = "dbffe3e84ce95d14052b292a81428900";

export default node;
