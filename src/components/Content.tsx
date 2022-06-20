import { LayoutGroup, motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { IMedia } from "../api";
import { makeImagePath } from "../utils";

const Wrapper = styled(motion.div)`
  position: relative;
  display: flex;
  flex-direction: column;
  cursor: pointer;
`;

const Cover = styled(motion.div)<{ $bgImg: string }>`
  background-image: url(${(props) => props.$bgImg});
  background-size: cover;
  background-position: center center;
  /* width: 100%;
  height: 100%; */
  aspect-ratio: 1.6/1;
`;

const NoCover = styled(motion.div)`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const Title = styled(motion.h3)`
  background-color: #3b3b3b;
  padding: 5px;
`;

interface IContentVariants {
  isFirstChild: boolean;
  isLastChild: boolean;
}

const contentVariants = {
  initial: ({ isFirstChild, isLastChild }: IContentVariants) => ({
    originX: isFirstChild ? 0 : isLastChild ? 1 : 0.5,
    originY: 1,
  }),
  hover: {
    scale: 1.4,
    zIndex: 2,
    transition: {
      delay: 0.3,
    },
  },
};

const titleVariants = {
  initial: {
    opacity: 0,
  },

  hover: {
    opacity: 1,
  },
};

interface IContentProps {
  isLoading: boolean;
  data: IMedia;
  category: string;
  id: string;
  isFirstChild: boolean;
  isLastChild: boolean;
}

function Content({
  data,
  category,
  id,
  isFirstChild,
  isLastChild,
}: IContentProps) {
  const navigate = useNavigate();
  const [isMouseEnter, setIsMouseEnter] = useState(false);

  const navigateToDetail = () => {
    navigate(`${category}/${id}`);
  };

  return (
    <Wrapper
      onClick={navigateToDetail}
      onMouseEnter={() => {
        setIsMouseEnter(true);
      }}
      onMouseLeave={() => {
        setIsMouseEnter(false);
      }}
      layoutId={`${category}${id}`}
      variants={contentVariants}
      initial="initial"
      animate="initial"
      exit="initial"
      whileHover="hover"
      custom={{ isFirstChild, isLastChild }}
      transition={{ type: "tween" }}
    >
      <LayoutGroup>
        {data.backdrop_path ? (
          <Cover layout $bgImg={makeImagePath(data.backdrop_path, "w500")} />
        ) : (
          <NoCover layout>{data.title || data.name}</NoCover>
        )}

        {isMouseEnter && (
          <Title
            key="contentTitle"
            // initial={{ opacity: 0 }}
            // animate={{ opacity: 1, transition: { delay: 0.3 } }}
            // exit={{ opacity: 0 }}

            variants={titleVariants}
            initial="initial"
            animate="hover"
            exit="initial"
          >
            {data.title || data.name}
          </Title>
        )}
      </LayoutGroup>
    </Wrapper>
  );
}

export default Content;
