import { AnimatePresence, motion } from "framer-motion";
import { wrap } from "popmotion";
import { useLayoutEffect, useRef, useState } from "react";
import styled from "styled-components";
import { IMedia, MediaTypes } from "../api";
import useViewportSize from "../hooks/useViewportSize";
import Content from "./Content";

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  top: -12vw;
  margin-bottom: 4vw;
`;
const Title = styled.h1`
  font-size: 30px;
  font-weight: bold;
  padding: 10px;

  @media (max-width: 780px) {
    font-size: 20px;
  }
`;

const Row = styled.div<{ $sliderOffset: number }>`
  position: relative;
  width: 100%;
  z-index: 2;

  height: ${(props) =>
    props.$sliderOffset === 6
      ? 10.1
      : props.$sliderOffset === 4
      ? 15.3
      : props.$sliderOffset === 3
      ? 20.5
      : 31}vw;

  display: grid;
  gap: 10px;
  grid-template-columns: ${(props) => `repeat(${props.$sliderOffset}, 1fr)`};
  transform-style: preserve-3d;
`;
const Column = styled(motion.div)`
  position: relative;
  width: 100%;
  height: 100%;
`;
const ContentWrapper = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;
const NextArrow = styled(motion.div)<{ $arrowShowing: boolean }>`
  position: absolute;
  top: 0;
  right: 0;
  width: 7vw;
  max-width: 100px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99;
  transition: opacity ease-out 300ms;
  opacity: ${(props) => (props.$arrowShowing ? 1 : 0)};

  cursor: pointer;

  ::after {
    position: absolute;
    top: 0;
    right: 0;
    content: "";
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      rgba(0, 0, 0, 0) 0%,
      rgba(0, 0, 0, 1) 100%
    );
  }

  > div {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: transform 100ms ease-out;
    z-index: 100;
    > svg {
      width: 25%;
      fill: white;
    }
  }
  :hover {
    > div {
      transform: scale(1.5);
    }
  }
`;
const PrevArrow = styled(NextArrow)`
  left: 0;
  transform: rotate(180deg);
`;

interface IContentWrapperVariants {
  direction: number;
  rowWidth: number;
}

const contentWrapperVariants = {
  enter: ({ direction, rowWidth }: IContentWrapperVariants) => ({
    x: direction > 0 ? rowWidth + 10 : -rowWidth - 10,
  }),
  center: {
    x: 0,
  },
  exit: ({ direction, rowWidth }: IContentWrapperVariants) => ({
    x: direction > 0 ? -rowWidth - 10 : rowWidth + 10,
  }),
};

interface ISliderProps {
  data: IMedia[];
  title: string;
  categoryId: string;
  mediaType: MediaTypes;
}

function Slider({ data, title, categoryId, mediaType }: ISliderProps) {
  const [arrowShowing, setArrowShowing] = useState(false);

  const { viewportWidth } = useViewportSize();

  const [sliderOffset, setSliderOffset] = useState(6);
  const [isSliding, setIsSliding] = useState(false);
  const [rowWidth, setRowWidth] = useState(0);
  const [[page, direction], setPage] = useState([0, 0]);
  const dataIndex = wrap(0, data.length - (data.length % sliderOffset), page);

  const paginate = (newDirection: number) => {
    if (isSliding) return;
    setIsSliding(true);
    setPage([page + newDirection, newDirection]);
  };

  const rowRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    rowRef.current && setRowWidth(rowRef.current.clientWidth);
  }, [rowRef, viewportWidth]);

  useLayoutEffect(() => {
    viewportWidth > 1000
      ? setSliderOffset(6)
      : viewportWidth > 800
      ? setSliderOffset(4)
      : viewportWidth > 500
      ? setSliderOffset(3)
      : setSliderOffset(2);
  }, [viewportWidth]);

  return (
    <Wrapper>
      <Title>{title}</Title>

      <Row
        $sliderOffset={sliderOffset}
        ref={rowRef}
        onMouseEnter={() => setArrowShowing(true)}
        onMouseLeave={() => setArrowShowing(false)}
      >
        {Array.from(Array(sliderOffset)).map((_, index) => (
          <Column
            key={index}
            animate={{ z: 0 }}
            whileHover={{
              z: 100,
            }}
            transition={{ delay: 0.5 }}
          >
            <AnimatePresence
              initial={false}
              custom={{ direction, rowWidth }}
              onExitComplete={() => setIsSliding(false)}
            >
              <ContentWrapper
                key={page + index}
                variants={contentWrapperVariants}
                initial="enter"
                animate="center"
                exit="exit"
                custom={{ direction, rowWidth }}
                transition={{ x: { type: "tween", duration: 1 } }}
              >
                <Content
                  isLoading={!!data}
                  data={data[dataIndex + index]}
                  category={categoryId}
                  id={data[dataIndex + index].id + ""}
                  isFirstChild={index === 0}
                  isLastChild={index === sliderOffset - 1}
                  mediaType={mediaType}
                />
              </ContentWrapper>
            </AnimatePresence>
          </Column>
        ))}{" "}
        <PrevArrow
          $arrowShowing={arrowShowing}
          onClick={() => paginate(-sliderOffset)}
        >
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
              <path d="M96 480c-8.188 0-16.38-3.125-22.62-9.375c-12.5-12.5-12.5-32.75 0-45.25L242.8 256L73.38 86.63c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0l192 192c12.5 12.5 12.5 32.75 0 45.25l-192 192C112.4 476.9 104.2 480 96 480z" />
            </svg>
          </div>
        </PrevArrow>
        <NextArrow
          $arrowShowing={arrowShowing}
          onClick={() => paginate(sliderOffset)}
        >
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
              <path d="M96 480c-8.188 0-16.38-3.125-22.62-9.375c-12.5-12.5-12.5-32.75 0-45.25L242.8 256L73.38 86.63c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0l192 192c12.5 12.5 12.5 32.75 0 45.25l-192 192C112.4 476.9 104.2 480 96 480z" />
            </svg>
          </div>
        </NextArrow>
      </Row>
    </Wrapper>
  );
}

export default Slider;
