import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { useEffect, useLayoutEffect, useState } from "react";
import styled from "styled-components";
import { IGetMediaResult, MediaTypes } from "../api";
import { makeImagePath } from "../utils";
import Trailer from "./Trailer";

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: 80vw;
  max-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;

const Cover = styled.div<{ $bgImg: string }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url(${(props) => props.$bgImg});
  background-size: cover;
  background-position: center center;
  z-index: -2;
`;

const GradientBg = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(${(props) => props.theme.bgGradient});
`;

const Texts = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-start;
  padding: 0 4% 18vw;
`;

const Title = styled(motion.h1)`
  font-size: 7vw;

  font-weight: 700;
  width: 70%;
  text-shadow: ${(props) => props.theme.titleShadow};
`;
const Overview = styled(motion.p)`
  padding-top: 30px;
  width: 60%;
  font-size: 1.5vw;
  text-shadow: 0px 0px 30px rgba(0, 0, 0, 0.6);
`;

interface IBannerProps {
  bannerData: IGetMediaResult;
  mediaType: MediaTypes;
}

function Banner({ bannerData, mediaType }: IBannerProps) {
  const [randomIndex, setRandomIndex] = useState(0);
  const [overviewShowing, setOverviewShowing] = useState(true);

  useLayoutEffect(() => {
    if (!bannerData.results.length) return;
    setRandomIndex(Math.floor(Math.random() * bannerData.results.length));
  }, [bannerData]);

  return (
    <Wrapper>
      <Cover
        $bgImg={makeImagePath(
          bannerData.results[randomIndex].backdrop_path ||
            bannerData.results[randomIndex].poster_path
        )}
      />

      <Trailer
        mediaId={bannerData.results[randomIndex].id}
        mediaType={mediaType}
        key={mediaType + bannerData.results[randomIndex].id}
        fromBanner
        setOverviewShowing={setOverviewShowing}
      />

      <GradientBg />
      <LayoutGroup>
        <Texts layout>
          <Title
            layout
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              originY: 0,
              originX: 0,
              scale: overviewShowing ? 1 : 0.6,
              transition: { duration: 1 },
            }}
          >
            {bannerData.results[randomIndex].title
              ? bannerData.results[randomIndex].title
              : bannerData.results[randomIndex].name}
          </Title>
          <AnimatePresence>
            {overviewShowing ? (
              <Overview
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 0.3 } }}
                exit={{ opacity: 0, transition: { duration: 1 } }}
              >
                {bannerData.results[randomIndex].overview}
              </Overview>
            ) : null}
          </AnimatePresence>
        </Texts>
      </LayoutGroup>
    </Wrapper>
  );
}

export default Banner;
