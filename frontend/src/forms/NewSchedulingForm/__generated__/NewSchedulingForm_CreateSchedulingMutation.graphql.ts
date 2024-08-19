/**
 * @generated SignedSource<<bc942fc814ef01c977992d643dc383d5>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type AdapterType = "TEST_ADAPTER" | "%future added value";
export type SchedulingStatus = "ACTIVE" | "INACTIVE" | "%future added value";
export type SchedulingInput = {
  adapterType: AdapterType;
  configuration: string;
  maxRetries?: number | null | undefined;
  name: string;
  retentionPeriod?: number | null | undefined;
};
export type NewSchedulingForm_CreateSchedulingMutation$variables = {
  input: SchedulingInput;
};
export type NewSchedulingForm_CreateSchedulingMutation$data = {
  readonly createScheduling: {
    readonly adapterType: AdapterType;
    readonly configuration: string;
    readonly id: string;
    readonly maxRetries: number;
    readonly retentionPeriod: number;
    readonly status: SchedulingStatus;
  } | null | undefined;
};
export type NewSchedulingForm_CreateSchedulingMutation = {
  response: NewSchedulingForm_CreateSchedulingMutation$data;
  variables: NewSchedulingForm_CreateSchedulingMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "input"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input"
      }
    ],
    "concreteType": "Scheduling",
    "kind": "LinkedField",
    "name": "createScheduling",
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
        "name": "configuration",
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
        "name": "status",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "retentionPeriod",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "maxRetries",
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "NewSchedulingForm_CreateSchedulingMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "NewSchedulingForm_CreateSchedulingMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "1029a92cc2158078e62525581963bc60",
    "id": null,
    "metadata": {},
    "name": "NewSchedulingForm_CreateSchedulingMutation",
    "operationKind": "mutation",
    "text": "mutation NewSchedulingForm_CreateSchedulingMutation(\n  $input: SchedulingInput!\n) {\n  createScheduling(input: $input) {\n    id\n    configuration\n    adapterType\n    status\n    retentionPeriod\n    maxRetries\n  }\n}\n"
  }
};
})();

(node as any).hash = "3266da83c8ebe5ab68f74510d77133a8";

export default node;
