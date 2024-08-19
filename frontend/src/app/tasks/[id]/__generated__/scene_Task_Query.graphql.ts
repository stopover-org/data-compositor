/**
 * @generated SignedSource<<f2e2b8068d69253742a50b5b89e6a5a6>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type scene_Task_Query$variables = {
  id: string;
};
export type scene_Task_Query$data = {
  readonly task: {
    readonly " $fragmentSpreads": FragmentRefs<"scene_TaskFragment">;
  } | null | undefined;
};
export type scene_Task_Query = {
  response: scene_Task_Query$data;
  variables: scene_Task_Query$variables;
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
    "name": "scene_Task_Query",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Task",
        "kind": "LinkedField",
        "name": "task",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "scene_TaskFragment"
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "scene_Task_Query",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Task",
        "kind": "LinkedField",
        "name": "task",
        "plural": false,
        "selections": [
          (v2/*: any*/),
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
            "name": "configuration",
            "storageKey": null
          },
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
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "4612abf5f97f4214db2f039a9a91a168",
    "id": null,
    "metadata": {},
    "name": "scene_Task_Query",
    "operationKind": "query",
    "text": "query scene_Task_Query(\n  $id: ID!\n) {\n  task(id: $id) {\n    ...scene_TaskFragment\n    id\n  }\n}\n\nfragment scene_TaskFragment on Task {\n  id\n  adapterType\n  status\n  configuration\n  scheduling {\n    id\n    name\n  }\n}\n"
  }
};
})();

(node as any).hash = "1cac4645b6603838f5e221e9becc8681";

export default node;
