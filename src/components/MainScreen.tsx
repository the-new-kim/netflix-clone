import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useQuery } from "react-query";
import { useMatch, useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  getMovieDetails,
  IGetMediaDetails,
  IGetMediaResult,
  MediaType,
} from "../api";
import { MovieCategories } from "../routes/Movie";
import { TvCategories } from "../routes/Tv";
import { makeImagePath } from "../utils";
import Slider from "./Slider";

const Banner = styled.div<{ $bgImg: string }>`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  background-image: linear-gradient(rgba(0, 0, 0, 0.1), 80%, rgba(0, 0, 0, 1)),
    url(${(props) => props.$bgImg});
  background-size: cover;
  background-position: center center;
  padding: 4%;
`;
const Title = styled.h1`
  font-size: 60px;
  margin-bottom: 30px;
  font-weight: 700;
  width: 50%;
  text-shadow: 0px 8px 30px rgba(0, 0, 0, 0.3);
`;
const Overview = styled.p`
  width: 60%;
  font-size: 25px;
  text-shadow: 0px 0px 30px rgba(0, 0, 0, 0.6);
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 100;
`;

const Detail = styled(motion.div)`
  position: fixed;

  /* position: absolute; */
  top: 0;
  left: 0;
  right: 0;
  margin: auto;
  width: 50vw;
  max-width: 700px;

  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto;

  /* height: auto; */
  background-color: ${(props) => props.theme.bgDarkGray};
  z-index: 101;
`;

const Cover = styled(motion.div)<{ $bgImg?: string }>`
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

const DetailTitle = styled(motion.h3)`
  background-color: #3b3b3b;
  padding: 5px;
`;

const Genres = styled.div``;

const Description = styled.div``;
const SimilarContents = styled.div``;

interface IMainScreenProps {
  categories: {
    categoryId: MovieCategories | TvCategories;
    title: string;
    data: IGetMediaResult;
  }[];
  mediaType: MediaType;
}

function MainScreen({ categories, mediaType }: IMainScreenProps) {
  const navigate = useNavigate();
  const [randomIndex, setRandomIndex] = useState(0);

  const movieMatched = useMatch("/movie/:category/:mediaId");
  const tvMatched = useMatch("/tv/:category/:mediaId");

  const { data, isLoading } = useQuery<IGetMediaDetails>(
    ["detail", "movie", movieMatched?.params.mediaId],
    () => getMovieDetails(movieMatched?.params.mediaId || ""),
    {
      suspense: false,
      enabled: !!movieMatched,
    }
  );

  return (
    <>
      <Banner
        $bgImg={makeImagePath(
          categories[0]?.data.results[randomIndex].backdrop_path || ""
        )}
      >
        <Title>
          {categories[0].data.results[randomIndex].title
            ? categories[0].data.results[randomIndex].title
            : categories[0].data.results[randomIndex].name}
        </Title>
        <Overview>{categories[0].data.results[randomIndex].overview}</Overview>
      </Banner>
      {categories.map((category, index) => (
        <Slider
          key={`slider${index}`}
          data={category.data.results}
          title={category.title}
          categoryId={category.categoryId}
        />
      ))}
      <AnimatePresence>
        {movieMatched === null ||
        !movieMatched.params.category ||
        !movieMatched.params.mediaId ? null : (
          <>
            <Detail
              layoutId={`${
                movieMatched.params.category + movieMatched.params.mediaId
              }`}
              initial={false}
            >
              {data ? (
                <Cover $bgImg={makeImagePath(data.backdrop_path, "w500")}>
                  {data.backdrop_path}
                </Cover>
              ) : (
                <NoCover></NoCover>
              )}
              <DetailTitle>{data?.title}</DetailTitle>
              <Genres>genres</Genres>
              <Description>description</Description>
              <SimilarContents>similar</SimilarContents>
            </Detail>
            <Overlay onClick={() => navigate("/movie")}></Overlay>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default MainScreen;
