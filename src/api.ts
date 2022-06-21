const API_KEY = "cf13f93b5d8390312d36ffb98bb38259";
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

export interface IGetMediaDetals {
  backdrop_path: string;
  poster_path: string;
  genres: IGenres[];
  id: number;
  title?: string;
  name?: string;
  overview: string;
  runtime: number;
}

export enum MatchTypes {
  MOVIE = "movie",
  TV = "tv",
}

export function getMediaDetails(id: string | number, type: MatchTypes) {
  return fetch(
    `${BASE_URL}${type}/${id}?api_key=${API_KEY}&language=en-US`
  ).then((response) => response.json());
}
