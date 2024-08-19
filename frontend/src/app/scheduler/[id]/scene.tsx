"use client";

import { memo, useMemo } from "react";
import {
  graphql,
  useFragment,
  useLazyLoadQuery,
  usePaginationFragment,
} from "react-relay";
import { useParams } from "next/navigation";
import { scene_Scheduling_Query } from "@/app/scheduler/[id]/__generated__/scene_Scheduling_Query.graphql";
import NoAccess from "@/components/NoAccess";
import ToggleSchedulingForm from "@/forms/ToggleSchedulingForm";
import { scene_SchedulingFragment$key } from "@/app/scheduler/[id]/__generated__/scene_SchedulingFragment.graphql";
import { formatRelative, subDays } from "date-fns";
import ScheduleSchedulingNowForm from "@/forms/ScheduleSchedulingNowForm";
import DeleteSchedulingForm from "@/forms/DeleteSchedulingForm";
import TasksList from "@/components/TasksList";
import { scene_Tasks_SchedulingFragment$key } from "@/app/scheduler/[id]/__generated__/scene_Tasks_SchedulingFragment.graphql";
import { TasksPaginationQuery } from "./__generated__/TasksPaginationQuery.graphql";

const Scene = () => {
  const params = useParams();
  const query = useLazyLoadQuery<scene_Scheduling_Query>(
    graphql`
      query scene_Scheduling_Query($id: ID!) {
        scheduling(id: $id) {
          ...scene_SchedulingFragment
        }
        ...scene_Tasks_SchedulingFragment
      }
    `,
    { id: params.id as string },
  );

  const scheduling = useFragment<scene_SchedulingFragment$key>(
    graphql`
      fragment scene_SchedulingFragment on Scheduling {
        id
        name
        status
        nextScheduleTime
        adapterType
        configuration
        ...ToggleSchedulingForm_SchedulingFragment
        ...ScheduleSchedulingNowForm_SchedulingFragment
        ...DeleteSchedulingForm_SchedulingFragment
      }
    `,
    query.scheduling,
  );

  const tasks = usePaginationFragment<
    TasksPaginationQuery,
    scene_Tasks_SchedulingFragment$key
  >(
    graphql`
      fragment scene_Tasks_SchedulingFragment on Query
      @argumentDefinitions(
        first: { type: "Int", defaultValue: 10 }
        after: { type: "String", defaultValue: "" }
      )
      @refetchable(queryName: "TasksPaginationQuery") {
        tasks(input: { schedulingId: $id }, first: $first, after: $after)
          @connection(key: "TasksPagination_tasks") {
          ...TasksList_TasksConnectionFragment
          edges {
            node {
              id
            }
          }
        }
      }
    `,
    query,
  );

  const calendarDate = useMemo(() => {
    if (!scheduling?.nextScheduleTime) {
      return "Not scheduled";
    }
    const date = subDays(scheduling?.nextScheduleTime, 1);
    return formatRelative(date, new Date());
  }, [scheduling]);

  if (!scheduling) {
    return <NoAccess signIn={false} />;
  }

  return (
    <div className="flex items-start justify-start p-6 lg:px-8">
      <div className="min-w-0 w-[100%] pr-2">
        <div className="flex w-[100%] flex-col">
          <div className="flex justify-between w-[100%]">
            <div className="flex justify-start items-center">
              <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight flex items-center">
                Scheduling {scheduling.name}
              </h2>
              <span className="ml-2 py-1 px-2 text-xs rounded-2 inline-block whitespace-nowrap text-center bg-amber-200 text-amber-700 align-baseline font-bold uppercase leading-none">
                {scheduling.status}
              </span>
              <span className="ml-2 py-1 px-2 text-xs rounded-2 inline-block whitespace-nowrap text-center bg-amber-200 text-amber-700 align-baseline font-bold uppercase leading-none">
                {scheduling.adapterType}
              </span>
              <span className="ml-2 py-1 px-2 text-xs rounded-2 inline-block whitespace-nowrap text-center bg-amber-200 text-amber-700 align-baseline font-bold uppercase leading-none">
                {calendarDate}
              </span>
            </div>
            <div className="flex">
              <ToggleSchedulingForm fragmentRef={scheduling} />
              <ScheduleSchedulingNowForm fragmentRef={scheduling} />
              <DeleteSchedulingForm fragmentRef={scheduling} />
            </div>
          </div>
          <div className="text-2sm">{scheduling.id}</div>
        </div>
        <TasksList
          loadNext={() => tasks.loadNext(30)}
          fragmentRef={tasks.data.tasks}
        />
      </div>
    </div>
  );
};

export default memo(Scene);
