import { memo, useCallback } from "react";
import { ArrowPathIcon } from "@heroicons/react/24/solid";
import { graphql, useFragment, useMutation } from "react-relay";
import { ToggleSchedulingForm_SchedulingFragment$key } from "@/forms/ToggleSchedulingForm/__generated__/ToggleSchedulingForm_SchedulingFragment.graphql";
import { ToggleSchedulingForm_ToggleSchedulingMutation$variables } from "@/forms/ToggleSchedulingForm/__generated__/ToggleSchedulingForm_ToggleSchedulingMutation.graphql";

const ToggleSchedulingForm = ({
  fragmentRef,
}: {
  fragmentRef: ToggleSchedulingForm_SchedulingFragment$key;
}) => {
  const scheduling = useFragment(
    graphql`
      fragment ToggleSchedulingForm_SchedulingFragment on Scheduling {
        id
      }
    `,
    fragmentRef,
  );

  const [commitMutation, isMutationInFlight] = useMutation(graphql`
    mutation ToggleSchedulingForm_ToggleSchedulingMutation($id: ID!) {
      toggleScheduling(id: $id) {
        ...ToggleSchedulingForm_SchedulingFragment
        ...scene_SchedulingFragment
      }
    }
  `);

  const mutate = useCallback(
    async (
      variables: ToggleSchedulingForm_ToggleSchedulingMutation$variables,
    ) => {
      if (isMutationInFlight) {
        return;
      }

      commitMutation({ variables });
    },
    [isMutationInFlight, commitMutation],
  );
  return (
    <div className="pl-2">
      <button
        type="button"
        className="inline-flex bg-amber-500 text-white items-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm ring-1 ring-inset ring-transparent hover:bg-amber-600"
        onClick={() => mutate({ id: scheduling.id })}
      >
        <ArrowPathIcon className="h-6 w-6" />
        Toggle
      </button>
    </div>
  );
};

export default memo(ToggleSchedulingForm);
