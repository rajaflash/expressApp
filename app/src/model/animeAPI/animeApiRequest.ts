import { AnimeApiResponse } from "./animeApiResponse";

export interface AnimeApiRequest {
  readonly animeId: string;
  readonly customerId: string;
}

export interface PostAnimeRequest extends AnimeApiRequest {
  readonly animeDetails: AnimeApiResponse;
  readonly customerDetails: Array<customerDetails>;
}

interface customerDetails {
  readonly firstName: string;
  readonly lastName: string;
  readonly mobileNumber: string;
  readonly animeGenrePreference: Array<string>;
}
