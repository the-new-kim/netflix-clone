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
`;

const Wrapper = styled(motion.div)`
  position: fixed;
  height: 100px;
  /* position: absolute; */
  top: 0;
  left: 0;
  right: 0;
  margin: auto;
  width: 50vw;
  max-width: 500px;
  /* height: auto; */
  background-color: ${(props) => props.theme.bgDarkGray};
  z-index: 101;
`;

// const Cover = styled(motion.div)<{ $bgImg: string }>`
//   background-image: url(${(props) => props.$bgImg});
//   background-size: cover;
//   background-position: center center;
//   width: 100%;
//   aspect-ratio: 1.6/1;
// `;

function Detail() {
  const navigate = useNavigate();
  const movieMatched = useMatch("/movie/:category/:mediaId");
  const tvMatched = useMatch("/tv/:category/:mediaId");
  const [matchedType, setMatchedType] = useState<MatchTypes | null>(null);

  useEffect(() => {
    setMatchedType(
      movieMatched ? MatchTypes.MOVIE : tvMatched ? MatchTypes.TV : null
    );
  }, [movieMatched, tvMatched]);

  const { data } = useQuery(
    ["detail", "movie", movieMatched?.params.mediaId],
    () => getMovieDetails(movieMatched?.params.mediaId || ""),
    {
      enabled: !!movieMatched,
    }
  );

  const isLoading = !movieMatched || !tvMatched || !data;

  return (
    <>
      <AnimatePresence>
        {isLoading ? null : (
          <Wrapper
            onClick={() => {
              navigate(`/${matchedType}`);
            }}
            layoutId={`${
              movieMatched
                ? movieMatched.params.category! + movieMatched.params.mediaId!
                : tvMatched
                ? tvMatched.params.category! + tvMatched.params.mediaId!
                : ""
            }`}
          >
            hi
          </Wrapper>
          // <Overlay
          //   onClick={() => {
          //     navigate(`/${matchedType}`);
          //   }}
          //   initial={{ opacity: 0 }}
          //   animate={{ opacity: 1 }}
          //   exit={{ opacity: 0 }}
          // />
        )}
      </AnimatePresence>
    </>
  );
}

export default Detail;
