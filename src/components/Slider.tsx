import { AnimatePresence, motion } from "framer-motion";
import { wrap } from "popmotion";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import styled from "styled-components";
import { IMedia } from "../api";
import useViewportSize from "../hooks/useViewportSize";
import Content from "./Content";

const Wrapper = styled.div`
  position: relative;
  width: 100%;

  top: -100px;
  margin-bottom: 5vw;
`;
const Title = styled.h1`
  font-size: 30px;
  font-weight: bold;
  padding: 10px;
`;

const Main = styled.div<{ $sliderOffset: number }>`
  position: relative;

  height: ${(props) =>
    props.$sliderOffset === 6
      ? 10.1
      : props.$sliderOffset === 4
      ? 15.3
      : props.$sliderOffset === 3
      ? 20.5
      : 31}vw;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const Contents = styled(motion.div)<{ $sliderOffset: number }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  display: grid;
  gap: 10px;
  grid-template-columns: ${(props) => `repeat(${props.$sliderOffset}, 1fr)`};

  transform-style: preserve-3d;
`;

const NextArrow = styled(motion.div)`
  position: absolute;
  top: 0;
  right: 0;
  width: 8vw;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99;
  svg {
    width: 40px;
    height: 40px;
    fill: white;
    cursor: pointer;
  }
`;

interface ISliderProps {
  data: IMedia[];
  title: string;
  categoryId: string;
}

interface IContentsVariants {
  viewportWidth: number;
  direction: number;
}

// const contentsVariants = {
//   initial: ({ viewportWidth, isBackward }: IContentsVariants) => ({
//     x: viewportWidth + 10,
//   }),
//   animate: { x: 0 },
//   exit: ({ viewportWidth, isBackward }: IContentsVariants) => ({
//     x: -viewportWidth - 10,
//   }),
// };
const contentsVariants = {
  initial: ({ viewportWidth, direction }: IContentsVariants) => ({
    x: direction < 0 ? -viewportWidth - 10 : viewportWidth + 10,
  }),
  animate: { x: 0 },
  exit: ({ viewportWidth, direction }: IContentsVariants) => ({
    x: direction < 0 ? viewportWidth + 10 : -viewportWidth - 10,
  }),
};

function Slider({ data, title, categoryId }: ISliderProps) {
  const { viewportWidth } = useViewportSize();

  const [sliderOffset, setSliderOffset] = useState(6);
  // const [sliderIndex, setSliderIndex] = useState(0);
  // const [keyIndex, setKeyIndex] = useState(0);
  const [isSliding, setIsSliding] = useState(false);
  // const [isBackward, setIsBackward] = useState(false);

  // const increaseSliderIndex = () => {
  //   if (data) {
  //     if (isSliding) return;
  //     setIsBackward(false);
  //     setIsSliding(true);
  //     const maxIndex = Math.floor(data.length / sliderOffset) - 1;
  //     setSliderIndex((prev) => (prev + 1 > maxIndex ? 0 : prev + 1));
  //     setKeyIndex((prev) => prev + 1);
  //   }
  // };

  // const decreaseSliderIndex = () => {
  //   if (data) {
  //     if (isSliding) return;
  //     setIsBackward(true);
  //     setIsSliding(true);
  //     const maxIndex = Math.floor(data.length / sliderOffset) - 1;
  //     setSliderIndex((prev) => (prev - 1 < 0 ? maxIndex : prev - 1));
  //     setKeyIndex((prev) => prev - 1);
  //   }
  // };

  const [[page, direction], setPage] = useState([0, 0]);
  const imageIndex = wrap(0, Math.floor(data.length / sliderOffset) - 1, page);

  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  };

  console.log(page, direction);

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
      <Title onClick={() => paginate(-1)}>{title}</Title>
      <Main $sliderOffset={sliderOffset}>
        <AnimatePresence
          initial={false}
          custom={{ viewportWidth, direction }}
          onExitComplete={() => setIsSliding(false)}
        >
          <Contents
            variants={contentsVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            key={page}
            transition={{ type: "tween", duration: 1 }}
            custom={{ viewportWidth, direction }}
            $sliderOffset={sliderOffset}
          >
            {data
              .slice(
                sliderOffset * imageIndex,
                sliderOffset * imageIndex + sliderOffset
              )
              .map((item, index) => (
                <Content
                  isLoading={!!data}
                  data={item}
                  category={categoryId}
                  id={item.id + ""}
                  key={item.id}
                  isFirstChild={index === 0}
                  isLastChild={index === sliderOffset - 1}
                />
              ))}
          </Contents>
        </AnimatePresence>
        <NextArrow>
          <svg
            onClick={() => paginate(1)}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 320 512"
          >
            <path d="M96 480c-8.188 0-16.38-3.125-22.62-9.375c-12.5-12.5-12.5-32.75 0-45.25L242.8 256L73.38 86.63c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0l192 192c12.5 12.5 12.5 32.75 0 45.25l-192 192C112.4 476.9 104.2 480 96 480z" />
          </svg>
        </NextArrow>
      </Main>
    </Wrapper>
  );
}

export default Slider;
