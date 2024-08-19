import { graphql, useFragment, useMutation } from "react-relay";
import { memo, useCallback } from "react";
import { DeleteSchedulingForm_DeleteSchedulingMutation$variables } from "@/forms/DeleteSchedulingForm/__generated__/DeleteSchedulingForm_DeleteSchedulingMutation.graphql";
import { TrashIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import { DeleteSchedulingForm_SchedulingFragment$key } from "./__generated__/DeleteSchedulingForm_SchedulingFragment.graphql";

const DeleteSchedulingForm = ({
  fragmentRef,
}: {
  fragmentRef: DeleteSchedulingForm_SchedulingFragment$key;
}) => {
  const router = useRouter();
  const scheduling = useFragment<DeleteSchedulingForm_SchedulingFragment$key>(
    graphql`
      fragment DeleteSchedulingForm_SchedulingFragment on Scheduling {
        id
        status
      }
    `,
    fragmentRef,
  );

  const [commitMutation, isMutationInFlight] = useMutation(graphql`
    mutation DeleteSchedulingForm_DeleteSchedulingMutation($id: ID!) {
      removeScheduling(id: $id) {
        ...DeleteSchedulingForm_SchedulingFragment
        ...scene_SchedulingFragment
      }
    }
  `);

  const mutate = useCallback(
    async (
      variables: DeleteSchedulingForm_DeleteSchedulingMutation$variables,
    ) => {
      if (isMutationInFlight) {
        return;
      }

      commitMutation({ variables });

      router.push("/scheduler");
    },
    [isMutationInFlight, commitMutation],
  );

  if (scheduling.status === "ACTIVE") {
    return null;
  }

  return (
    <div className="pl-2">
      <button
        type="button"
        className="inline-flex bg-red-700 text-white items-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm ring-1 ring-inset ring-transparent hover:bg-red-800"
        onClick={() => mutate({ id: scheduling.id })}
      >
        <TrashIcon className="h-6 w-6" />
        Delete
      </button>
    </div>
  );
};

export default memo(DeleteSchedulingForm);
