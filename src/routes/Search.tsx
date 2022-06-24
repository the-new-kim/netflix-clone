import { motion } from "framer-motion";
import { useLayoutEffect, useState } from "react";
import { useQuery } from "react-query";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import { ISearchMediaResult, MediaTypes, searchContents } from "../api";
import Content from "../components/Content";
import useViewportSize from "../hooks/useViewportSize";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 50px;
`;

const Text = styled.p`
  height: 20vw;
  max-height: 150px;
  margin-bottom: 20px;
  display: flex;
  justify-content: flex-start;
  align-items: flex-end;
`;

const Results = styled.div<{ $sliderOffset: number }>`
  position: relative;
  width: 100%;
  height: 100%;
  display: grid;
  gap: 10px;
  row-gap: 60px;
  grid-template-columns: ${(props) => `repeat(${props.$sliderOffset}, 1fr)`};
  transform-style: preserve-3d;
`;

const ContentWrapper = styled(motion.div)<{ $sliderOffset: number }>`
  position: relative;
  width: 100%;
  height: ${(props) =>
    props.$sliderOffset === 6
      ? 10.1
      : props.$sliderOffset === 4
      ? 15.3
      : props.$sliderOffset === 3
      ? 20.5
      : 31}vw;
`;

function Search() {
  const location = useLocation();
  const keyword = new URLSearchParams(location.search).get("keyword");

  const { data } = useQuery<ISearchMediaResult>(["search", keyword], () =>
    searchContents(keyword || "")
  );
  const { viewportWidth } = useViewportSize();

  const [sliderOffset, setSliderOffset] = useState(6);

  useLayoutEffect(() => {
    viewportWidth > 1000
      ? setSliderOffset(6)
      : viewportWidth > 800
      ? setSliderOffset(4)
      : viewportWidth > 500
      ? setSliderOffset(3)
      : setSliderOffset(2);
  }, [viewportWidth]);

  return (
    <Wrapper>
      <Text>Search results for "{keyword}"</Text>
      <Results $sliderOffset={sliderOffset}>
        {data?.results
          .filter((result) => result.media_type !== MediaTypes.PERSON)
          .map((result, index) => (
            <ContentWrapper
              $sliderOffset={sliderOffset}
              key={result.id}
              animate={{ z: 0 }}
              whileHover={{
                z: 100,
              }}
              transition={{ delay: 0.5 }}
            >
              <Content
                isLoading={!!data}
                data={result}
                category={""}
                id={result.id + ""}
                isFirstChild={index % sliderOffset === 0}
                isLastChild={(index + 1) % sliderOffset === 0}
                mediaType={result.media_type}
              />
            </ContentWrapper>
          ))}
      </Results>
    </Wrapper>
  );
}

export default Search;
