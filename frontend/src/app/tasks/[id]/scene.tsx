"use client";

import { useParams } from "next/navigation";
import { graphql, useFragment, useLazyLoadQuery } from "react-relay";
import NoAccess from "@/components/NoAccess";
import { scene_TaskFragment$key } from "@/app/tasks/[id]/__generated__/scene_TaskFragment.graphql";
import { scene_Task_Query } from "@/app/tasks/[id]/__generated__/scene_Task_Query.graphql";
import { memo } from "react";

const Scene = () => {
  const params = useParams();
  const query = useLazyLoadQuery<scene_Task_Query>(
    graphql`
      query scene_Task_Query($id: ID!) {
        task(id: $id) {
          ...scene_TaskFragment
        }
      }
    `,
    { id: params.id as string },
  );

  const task = useFragment<scene_TaskFragment$key>(
    graphql`
      fragment scene_TaskFragment on Task {
        id
        adapterType
        status
        configuration
        scheduling {
          id
          name
        }
      }
    `,
    query.task,
  );

  if (!task) {
    return <NoAccess signIn={false} />;
  }

  return (
    <div className="flex items-start justify-start p-6 lg:px-8">
      <div className="min-w-0 w-[100%] pr-2">
        <div className="flex w-[100%] flex-col">
          <div className="flex justify-between w-[100%]">
            <div className="flex justify-start items-center">
              <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight flex items-center">
                Scheduling {task.scheduling.name}
              </h2>
              <span className="ml-2 py-1 px-2 text-xs rounded-2 inline-block whitespace-nowrap text-center bg-amber-200 text-amber-700 align-baseline font-bold uppercase leading-none">
                {task.status}
              </span>
              <span className="ml-2 py-1 px-2 text-xs rounded-2 inline-block whitespace-nowrap text-center bg-amber-200 text-amber-700 align-baseline font-bold uppercase leading-none">
                {task.adapterType}
              </span>
            </div>
          </div>
        </div>
        <div className="flex justify-start flex-col w-[100%] pt-6">
          <div className="font-light font-bold text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight flex items-center">
            Configuration:
          </div>
          <pre className="pt-2">
            {JSON.stringify(JSON.parse(task.configuration), undefined, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default memo(Scene);
