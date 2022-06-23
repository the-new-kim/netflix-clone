import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { IMedia } from "../api";
import { makeImagePath } from "../utils";

const Wrapper = styled(motion.div)`
  border-radius: 5px;
  overflow: hidden;
`;

const LayoutWrapper = styled(motion.div)`
  position: relative;
  display: flex;
  flex-direction: column;
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
  background-color: ${(props) => props.theme.bgLightGray};
  aspect-ratio: 1.6/1;
`;

const Title = styled(motion.h3)<{ $fromDetail?: boolean }>`
  background-color: ${(props) =>
    props.$fromDetail ? props.theme.bgLightGray : props.theme.bgDarkGray};
  padding: 10px;
  height: 100%;
`;

interface IContentVariants {
  isFirstChild: boolean;
  isLastChild: boolean;
}

const contentVariants = {
  animate: ({ isFirstChild, isLastChild }: IContentVariants) => ({
    originX: isFirstChild ? 0 : isLastChild ? 1 : 0.5,
    originY: 0.8,
    scale: 1,
    boxShadow: "0px 0px 0px 0px rgba(0,0,0,0)",
    transition: { type: "tween" },
  }),
  hover: () => ({
    scale: 1.8,
    boxShadow: "0px 0px 10px 1px rgba(0,0,0,1)",
    transition: { delay: 0.5, type: "tween" },
  }),
};

const titleVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { delay: 0.5 } },
  exit: { opacity: 0 },
};

interface IContentProps {
  isLoading: boolean;
  data: IMedia;
  category: string;
  id: string;
  isFirstChild: boolean;
  isLastChild: boolean;
  fromDetail?: boolean;
}

function Content({
  data,
  category,
  id,
  isFirstChild,
  isLastChild,
  fromDetail = false,
}: IContentProps) {
  const navigate = useNavigate();
  const [showTitle, setShowTitle] = useState(false);

  const navigateToDetail = () => {
    if (fromDetail) return;
    setShowTitle(false);
    navigate(`${category}/${id}`);
  };

  return (
    <Wrapper
      layoutId={`${category + id}`}
      key={`${category + id}`}
      onClick={navigateToDetail}
      onMouseEnter={() => {
        setShowTitle(true);
      }}
      onMouseLeave={() => {
        setShowTitle(false);
      }}
      variants={contentVariants}
      initial={false}
      animate="animate"
      whileHover="hover"
      custom={{ isFirstChild, isLastChild }}
    >
      <LayoutGroup>
        <LayoutWrapper layout>
          {data.backdrop_path || data.poster_path ? (
            <Cover
              layoutId={`${category + id}cover`}
              key={`${category + id}cover`}
              layout
              $bgImg={makeImagePath(
                data.backdrop_path || data.poster_path,
                "w500"
              )}
            />
          ) : (
            <NoCover
              layoutId={`${category + id}noCover`}
              key={`${category + id}noCover`}
              layout
            >
              {data.title || data.name}
            </NoCover>
          )}

          {fromDetail ? (
            <Title $fromDetail={fromDetail}>{data.title || data.name}</Title>
          ) : (
            <AnimatePresence>
              {showTitle && (
                <Title
                  key="contentTitle"
                  variants={titleVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  {data.title || data.name}
                </Title>
              )}
            </AnimatePresence>
          )}
        </LayoutWrapper>
      </LayoutGroup>
    </Wrapper>
  );
}

export default Content;
