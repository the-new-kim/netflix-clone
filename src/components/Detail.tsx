import { AnimatePresence, motion } from "framer-motion";
import { useMatch, useNavigate } from "react-router-dom";
import styled from "styled-components";

const Oberlay = styled(motion.div)`
  position: fixed;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  top: 0;
  left: 0;
  z-index: 100;
  opacity: 0;
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
  background-color: rgba(30, 30, 30, 1);
  z-index: 101;

  overflow-y: hidden;
`;

function Detail() {
  const mediaMatch = useMatch("movie/:category/:mediaId");
  const navigate = useNavigate();

  console.log(mediaMatch);

  return (
    <>
      <AnimatePresence>
        {mediaMatch && (
          <Oberlay
            layoutId={`${mediaMatch.params.category}${mediaMatch.params.mediaId}`}
            onClick={() => navigate(-1)}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>
    </>
  );
}

export default Detail;
