import { UpdateResult, Document } from "mongodb";
import {
  AnimeApiRequest,
  PostAnimeRequest,
} from "../model/animeAPI/animeApiRequest";

export interface ApiRepo {
  /**anime API will get an Id from request and calls an external open API to get the appropriate response */
  animeApi(req: AnimeApiRequest): Promise<string>;
}

export interface DatabaseRepo {
  /**mongoDb will insert/update the request*/
  mongoDb(processedRequest: PostAnimeRequest): Promise<UpdateResult<Document>>;
}
