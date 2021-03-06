import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { useState } from "react";
import { useMatch, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { IMedia, MediaTypes } from "../api";
import useViewportSize from "../hooks/useViewportSize";
import { makeImagePath } from "../utils";
import Trailer from "./Trailer";

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
  position: relative;
  background-image: url(${(props) => props.$bgImg});
  background-size: cover;
  background-position: center center;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  aspect-ratio: 1.6/1;
  overflow: hidden;
`;

const TrailerWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  > div {
    width: 100%;
    height: 100%;
  }
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
  fromSearch?: boolean;
  mediaType: MediaTypes;
}

function Content({
  data,
  category,
  id,
  isFirstChild,
  isLastChild,
  fromDetail = false,
  fromSearch = false,
  mediaType,
}: IContentProps) {
  const navigate = useNavigate();
  const [titleShowing, setTitleShowing] = useState(false);
  const [trailerShowing, setTrailerShowing] = useState(false);
  const { viewportWidth } = useViewportSize();

  const navigateToDetail = () => {
    if (fromDetail || fromSearch) return;
    setTitleShowing(false);
    navigate(`${category}/${id}`);
  };

  return (
    <Wrapper
      layoutId={`${category + id}`}
      key={`${category + id}`}
      onClick={navigateToDetail}
      onMouseEnter={() => {
        setTitleShowing(true);
        setTrailerShowing(true);
      }}
      onMouseLeave={() => {
        setTitleShowing(false);
        setTrailerShowing(false);
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
            >
              {viewportWidth > 780 && (
                <TrailerWrapper>
                  {trailerShowing && (
                    <Trailer
                      mediaId={id}
                      mediaType={mediaType}
                      key={mediaType + id}
                      fromBanner={false}
                    />
                  )}
                </TrailerWrapper>
              )}
            </Cover>
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
              {titleShowing && (
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
