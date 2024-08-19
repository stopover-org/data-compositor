/**
 * @generated SignedSource<<92cced7d1d56efb7cba05c7efa90ca09>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type ScheduleSchedulingNowForm_SchedulingFragment$data = {
  readonly id: string;
  readonly " $fragmentType": "ScheduleSchedulingNowForm_SchedulingFragment";
};
export type ScheduleSchedulingNowForm_SchedulingFragment$key = {
  readonly " $data"?: ScheduleSchedulingNowForm_SchedulingFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"ScheduleSchedulingNowForm_SchedulingFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ScheduleSchedulingNowForm_SchedulingFragment",
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

(node as any).hash = "38b6f62226882839ea8245300fc63afc";

export default node;
