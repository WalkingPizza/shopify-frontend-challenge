export class OMDBResponse {
  constructor (data: any) {
    this.status = data.Response === "True";
    this.error = this.status ? null : data.Error;
    this.movies = !this.status ? [] : data.Search ? data.Search.map((m: any) => new Movie(m)) : [new Movie(data)];
  }

  status: boolean;
  movies: Movie[];
  error?: string;
}

export class Movie {
  constructor (data: any) {
    this.title = data.Title;
    this.year = data.Year;
    this.poster = data.Poster;
    this.imdbID = data.imdbID;
    this.response = data.Response === "True" ? true : false;
  }

  title: string;
  year: string;
  poster: string;
  imdbID: string;
  response: boolean; 
}

export enum OMDBErrors {
  tooManyResults = "Too many results.",
  noResults = "Movie not found!"
}

export enum MovieListType {
  search,
  nominations
}

export enum ButtonType {
  primary,
  secondary,
  destructive
}