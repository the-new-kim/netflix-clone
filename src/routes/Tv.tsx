import { AnimatePresence } from "framer-motion";
import { useQuery } from "react-query";
import { useMatch } from "react-router-dom";
import {
  getTvDetails,
  getTvShows,
  IGetMediaDetails,
  IGetMediaResult,
  MatchTypes,
} from "../api";
import Banner from "../components/Banner";
import Detail from "../components/Detail";
import Slider from "../components/Slider";

export enum TvCategories {
  ON_THE_AIR = "on_the_air",
  TOP_RATED = "top_rated",
  POPULAR = "popular",
  AIRING_TODAY = "airing_today",
}

function Tv() {
  const tvMatched = useMatch("/tv/:category/:mediaId");

  const { data: dataOnTheAir } = useQuery<IGetMediaResult>(
    [TvCategories.ON_THE_AIR, "tv"],
    () => getTvShows(TvCategories.ON_THE_AIR),
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );

  const { data: dataTopRated } = useQuery<IGetMediaResult>(
    [TvCategories.TOP_RATED, "tv"],
    () => getTvShows(TvCategories.TOP_RATED),
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );

  const { data: dataPopular } = useQuery<IGetMediaResult>(
    [TvCategories.POPULAR, "tv"],
    () => getTvShows(TvCategories.POPULAR),
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );

  const { data: dataAiringToday } = useQuery<IGetMediaResult>(
    [TvCategories.AIRING_TODAY, "tv"],
    () => getTvShows(TvCategories.AIRING_TODAY),
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );

  const { data: dataDetail } = useQuery<IGetMediaDetails>(
    ["detail", "tv", tvMatched?.params.mediaId],
    () => getTvDetails(tvMatched?.params.mediaId || ""),
    {
      suspense: false,
      enabled: !!tvMatched,
    }
  );

  return (
    <>
      {!dataOnTheAir ||
      !dataTopRated ||
      !dataPopular ||
      !dataAiringToday ? null : (
        <>
          <Banner bannerData={dataOnTheAir} matchedType={MatchTypes.TV} />
          {[
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
            {
              categoryId: TvCategories.AIRING_TODAY,
              title: "Airing Today",
              data: dataAiringToday,
            },
          ].map((category, index) => (
            <Slider
              key={`tvSlider${index}`}
              data={category.data.results}
              title={category.title}
              categoryId={category.categoryId}
            />
          ))}
        </>
      )}
      <AnimatePresence>
        {dataDetail && <Detail dataDetail={dataDetail} matched={tvMatched} />}
      </AnimatePresence>
    </>
  );
}

export default Tv;
