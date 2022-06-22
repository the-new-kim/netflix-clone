import { useQuery } from "react-query";
import { getTvShows, IGetMediaResult, MediaType } from "../api";
import MainScreen from "../components/MainScreen";

export enum TvCategories {
  ON_THE_AIR = "on_the_air",
  TOP_RATED = "top_rated",
  POPULAR = "popular",
}

function Tv() {
  const { isLoading: loadingNowPlaying, data: dataOnTheAir } =
    useQuery<IGetMediaResult>(
      [TvCategories.ON_THE_AIR, "tv"],
      () => getTvShows(TvCategories.ON_THE_AIR),
      {
        refetchOnMount: false,
        refetchOnWindowFocus: false,
      }
    );

  const { isLoading: loadingTopRated, data: dataTopRated } =
    useQuery<IGetMediaResult>(
      [TvCategories.TOP_RATED, "tv"],
      () => getTvShows(TvCategories.TOP_RATED),
      {
        refetchOnMount: false,
        refetchOnWindowFocus: false,
      }
    );

  const { isLoading: loadingPopular, data: dataPopular } =
    useQuery<IGetMediaResult>(
      [TvCategories.POPULAR, "tv"],
      () => getTvShows(TvCategories.POPULAR),
      {
        refetchOnMount: false,
        refetchOnWindowFocus: false,
      }
    );

  return (
    <>
      {!dataOnTheAir || !dataTopRated || !dataPopular ? null : (
        <MainScreen
          mediaType={MediaType.TV}
          categories={[
            {
              categoryId: TvCategories.ON_THE_AIR,
              title: "On The Air",
              data: dataOnTheAir,
            },
            {
              categoryId: TvCategories.TOP_RATED,
              title: "Top Rated",
              data: dataTopRated,
            },
            {
              categoryId: TvCategories.POPULAR,
              title: "Popular",
              data: dataPopular,
            },
          ]}
        />
      )}
    </>
  );
}

export default Tv;
