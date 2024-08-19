/**
 * @generated SignedSource<<16523dc1c9426cfc1877bbb432a0cbc4>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
export type SchedulingStatus = "ACTIVE" | "INACTIVE" | "%future added value";
import { FragmentRefs } from "relay-runtime";
export type DeleteSchedulingForm_SchedulingFragment$data = {
  readonly id: string;
  readonly status: SchedulingStatus;
  readonly " $fragmentType": "DeleteSchedulingForm_SchedulingFragment";
};
export type DeleteSchedulingForm_SchedulingFragment$key = {
  readonly " $data"?: DeleteSchedulingForm_SchedulingFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"DeleteSchedulingForm_SchedulingFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "DeleteSchedulingForm_SchedulingFragment",
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
  "type": "Scheduling",
  "abstractKey": null
};

(node as any).hash = "5cec1d708dd6a7b120b5bba95b390584";

export default node;
