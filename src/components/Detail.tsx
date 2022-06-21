import { AnimatePresence, motion } from "framer-motion";

import { useQuery } from "react-query";
import { Params, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { getMediaDetails, IGetMediaDetals, MatchTypes } from "../api";

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

// const Cover = styled(motion.div)<{ $bgImg: string }>`
//   background-image: url(${(props) => props.$bgImg});
//   background-size: cover;
//   background-position: center center;
//   width: 100%;
//   aspect-ratio: 1.6/1;
// `;

interface IDetailProps {
  matchedType: MatchTypes | null;
  matchedParams: Params<"category" | "mediaId"> | null;
}

function Detail({ matchedType, matchedParams }: IDetailProps) {
  const navigate = useNavigate();

  console.log(!!matchedType, !!matchedParams);

  const { data } = useQuery<IGetMediaDetals>(
    ["detail", matchedType, matchedParams?.mediaId],
    () => getMediaDetails(matchedParams?.mediaId!, matchedType!),
    {
      keepPreviousData: true,
      enabled: !!matchedType || !!matchedParams,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );

  console.log(data);

  const notMatched =
    !matchedType ||
    !matchedParams ||
    !matchedParams.category ||
    !matchedParams.mediaId;

  return (
    <>
      <AnimatePresence>
        {notMatched ? null : (
          <>
            <Wrapper
              layoutId={`${matchedParams.category + matchedParams.mediaId}`}
            >
              hi
            </Wrapper>
            <Overlay
              onClick={() => {
                navigate(`/${matchedType}`);
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
