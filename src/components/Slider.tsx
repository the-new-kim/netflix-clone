import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import styled from "styled-components";
import { IMedia } from "../api";
import Column from "./Column";

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  top: -100px;
  margin-bottom: 5vw;
`;
const Title = styled.h1`
  font-size: 30px;
  font-weight: bold;
  padding: 10px;
`;

const Main = styled.div`
  position: relative;
  width: 100%;

  height: fit-content;
  background-color: red;
`;

const Contents = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(6, 1fr);
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

const contentsVariants = {
  initial: { x: window.innerWidth + 10 },
  animate: { x: 0 },
  exit: { x: -window.innerWidth - 10 },
};

function Slider({ data, title, categoryId }: ISliderProps) {
  const [sliderOffset, setSliderOffset] = useState(6);
  const [sliderIndex, setSliderIndex] = useState(0);
  const [isSliding, setIsSliding] = useState(false);

  const increasesliderIndex = () => {
    if (data) {
      if (isSliding) return;
      setIsSliding(true);
      const maxIndex = Math.floor(data?.length / sliderOffset) - 1;
      setSliderIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };

  return (
    <Wrapper>
      <Title>{title}</Title>
      <Main>
        <AnimatePresence
          initial={false}
          onExitComplete={() => setIsSliding(false)}
        >
          <Contents
            variants={contentsVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            key={sliderIndex}
            transition={{ type: "tween", duration: 1 }}
          >
            {data
              .slice(
                sliderOffset * sliderIndex,
                sliderOffset * sliderIndex + sliderOffset
              )
              .map((item) => (
                <Column
                  isLoading={!!data}
                  data={item}
                  id={`${categoryId}${item.id + ""}`}
                  key={item.id}
                />
              ))}
          </Contents>
        </AnimatePresence>
        <NextArrow>
          <svg
            onClick={increasesliderIndex}
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
