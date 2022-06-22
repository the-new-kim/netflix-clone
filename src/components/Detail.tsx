import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

import { useQuery } from "react-query";
import { useMatch, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { getMovieDetails, getTvDetails, MatchTypes } from "../api";

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

const Title = styled(motion.h3)`
  background-color: #3b3b3b;
  padding: 5px;
`;

const Genres = styled.div``;

const Description = styled.div``;
const SimilarContents = styled.div``;

function Detail() {
  const navigate = useNavigate();
  const movieMatched = useMatch("/movie/:category/:mediaId");
  // const tvMatched = useMatch("/tv/:category/:mediaId");
  // const [matchedType, setMatchedType] = useState<MatchTypes | null>(null);

  // useEffect(() => {
  //   setMatchedType(
  //     movieMatched ? MatchTypes.MOVIE : tvMatched ? MatchTypes.TV : null
  //   );
  // }, [movieMatched, tvMatched]);

  // const { data } = useQuery(
  //   ["detail", "movie", movieMatched?.params.mediaId],
  //   () => getMovieDetails(movieMatched?.params.mediaId || ""),
  //   {
  //     enabled: !!movieMatched,
  //   }
  // );

  // const isLoading = !movieMatched || !tvMatched || !data;

  return (
    <>
      {movieMatched && (
        <>
          <AnimatePresence>
            <Wrapper
              layoutId={`${
                movieMatched.params.category! + movieMatched.params.mediaId
              }`}
              initial={false}
            >
              <Cover>cover</Cover>
              <Title>title</Title>
              <Genres>genres</Genres>
              <Description>description</Description>
              <SimilarContents>similar</SimilarContents>
            </Wrapper>
          </AnimatePresence>
          <Overlay onClick={() => navigate("/movie")}></Overlay>
        </>
      )}
    </>
  );
}

export default Detail;
