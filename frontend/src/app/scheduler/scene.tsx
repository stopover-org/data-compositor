"use client";

import { graphql, useLazyLoadQuery, usePaginationFragment } from "react-relay";
import { memo } from "react";
import { truncatedUUID } from "@/utils/truncateUUID";
import { scene_SchedulingsConnection_Query } from "@/app/scheduler/__generated__/scene_SchedulingsConnection_Query.graphql";
import { scene_Schedulings_Fragment$key } from "@/app/scheduler/__generated__/scene_Schedulings_Fragment.graphql";
import { PlusIcon } from "@heroicons/react/24/solid";
import { SchedulingsPaginationQuery } from "@/app/scheduler/__generated__/SchedulingsPaginationQuery.graphql";
import InfiniteScroll from "@/components/InfiniteScroll";

const Scene = () => {
  const query = useLazyLoadQuery<scene_SchedulingsConnection_Query>(
    graphql`
      query scene_SchedulingsConnection_Query {
        ...scene_Schedulings_Fragment
      }
    `,
    {},
  );

  const {
    data: { schedulings },
    loadNext,
  } = usePaginationFragment<
    SchedulingsPaginationQuery,
    scene_Schedulings_Fragment$key
  >(
    graphql`
      fragment scene_Schedulings_Fragment on Query
      @argumentDefinitions(
        first: { type: "Int", defaultValue: 10 }
        after: { type: "String", defaultValue: "" }
      )
      @refetchable(queryName: "SchedulingsPaginationQuery") {
        schedulings(first: $first, after: $after)
          @connection(key: "SchedulingsPagination_schedulings") {
          edges {
            node {
              id
              name
              status
              nextScheduleTime
              adapterType
            }
          }
        }
      }
    `,
    query,
  );

  return (
    <>
      <div className="flex items-start justify-start p-6 lg:px-8">
        <div className="min-w-0 pr-2">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Scheduler
          </h2>
        </div>
        <div className="mt-0 flex lg:ml-4">
          <span className="block">
            <a
              href="/scheduler/new"
              className="inline-flex bg-amber-500 text-white items-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm ring-1 ring-inset ring-transparent hover:bg-amber-600"
            >
              <PlusIcon className="h-6 w-6" />
              New Scheduling
            </a>
          </span>
        </div>
      </div>
      <div className="mt-0 flex lg:ml-4">
        <div className="flex flex-col">
          <div className="overflow-x-auto sm:-mx-6 lg:-mx-8 min-w-[1024px]">
            <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
              <div className="overflow-hidden">
                <table className="min-w-full text-left text-sm font-light text-surface dark:text-white">
                  <thead className="border-b border-neutral-200 font-medium dark:border-white/10">
                    <tr>
                      <th scope="col" className="px-6 py-4">
                        #
                      </th>
                      <th scope="col" className="px-6 py-4">
                        Name
                      </th>
                      <th scope="col" className="px-6 py-4">
                        Next Schedule Time
                      </th>
                      <th scope="col" className="px-6 py-4">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-4">
                        Adapter Type
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <InfiniteScroll loadNext={() => loadNext(30)}>
                      {schedulings.edges.map(({ node: scheduling }) => (
                        <tr
                          key={scheduling.id}
                          className="border-b border-neutral-200 dark:border-white/10"
                        >
                          <td className="whitespace-nowrap px-6 py-4 font-medium">
                            <a href={`scheduler/${scheduling.id}`}>
                              {truncatedUUID(scheduling.id)}
                            </a>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            {scheduling.name}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            {scheduling.nextScheduleTime}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            {scheduling.status}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            {scheduling.adapterType}
                          </td>
                        </tr>
                      ))}
                    </InfiniteScroll>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default memo(Scene);
