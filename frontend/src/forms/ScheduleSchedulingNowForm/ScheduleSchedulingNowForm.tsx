import { graphql, useFragment, useMutation } from "react-relay";
import { memo, useCallback } from "react";
import { ScheduleSchedulingNowForm_ScheduleNowMutation$variables } from "@/forms/ScheduleSchedulingNowForm/__generated__/ScheduleSchedulingNowForm_ScheduleNowMutation.graphql";
import { CalendarDaysIcon } from "@heroicons/react/24/solid";
import { ScheduleSchedulingNowForm_SchedulingFragment$key } from "./__generated__/ScheduleSchedulingNowForm_SchedulingFragment.graphql";

const ScheduleSchedulingNowForm = ({
  fragmentRef,
}: {
  fragmentRef: ScheduleSchedulingNowForm_SchedulingFragment$key;
}) => {
  const scheduling = useFragment(
    graphql`
      fragment ScheduleSchedulingNowForm_SchedulingFragment on Scheduling {
        id
      }
    `,
    fragmentRef,
  );

  const [commitMutation, isMutationInFlight] = useMutation(graphql`
    mutation ScheduleSchedulingNowForm_ScheduleNowMutation($id: ID!) {
      scheduleNow(id: $id) {
        scheduling {
          ...ToggleSchedulingForm_SchedulingFragment
          ...scene_SchedulingFragment
        }
      }
    }
  `);

  const mutate = useCallback(
    async (
      variables: ScheduleSchedulingNowForm_ScheduleNowMutation$variables,
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
        <CalendarDaysIcon className="h-6 w-6" />
        Schedule Now
      </button>
    </div>
  );
};

export default memo(ScheduleSchedulingNowForm);
