import {
  AnimeApiRequest,
  PostAnimeRequest,
} from "../model/animeAPI/animeApiRequest";

export interface Controller {
  /**Handles get requests for anime */
  getAnimeController(req: AnimeApiRequest): Promise<Record<any, any>>;

  /**Handles post requests for anime */
  postAnimeController(req: PostAnimeRequest): Promise<any>;
}
