import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import styled from "styled-components";
import {
  getMovieTrailers,
  getTvShowTrailers,
  IGetMediaResult,
  IGetTrailersResult,
  ITrailer,
  MatchTypes,
} from "../api";
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
  font-size: 5vw;
  margin-bottom: 30px;
  font-weight: 700;
  width: 70%;
  text-shadow: ${(props) => props.theme.titleShadow};
`;
const Overview = styled(motion.p)`
  width: 60%;
  font-size: 1.5vw;
  text-shadow: 0px 0px 30px rgba(0, 0, 0, 0.6);
`;

interface IBannerProps {
  bannerData: IGetMediaResult;
  matchedType: MatchTypes;
}

function Banner({ bannerData, matchedType }: IBannerProps) {
  const [randomIndex, setRandomIndex] = useState(19);
  const [trailer, setTrailer] = useState<ITrailer | null>(null);
  const [overviewShowing, setOverviewShowing] = useState(true);

  const { data: dataTrailers } = useQuery<IGetTrailersResult>(
    ["video", bannerData.results[randomIndex].id],
    () =>
      matchedType === MatchTypes.MOVIE
        ? getMovieTrailers(bannerData.results[randomIndex].id)
        : getTvShowTrailers(bannerData.results[randomIndex].id),
    {
      suspense: false,
    }
  );

  useEffect(() => {
    console.log("trailer:", trailer, "overview:", overviewShowing);
  }, [trailer, overviewShowing]);

  useEffect(() => {
    if (!bannerData.results.length) return;
    setRandomIndex(Math.floor(Math.random() * bannerData.results.length));
  }, [bannerData]);

  useEffect(() => {
    if (!dataTrailers || !dataTrailers.results.length) return;

    const matched = dataTrailers.results.find(
      (result) =>
        result.site.match(/you\s*tube\s*/gi) && result.type.match(/trailer/gi)
    );
    setTrailer(matched || null);
  }, [dataTrailers]);

  return (
    <Wrapper>
      <Cover
        $bgImg={makeImagePath(
          bannerData.results[randomIndex].backdrop_path ||
            bannerData.results[randomIndex].poster_path
        )}
      />

      <AnimatePresence>
        {trailer && (
          <Trailer
            trailer={trailer}
            setTrailer={setTrailer}
            setOverviewShowing={setOverviewShowing}
          />
        )}
      </AnimatePresence>
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
              scale: overviewShowing ? 1 : 0.8,
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
