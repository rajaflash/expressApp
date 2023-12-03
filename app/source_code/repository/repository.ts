import { AnimeApiRequest } from "../model/animeAPI/animeApiRequest";

export interface Repository {
  /**anime API will get an Id from request and calls an external open API to get the appropriate response */
  animeApi(req: AnimeApiRequest): Promise<any>;

  /**mongoDb will insert/update the request*/
  mongoDb(req: any): Promise<any>;
}
