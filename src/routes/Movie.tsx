import { useQuery } from "react-query";
import { getMovies, IGetMediaResult } from "../api";
import MainScreen from "../components/MainScreen";

export enum MovieCategories {
  NOW_PLAYING = "now_playing",
  TOP_RATED = "top_rated",
  POPULAR = "popular",
}

function Movie() {
  const { isLoading: loadingNowPlaying, data: dataNowPlaying } =
    useQuery<IGetMediaResult>(
      [MovieCategories.NOW_PLAYING, "movie"],
      () => getMovies(MovieCategories.NOW_PLAYING),
      {
        refetchOnMount: false,
        refetchOnWindowFocus: false,
      }
    );

  const { isLoading: loadingTopRated, data: dataTopRated } =
    useQuery<IGetMediaResult>(
      [MovieCategories.TOP_RATED, "movie"],
      () => getMovies(MovieCategories.TOP_RATED),
      {
        refetchOnMount: false,
        refetchOnWindowFocus: false,
      }
    );

  const { isLoading: loadingPopular, data: dataPopular } =
    useQuery<IGetMediaResult>(
      [MovieCategories.POPULAR, "movie"],
      () => getMovies(MovieCategories.POPULAR),
      {
        refetchOnMount: false,
        refetchOnWindowFocus: false,
      }
    );

  return (
    <>
      {!dataNowPlaying || !dataTopRated || !dataPopular ? null : (
        <MainScreen
          categories={[
            {
              categoryId: MovieCategories.NOW_PLAYING,
              title: "Now Playing",
              data: dataNowPlaying,
            },
            {
              categoryId: MovieCategories.TOP_RATED,
              title: "Top Rated",
              data: dataTopRated,
            },
            {
              categoryId: MovieCategories.POPULAR,
              title: "Popular",
              data: dataPopular,
            },
          ]}
        />
      )}
    </>
  );
}

export default Movie;
