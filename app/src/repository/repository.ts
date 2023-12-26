import { AnimeApiRequest } from "../model/animeAPI/animeApiRequest";

export interface ApiRepo {
  /**anime API will get an Id from request and calls an external open API to get the appropriate response */
  animeApi(req: AnimeApiRequest): Promise<any>;
}

export interface DatabaseRepo {
  /**mongoDb will insert/update the request*/
  mongoDb(
    processedRequest: Record<string, any>,
    customerRequest: Record<any, any>
  ): Promise<any>;
}
