import { AnimeApiRequest, PostAnimeRequest } from "../model/animeAPI/animeApiRequest";
import { AnimeApiResponse, postAnimeResponse } from "../model/animeAPI/animeApiResponse";

export interface Service {

  /**Gets anime details with the given anime Id*/
  getAnimeService(req: AnimeApiRequest): Promise<AnimeApiResponse>;

  /**Posts anime details into mongoDb */
  postAnimeService(req: PostAnimeRequest): Promise<postAnimeResponse>;
}
