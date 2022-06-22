import { useState } from "react";
import styled from "styled-components";
import { IGetMediaResult, MatchTypes } from "../api";
import { MovieCategories } from "../routes/Movie";
import { TvCategories } from "../routes/Tv";
import { makeImagePath } from "../utils";
import Detail from "./Detail";
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

interface IMainScreenProps {
  categories: {
    categoryId: MovieCategories | TvCategories;
    title: string;
    data: IGetMediaResult;
  }[];
}

function MainScreen({ categories }: IMainScreenProps) {
  const [randomIndex, setRandomIndex] = useState(0);

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

      <Detail />
    </>
  );
}

export default MainScreen;
