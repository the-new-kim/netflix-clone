import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import { useQuery } from "react-query";
import { useMatch } from "react-router-dom";
import styled from "styled-components";
import {
  getMovieTrailers,
  getTvShowTrailers,
  IGetTrailersResult,
  ITrailer,
  MediaTypes,
} from "../api";
import { makeTrailerPath } from "../utils";

const Wrapper = styled(motion.div)`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MuteBtnWrapper = styled.div<{ $fromBanner: boolean | undefined }>`
  position: absolute;
  width: ${(props) => (props.$fromBanner ? "100vw" : "100%")};
  height: ${(props) => (props.$fromBanner ? "80vh" : "100%")};
`;

const MuteBtn = styled.button<{ $fromBanner: boolean | undefined }>`
  position: absolute;
  right: 5%;
  bottom: ${(props) => (props.$fromBanner ? "25%" : "3vw")};
  cursor: pointer;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;

  background-color: transparent;
  border-radius: 50%;
  border: solid white 2px;
  z-index: 1;
  svg {
    fill: white;
    width: 80%;
  }
`;

interface ITrailerProps {
  mediaId: number | string;
  mediaType: MediaTypes;
  fromBanner?: boolean;
  fromDetail?: boolean;
  setOverviewShowing?: React.Dispatch<React.SetStateAction<boolean>>;
}

function Trailer({
  mediaId,
  mediaType,
  fromBanner = false,
  fromDetail = false,
  setOverviewShowing,
}: ITrailerProps) {
  const [trailer, setTrailer] = useState<ITrailer | null>(null);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(true);
  const playerRef = useRef<ReactPlayer>(null);

  const movieMatch = useMatch("/movie/:category/:mediaId");
  const tvMatch = useMatch("/tv/:category/:mediaId");

  const { data: dataTrailers } = useQuery<IGetTrailersResult>(
    ["trailer", mediaId],
    () =>
      mediaType === MediaTypes.MOVIE
        ? getMovieTrailers(mediaId)
        : getTvShowTrailers(mediaId),
    {
      suspense: false,
    }
  );

  useEffect(() => {
    if (!fromBanner) return;
    movieMatch || tvMatch ? setPlaying(false) : setPlaying(true);
  }, [movieMatch, tvMatch, fromBanner]);

  useEffect(() => {
    if (!dataTrailers || !dataTrailers.results.length) return;

    const matched = dataTrailers.results.find(
      (result) =>
        result.site.match(/you\s*tube\s*/gi) && result.type.match(/trailer/gi)
    );
    setTrailer(matched || null);
  }, [dataTrailers]);

  //Check video duration
  // useEffect(() => {
  //   console.log("jo");
  //   if (!playerRef.current) return;

  //   console.log(playerRef.current.getDuration());
  // }, [playerRef.current]);

  return (
    <AnimatePresence>
      {trailer && (
        <Wrapper
          // onClick={() => {
          //   if (!playerRef.current) return;
          //   playerRef.current.seekTo(playerRef.current.getDuration() - 10);
          //   console.log(playerRef.current?.getCurrentTime());
          //   setPlaying((prev) => !prev);
          // }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 2 } }}
          exit={{ opacity: 0 }}
        >
          <ReactPlayer
            ref={playerRef}
            url={makeTrailerPath(trailer.key)}
            config={{
              youtube: {
                playerVars: {
                  disablekb: 1,
                  fs: 0,
                  modestbranding: 1,
                  start: 10,
                  end: 55,
                },
              },
            }}
            style={{
              overflow: "hidden",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minWidth: fromBanner ? "190vw" : "200%",
              minHeight: fromBanner ? "190vw" : "200%",
            }}
            width={fromBanner ? "190vw" : "200%"}
            height={fromBanner ? "190vw" : "200%"}
            controls={false}
            playing={playing}
            muted={muted}
            onReady={() => {}}
            onStart={() => {
              console.log("start");
              if (typeof setOverviewShowing === "undefined") return;
              setTimeout(() => {
                setOverviewShowing(false);
              }, 2000);
            }}
            onEnded={() => {
              console.log("end from Trailer component");
              setTrailer(null);
              if (typeof setOverviewShowing === "undefined") return;
              setOverviewShowing(true);
            }}
          />
          <MuteBtnWrapper $fromBanner={fromBanner}>
            {fromBanner || fromDetail ? (
              <MuteBtn
                $fromBanner={fromBanner}
                onClick={() => {
                  setMuted((prev) => !prev);
                }}
              >
                {muted ? (
                  <svg
                    version="1.1"
                    id="Capa_1"
                    xmlns="http://www.w3.org/2000/svg"
                    x="0px"
                    y="0px"
                    viewBox="0 0 54 54"
                  >
                    <g>
                      <path
                        d="M46.414,26l7.293-7.293c0.391-0.391,0.391-1.023,0-1.414s-1.023-0.391-1.414,0L45,24.586l-7.293-7.293
		c-0.391-0.391-1.023-0.391-1.414,0s-0.391,1.023,0,1.414L43.586,26l-7.293,7.293c-0.391,0.391-0.391,1.023,0,1.414
		C36.488,34.902,36.744,35,37,35s0.512-0.098,0.707-0.293L45,27.414l7.293,7.293C52.488,34.902,52.744,35,53,35
		s0.512-0.098,0.707-0.293c0.391-0.391,0.391-1.023,0-1.414L46.414,26z"
                      />
                      <path
                        d="M28.404,4.4c-0.975-0.552-2.131-0.534-3.09,0.044c-0.046,0.027-0.09,0.059-0.13,0.093L11.634,16H1c-0.553,0-1,0.447-1,1v19
		c0,0.266,0.105,0.52,0.293,0.707S0.734,37,1,37l10.61-0.005l13.543,12.44c0.05,0.046,0.104,0.086,0.161,0.12
		c0.492,0.297,1.037,0.446,1.582,0.446c0.517-0.001,1.033-0.134,1.508-0.402C29.403,49.035,30,48.005,30,46.844V7.156
		C30,5.995,29.403,4.965,28.404,4.4z M28,46.844c0,0.431-0.217,0.81-0.579,1.015c-0.155,0.087-0.548,0.255-1,0.026L13,35.556V31
		c0-0.553-0.447-1-1-1s-1,0.447-1,1v3.996L2,35V18h9v4c0,0.553,0.447,1,1,1s1-0.447,1-1v-4.536l13.405-11.34
		c0.46-0.242,0.86-0.07,1.016,0.018C27.783,6.347,28,6.725,28,7.156V46.844z"
                      />
                    </g>
                  </svg>
                ) : (
                  <svg
                    version="1.1"
                    id="Capa_1"
                    xmlns="http://www.w3.org/2000/svg"
                    x="0px"
                    y="0px"
                    viewBox="0 0 52.026 52.026"
                  >
                    <g>
                      <path
                        d="M28.404,3.413c-0.976-0.552-2.131-0.534-3.09,0.044c-0.046,0.027-0.09,0.059-0.13,0.093L11.634,15.013H1
		c-0.553,0-1,0.447-1,1v19c0,0.266,0.105,0.52,0.293,0.707S0.734,36.013,1,36.013l10.61-0.005l13.543,12.44
		c0.05,0.046,0.104,0.086,0.161,0.12c0.492,0.297,1.037,0.446,1.582,0.446c0.517-0.001,1.033-0.134,1.508-0.402
		C29.403,48.048,30,47.018,30,45.857V6.169C30,5.008,29.403,3.978,28.404,3.413z M28,45.857c0,0.431-0.217,0.81-0.579,1.015
		c-0.155,0.087-0.548,0.255-1,0.026L13,34.569v-4.556c0-0.553-0.447-1-1-1s-1,0.447-1,1v3.996l-9,0.004v-17h9v4c0,0.553,0.447,1,1,1
		s1-0.447,1-1v-4.536l13.405-11.34c0.461-0.242,0.86-0.07,1.016,0.018C27.783,5.36,28,5.739,28,6.169V45.857z"
                      />
                      <path
                        d="M38.797,7.066c-0.523-0.177-1.091,0.103-1.269,0.626c-0.177,0.522,0.103,1.091,0.626,1.269
		c7.101,2.411,11.872,9.063,11.872,16.553c0,7.483-4.762,14.136-11.849,16.554c-0.522,0.178-0.802,0.746-0.623,1.27
		c0.142,0.415,0.53,0.677,0.946,0.677c0.107,0,0.216-0.017,0.323-0.054c7.896-2.693,13.202-10.106,13.202-18.446
		C52.026,17.166,46.71,9.753,38.797,7.066z"
                      />
                      <path
                        d="M43.026,25.513c0-5.972-4.009-11.302-9.749-12.962c-0.533-0.151-1.084,0.152-1.238,0.684
		c-0.153,0.53,0.152,1.085,0.684,1.238c4.889,1.413,8.304,5.953,8.304,11.04s-3.415,9.627-8.304,11.04
		c-0.531,0.153-0.837,0.708-0.684,1.238c0.127,0.438,0.526,0.723,0.961,0.723c0.092,0,0.185-0.013,0.277-0.039
		C39.018,36.815,43.026,31.485,43.026,25.513z"
                      />
                    </g>
                  </svg>
                )}
              </MuteBtn>
            ) : null}
          </MuteBtnWrapper>
        </Wrapper>
      )}
    </AnimatePresence>
  );
}

export default Trailer;
