import { motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { IMedia, MediaType } from "../api";
import useViewportSize from "../hooks/useViewportSize";
import { makeImagePath } from "../utils";

const Wrapper = styled(motion.div)<{ $height: string }>`
  position: relative;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  height: ${(props) => props.$height};
`;

const Cover = styled(motion.div)<{ $bgImg: string }>`
  background-image: url(${(props) => props.$bgImg});
  background-size: cover;
  background-position: center center;
  width: 100%;
  height: 100%;
`;

const NoCover = styled(motion.div)`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

// const coverVariants = {
//   animate: (coverWidth: number) => ({ height: coverWidth * 0.625 }),
// };

interface IColumnProps {
  isLoading: boolean;
  data: IMedia;
  id: string;
}

function Column({ isLoading, data, id }: IColumnProps) {
  const { viewportWidth } = useViewportSize();
  const [coverWidth, setCoverWidth] = useState(0);

  const coverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (coverRef.current) setCoverWidth(coverRef.current.clientWidth);
  }, [isLoading, viewportWidth]);

  return (
    <Wrapper $height={`${coverWidth * 0.625}px`}>
      {data.backdrop_path ? (
        <Cover
          ref={coverRef}
          layoutId={id}
          //   variants={coverVariants}
          //   animate="animate"
          $bgImg={makeImagePath(data.backdrop_path, "w500")}
          //   custom={coverWidth}
        />
      ) : (
        <NoCover
          ref={coverRef}
          layoutId={id}
          //   variants={coverVariants}
          //   animate="animate"
          //   custom={coverWidth}
        >
          {data.title || data.name}
        </NoCover>
      )}

      {/* {data.media_type === MediaType.MOVIE ? data.title : data.name} */}
    </Wrapper>
  );
}

export default React.memo(Column);
