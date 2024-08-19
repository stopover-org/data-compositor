import { memo } from "react";
import Scene from "@/app/tasks/[id]/scene";

const Page = () => (
  <div className="flex flex-col justify-start">
    <Scene />
  </div>
);

export default memo(Page);
