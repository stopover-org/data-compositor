/**
 * @generated SignedSource<<1889b6aec92b60e1c1889bae46946aeb>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type ToggleSchedulingForm_SchedulingFragment$data = {
  readonly id: string;
  readonly " $fragmentType": "ToggleSchedulingForm_SchedulingFragment";
};
export type ToggleSchedulingForm_SchedulingFragment$key = {
  readonly " $data"?: ToggleSchedulingForm_SchedulingFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"ToggleSchedulingForm_SchedulingFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ToggleSchedulingForm_SchedulingFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "id",
      "storageKey": null
    }
  ],
  "type": "Scheduling",
  "abstractKey": null
};

(node as any).hash = "d38ee942b9c4d667668eede08dc28ec9";

export default node;
