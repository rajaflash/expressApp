import { AnimeApiRequest } from "../model/animeAPI/animeApiRequest";

export interface Controller {
  animeController(req:AnimeApiRequest): Promise<Record<any, any>>;
}
