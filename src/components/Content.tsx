import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { IMedia } from "../api";
import { makeImagePath } from "../utils";

const Wrapper = styled(motion.div)``;

const LayoutWrapper = styled(motion.div)`
  position: relative;
  display: flex;
  flex-direction: column;
  /* display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto; */
  /* background-color: red; */
  cursor: pointer;
`;

const Cover = styled(motion.div)<{ $bgImg: string }>`
  background-image: url(${(props) => props.$bgImg});
  background-size: cover;
  background-position: center center;
  width: 100%;
  aspect-ratio: 1.6/1;
`;

const NoCover = styled(motion.div)`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-color: #3b3b3b;
  aspect-ratio: 1.6/1;
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
    scale: 1,
    boxShadow: "0px 0px 0px 0px rgba(0,0,0,0)",
  }),
  hover: () => ({
    scale: 1.8,
    // y: -30,
    boxShadow: "0px 0px 50px 0px rgba(0,0,0,0.8)",
    transition: { delay: 0.5, type: "tween" },
  }),
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
      layoutId={`${category + id}`}
      onClick={navigateToDetail}
      onMouseEnter={() => {
        setIsMouseEnter(true);
      }}
      onMouseLeave={() => {
        setIsMouseEnter(false);
      }}
    >
      <LayoutGroup>
        <LayoutWrapper
          layout
          variants={contentVariants}
          initial="initial"
          animate="initial"
          whileHover="hover"
          transition={{ type: "tween" }}
          custom={{ isFirstChild, isLastChild }}
        >
          {data.backdrop_path ? (
            <Cover layout $bgImg={makeImagePath(data.backdrop_path, "w500")} />
          ) : (
            <NoCover layout>{data.title || data.name}</NoCover>
          )}
          <AnimatePresence>
            {isMouseEnter && (
              <Title
                key="contentTitle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 0.5 } }}
                exit={{ opacity: 0 }}
              >
                {data.title || data.name}
              </Title>
            )}
          </AnimatePresence>
        </LayoutWrapper>
      </LayoutGroup>
    </Wrapper>
  );
}

export default Content;
