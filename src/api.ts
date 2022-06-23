const API_KEY = "d6e929621d2bfdd3c585aedf3aa51b87";
const BASE_URL = "https://api.themoviedb.org/3/";

export enum MediaType {
  MOVIE = "movie",
  TV = "tv",
  PERSON = "person",
}

export interface IMedia {
  id: number;
  backdrop_path: string;
  poster_path: string;
  overview: string;
  title?: string;
  name?: string;
  media_type?: MediaType;
}

export interface IGetMediaResult {
  dates?: { maximum: string; minimum: string };
  page: number;
  results: IMedia[];
  total_pages: number;
  total_results: number;
}

export function getMovies(category: string) {
  return fetch(
    `${BASE_URL}movie/${category}?api_key=${API_KEY}&language=en-US&page=1`
  ).then((response) => response.json());
}

export function getTvShows(category: string) {
  return fetch(
    `${BASE_URL}tv/${category}?api_key=${API_KEY}&language=en-US&page=1`
  ).then((response) => response.json());
}

interface IGenres {
  id: number;
  name: string;
}

export interface IGetMediaDetails {
  backdrop_path: string;
  poster_path: string;
  genres: IGenres[];
  id: number;
  title?: string;
  name?: string;
  overview: string;
  runtime: number;
  release_date: string;
}

export enum MatchTypes {
  MOVIE = "movie",
  TV = "tv",
}

// export function getMediaDetails(id: string | number, type: MatchTypes) {
//   return fetch(
//     `${BASE_URL}${type}/${id}?api_key=${API_KEY}&language=en-US`
//   ).then((response) => response.json());
// }

export function getMovieDetails(id: string | number) {
  return fetch(`${BASE_URL}movie/${id}?api_key=${API_KEY}&language=en-US`).then(
    (response) => response.json()
  );
}

export function getTvDetails(id: string | number) {
  return fetch(`${BASE_URL}tv/${id}?api_key=${API_KEY}&language=en-US`).then(
    (response) => response.json()
  );
}

export function getSimilarMovies(id: string | number) {
  return fetch(
    `${BASE_URL}movie/${id}/similar?api_key=${API_KEY}&language=en-US`
  ).then((response) => response.json());
}

export interface ISearchMediaResult {
  results: IMedia[];
}

export function searchContents(keyword: string) {
  return fetch(
    `${BASE_URL}search/multi?api_key=${API_KEY}&language=en-US&query=${keyword}&page=1&include_adult=false`
  ).then((response) => response.json());
}

export interface ITrailer {
  key: string;
  site: string;
  type: string;
}

export interface IGetTrailersResult {
  id: number;
  results: ITrailer[];
}

export function getMovieTrailers(id: string | number) {
  return fetch(
    `${BASE_URL}movie/${id}/videos?api_key=${API_KEY}&language=en-US`
  ).then((response) => response.json());
}

export function getTvShowTrailers(id: string | number) {
  return fetch(
    `${BASE_URL}tv/${id}/videos?api_key=${API_KEY}&language=en-US`
  ).then((response) => response.json());
}
