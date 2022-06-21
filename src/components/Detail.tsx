import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useMatch, useNavigate } from "react-router-dom";
import styled from "styled-components";

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
`;

const Wrapper = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  margin: auto;
  width: 50vw;
  max-width: 500px;
  height: auto;
  background-color: ${(props) => props.theme.bgDarkGray};
  z-index: 101;
`;

const Cover = styled(motion.div)<{ $bgImg: string }>`
  background-image: url(${(props) => props.$bgImg});
  background-size: cover;
  background-position: center center;
  width: 100%;
  aspect-ratio: 1.6/1;
`;

enum MatchTypes {
  MOVIE = "movie",
  TV = "tv",
}

interface IMathced {
  matchType: MatchTypes | null;
  category: string;
  mediaId: number | string;
}

function Detail() {
  const [matchedContent, setMatchedContent] = useState<IMathced | null>(null);

  const navigate = useNavigate();
  const movieMatched = useMatch("/movie/:category/:mediaId");
  const tvMatched = useMatch("/tv/:category/:mediaId");

  useEffect(() => {
    if (movieMatched)
      setMatchedContent(() => {
        const newObj: IMathced = {
          matchType: MatchTypes.MOVIE,
          category: movieMatched.params.category
            ? movieMatched.params.category
            : "",
          mediaId: movieMatched.params.mediaId
            ? movieMatched.params.mediaId
            : "",
        };

        return newObj;
      });

    if (tvMatched)
      setMatchedContent(() => {
        const newObj: IMathced = {
          matchType: MatchTypes.MOVIE,
          category: tvMatched.params.category ? tvMatched.params.category : "",
          mediaId: tvMatched.params.mediaId ? tvMatched.params.mediaId : "",
        };

        return newObj;
      });

    // if (tvMatched)
    //   setMatchedContent(`${tvMatched.params.category}${tvMatched.params.mediaId}`);
  }, [movieMatched, tvMatched]);

  //   const { data } = useQuery([
  //     "detail",
  //     `${
  //       movieMatched
  //         ? movieMatched.params.mediaId
  //         : tvMatched
  //         ? tvMatched.params.mediaId
  //         : "search"
  //     }`,
  //   ]);

  return (
    <>
      <AnimatePresence>
        {matchedContent !== null && (
          <>
            <Wrapper
              layoutId={`${matchedContent.category}${matchedContent.mediaId}`}
            >
              hi
            </Wrapper>
            <Overlay
              onClick={() => {
                setMatchedContent(null);
                !!movieMatched && navigate("/movie");
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default Detail;
