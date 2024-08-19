import { memo, ReactNode, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

const InfiniteScroll = ({
  loadNext,
  children,
}: {
  loadNext: () => void;
  children: ReactNode;
}) => {
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView) {
      loadNext();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  return (
    <>
      {children}
      <tr className="block" ref={ref} />
    </>
  );
};

export default memo(InfiniteScroll);
