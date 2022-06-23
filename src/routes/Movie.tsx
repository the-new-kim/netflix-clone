import { AnimatePresence } from "framer-motion";
import { useQuery } from "react-query";
import { useMatch } from "react-router-dom";
import {
  getMovieDetails,
  getMovies,
  IGetMediaDetails,
  IGetMediaResult,
  MatchTypes,
} from "../api";
import Banner from "../components/Banner";
import Detail from "../components/Detail";
import Slider from "../components/Slider";

export enum MovieCategories {
  NOW_PLAYING = "now_playing",
  TOP_RATED = "top_rated",
  POPULAR = "popular",
  UPCOMING = "upcoming",
  LATEST = "latest",
}

function Movie() {
  const movieMatched = useMatch("/movie/:category/:mediaId");

  const { data: dataNowPlaying } = useQuery<IGetMediaResult>(
    [MovieCategories.NOW_PLAYING, "movie"],
    () => getMovies(MovieCategories.NOW_PLAYING),
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );

  const { data: dataTopRated } = useQuery<IGetMediaResult>(
    [MovieCategories.TOP_RATED, "movie"],
    () => getMovies(MovieCategories.TOP_RATED),
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );

  const { data: dataUpcoming } = useQuery<IGetMediaResult>(
    [MovieCategories.UPCOMING, "movie"],
    () => getMovies(MovieCategories.UPCOMING),
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );

  const { data: dataPopular } = useQuery<IGetMediaResult>(
    [MovieCategories.POPULAR, "movie"],
    () => getMovies(MovieCategories.POPULAR),
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );

  const { data: dataDetail } = useQuery<IGetMediaDetails>(
    ["detail", "movie", movieMatched?.params.mediaId],
    () => getMovieDetails(movieMatched?.params.mediaId || ""),
    {
      suspense: false,
      enabled: !!movieMatched,
    }
  );

  return (
    <>
      {!dataNowPlaying ||
      !dataTopRated ||
      !dataUpcoming ||
      !dataPopular ? null : (
        <>
          <Banner bannerData={dataNowPlaying} matchedType={MatchTypes.MOVIE} />
          {[
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
              categoryId: MovieCategories.UPCOMING,
              title: "Upcoming Movies",
              data: dataUpcoming,
            },
            {
              categoryId: MovieCategories.POPULAR,
              title: "Popular Movies",
              data: dataPopular,
            },
          ].map((category, index) => (
            <Slider
              key={`movieSlider${index}`}
              data={category.data.results}
              title={category.title}
              categoryId={category.categoryId}
            />
          ))}
        </>
      )}

      <AnimatePresence>
        {dataDetail && (
          <Detail dataDetail={dataDetail} matched={movieMatched} />
        )}
      </AnimatePresence>
    </>
  );
}

export default Movie;
