import { motion } from "framer-motion";
import { useState } from "react";
import { useQuery } from "react-query";
import { PathMatch, useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  getSimilarMovies,
  getSimilarTvShows,
  IGetMediaDetails,
  IGetMediaResult,
  MediaTypes,
} from "../api";
import { makeImagePath, toHoursAndMinutes } from "../utils";
import Content from "./Content";
import Trailer from "./Trailer";

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 100;
`;

const Wrapper = styled(motion.div)`
  position: fixed;
  border-radius: 10px;
  overflow-x: hidden;
  top: 100px;
  left: 0;
  right: 0;
  margin: auto;
  width: 70vw;
  height: 80vh;
  max-width: 950px;

  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto;

  /* height: auto; */
  background-color: ${(props) => props.theme.bgDarkGray};
  z-index: 101;
`;

const Cover = styled(motion.div)<{ $bgImg?: string }>`
  position: relative;
  background-image: url(${(props) => props.$bgImg});

  background-size: cover;
  background-position: center center;
  width: 100%;
  aspect-ratio: 1.6/1;
  display: flex;
  justify-content: center;
  align-items: center;
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
  aspect-ratio: 1.6/1;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const GradientBg = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(${(props) => props.theme.bgGradient});
`;

const CloseBtn = styled.button`
  cursor: pointer;
  position: absolute;
  width: 30px;
  height: 30px;
  top: 10px;
  right: 10px;
  background-color: ${(props) => props.theme.bgDarkGray};
  border: none;
  color: ${(props) => props.theme.color};
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.8);
  font-size: 17px;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2;
`;

const Title = styled(motion.h1)`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 75%;
  font-size: 5vw;
  font-weight: 700;
  z-index: 1;
  padding: 3vw;
  text-shadow: ${(props) => props.theme.titleShadow};
`;

const Details = styled.div`
  padding: 10px 50px;
`;

const Row = styled.div`
  margin-bottom: 40px;
  h2 {
    font-size: 25px;
    font-weight: 400;
  }
  > * {
    margin-bottom: 10px;
  }
`;

const Time = styled.div`
  > *:not(:last-child) {
    margin-right: 10px;
  }
`;

const Overview = styled.div``;
const Genres = styled.ul`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  > *:not(:last-child) {
    margin-right: 10px;
  }
  h1,
  h2,
  h3,
  h4,
  h5 {
    color: ${(props) => props.theme.textGray};
  }
  li {
    color: ${(props) => props.theme.color};
  }
`;

const SimilarContents = styled.div`
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(3, 1fr);
  transform-style: preserve-3d;
`;

const overlayVariants = {
  show: {
    opacity: 1,
  },
  hide: {
    opacity: 0,
  },
};

const ContentWrapper = styled(motion.div)`
  position: relative;
  width: 100%;
  height: fit-content;
`;

interface IDetailProps {
  dataDetail: IGetMediaDetails;
  matched: PathMatch<"category" | "mediaId"> | null;
  mediaType: MediaTypes;
}

function Detail({ dataDetail, matched, mediaType }: IDetailProps) {
  const [clickable, setClickable] = useState(true);
  const navigate = useNavigate();

  const goBack = () => {
    if (!clickable) return;
    setClickable(false);
    navigate(-1);
  };

  const { data: dataSimilar } = useQuery<IGetMediaResult>(
    ["similar", mediaType, matched?.params.mediaId],
    () =>
      mediaType === MediaTypes.MOVIE
        ? getSimilarMovies(matched?.params.mediaId || "")
        : getSimilarTvShows(matched?.params.mediaId || ""),
    {
      keepPreviousData: true,
      enabled: !!matched,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      suspense: false,
    }
  );

  return (
    <>
      {matched === null ||
      !matched.params.category ||
      !matched.params.mediaId ? null : (
        <>
          <Wrapper
            layoutId={`${matched.params.category + matched.params.mediaId}`}
            key={matched.params.mediaId}
            exit={{ opacity: 0 }}
          >
            {dataDetail.backdrop_path ? (
              <Cover
                layoutId={`${
                  matched.params.category + matched.params.mediaId
                }cover`}
                $bgImg={makeImagePath(dataDetail.backdrop_path)}
              >
                <TrailerWrapper>
                  <Trailer
                    mediaId={dataDetail.id}
                    mediaType={mediaType}
                    key={mediaType + dataDetail.id}
                    fromBanner={false}
                    fromDetail={true}
                  />
                </TrailerWrapper>
                <CloseBtn onClick={goBack}>&#10005;</CloseBtn>
                <Title>{dataDetail.title || dataDetail.name}</Title>
                <GradientBg />
              </Cover>
            ) : (
              <NoCover
                layoutId={`${
                  matched.params.category + matched.params.mediaId
                }noCover`}
              >
                <CloseBtn onClick={goBack}>&#10005;</CloseBtn>
                <Title>{dataDetail.title || dataDetail.name}</Title>
              </NoCover>
            )}
            <Details>
              <Row>
                <Time>
                  {dataDetail.release_date && (
                    <span>
                      {new Date(dataDetail.release_date).toLocaleString(
                        "en-US",
                        {
                          year: "numeric",
                        }
                      )}
                    </span>
                  )}
                  {dataDetail.runtime && (
                    <span>{toHoursAndMinutes(dataDetail.runtime)}</span>
                  )}
                </Time>
                {dataDetail.overview && (
                  <Overview>{dataDetail.overview}</Overview>
                )}

                {dataDetail.genres && !!dataDetail.genres.length && (
                  <Genres>
                    <h5>Genres:</h5>
                    {dataDetail.genres.map((genre, index) => (
                      <li key={genre.name}>
                        {genre.name}
                        {index !== dataDetail.genres.length - 1 ? "," : null}
                      </li>
                    ))}
                  </Genres>
                )}
              </Row>
              {!dataSimilar || !dataSimilar.results.length ? null : (
                <Row>
                  <h2>Similar Contents</h2>
                  <SimilarContents>
                    {dataSimilar.results.map((result, index) => (
                      <ContentWrapper
                        key={result.id}
                        animate={{ z: 0 }}
                        whileHover={{
                          z: 100,
                        }}
                        transition={{ delay: 0.5 }}
                      >
                        <Content
                          isLoading={!!dataDetail}
                          data={result}
                          category={""}
                          id={result.id + ""}
                          isFirstChild={index === 0 || index % 3 === 0}
                          isLastChild={index === 2 || (index - 2) % 3 === 0}
                          fromDetail={true}
                          mediaType={mediaType}
                        />
                      </ContentWrapper>
                    ))}
                  </SimilarContents>
                </Row>
              )}
            </Details>
          </Wrapper>
        </>
      )}
      <Overlay
        variants={overlayVariants}
        initial="hide"
        animate="show"
        exit="hide"
        transition={{ duration: 1 }}
        onClick={goBack}
      />
    </>
  );
}

export default Detail;
