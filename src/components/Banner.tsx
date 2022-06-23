import { useEffect, useState } from "react";
import styled from "styled-components";
import { IGetMediaResult } from "../api";
import { makeImagePath } from "../utils";

const Wrapper = styled.div<{ $bgImg: string }>`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-start;
  background-image: linear-gradient(${(props) => props.theme.bgGradient}),
    url(${(props) => props.$bgImg});
  background-size: cover;
  background-position: center center;
  padding: 0 4% 18vw;
`;

const Title = styled.h1`
  font-size: 6vw;
  margin-bottom: 30px;
  font-weight: 700;
  width: 70%;
  text-shadow: ${(props) => props.theme.titleShadow};
`;
const Overview = styled.p`
  width: 60%;
  font-size: 2vw;
  text-shadow: 0px 0px 30px rgba(0, 0, 0, 0.6);
`;

interface IBannerProps {
  data: IGetMediaResult;
}

function Banner({ data }: IBannerProps) {
  const [randomIndex, setRandomIndex] = useState(0);

  useEffect(() => {
    if (!data.results.length) return;
    setRandomIndex(Math.floor(Math.random() * data.results.length));
  }, [data]);

  return (
    <Wrapper
      $bgImg={makeImagePath(
        data.results[randomIndex].backdrop_path ||
          data.results[randomIndex].poster_path
      )}
    >
      <Title>
        {data.results[randomIndex].title
          ? data.results[randomIndex].title
          : data.results[randomIndex].name}
      </Title>
      <Overview>{data.results[randomIndex].overview}</Overview>
    </Wrapper>
  );
}

export default Banner;
