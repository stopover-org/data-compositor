import { graphql, useFragment } from "react-relay";
import { truncatedUUID } from "@/utils/truncateUUID";
import { memo } from "react";
import InfiniteScroll from "@/components/InfiniteScroll";
import { TasksList_TasksConnectionFragment$key } from "./__generated__/TasksList_TasksConnectionFragment.graphql";

const TasksList = ({
  fragmentRef,
  loadNext,
}: {
  fragmentRef: TasksList_TasksConnectionFragment$key;
  loadNext: () => void;
}) => {
  const tasks = useFragment(
    graphql`
      fragment TasksList_TasksConnectionFragment on TaskConnection {
        edges {
          node {
            id
            status
          }
        }
      }
    `,
    fragmentRef,
  );

  return (
    <div className="mt-0 flex lg:ml-4">
      <div className="flex flex-col">
        <div className="overflow-x-auto sm:-mx-6 lg:-mx-8 min-w-[1024px]">
          <h3 className="text-2xl px-3 pt-6 pb-2 min-w-full ">Tasks</h3>
        </div>
        <div className="overflow-x-auto sm:-mx-6 lg:-mx-8 min-w-[1024px]">
          <div className="inline-block min-w-full py-2">
            <div className="overflow-hidden">
              <table className="min-w-full text-left text-sm font-light text-surface dark:text-white">
                <thead className="border-b border-neutral-200 font-medium dark:border-white/10">
                  <tr>
                    <th scope="col" className="px-6 py-4">
                      #
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <InfiniteScroll loadNext={loadNext}>
                    {tasks.edges.map(({ node: task }) => (
                      <tr
                        key={task.id}
                        className="border-b border-neutral-200 dark:border-white/10"
                      >
                        <td className="whitespace-nowrap px-6 py-4 font-medium">
                          <a href={`/tasks/${task.id}`}>
                            {truncatedUUID(task.id)}
                          </a>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          {task.status}
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
  );
};

export default memo(TasksList);
