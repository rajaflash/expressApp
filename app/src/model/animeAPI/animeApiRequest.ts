import { AnimeApiResponse } from "./animeApiResponse";

export interface AnimeApiRequest {
  readonly animeId: string;
  readonly customerId: string;
}

interface PostAnimeRequests {
  readonly animeDetails: AnimeApiResponse;
  readonly customerDetails?: customerDetails;
}

interface customerDetails {
  readonly firstName: string;
  readonly lastName: string;
  readonly mobileNumber: string;
  readonly animeGenrePreference?: Array<string> | null;
}

export type PostAnimeRequest = PostAnimeRequests & Omit<AnimeApiRequest, 'animeId'>