/**
 * @generated SignedSource<<7032faf03d80ac0313fc2f150f5e5977>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
export type AdapterType = "TEST_ADAPTER" | "%future added value";
export type SchedulingStatus = "ACTIVE" | "INACTIVE" | "%future added value";
import { FragmentRefs } from "relay-runtime";
export type scene_SchedulingFragment$data = {
  readonly adapterType: AdapterType;
  readonly configuration: string;
  readonly id: string;
  readonly name: string;
  readonly nextScheduleTime: string | null | undefined;
  readonly status: SchedulingStatus;
  readonly " $fragmentSpreads": FragmentRefs<"DeleteSchedulingForm_SchedulingFragment" | "ScheduleSchedulingNowForm_SchedulingFragment" | "ToggleSchedulingForm_SchedulingFragment">;
  readonly " $fragmentType": "scene_SchedulingFragment";
};
export type scene_SchedulingFragment$key = {
  readonly " $data"?: scene_SchedulingFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"scene_SchedulingFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "scene_SchedulingFragment",
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
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "ToggleSchedulingForm_SchedulingFragment"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "ScheduleSchedulingNowForm_SchedulingFragment"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "DeleteSchedulingForm_SchedulingFragment"
    }
  ],
  "type": "Scheduling",
  "abstractKey": null
};

(node as any).hash = "623863f61d78c7b07e2856a15ec0d02e";

export default node;
