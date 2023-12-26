import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { DatabaseRepo, ApiRepo } from "./repository";
import { cacheConnType, cache } from "./cache";
import { AnimeApiRequest } from "../model/animeAPI/animeApiRequest";
import { MongoClient } from "mongodb";
import { urlToHttpOptions } from "url";

export class ApiImpl implements ApiRepo {
  public async animeApi(req: AnimeApiRequest): Promise<any> {
    try {
      console.log("Inside anime repository");

      /**can be connected and disconnected everytime*/
      const cacheConn: cacheConnType =
        await cacheImplementation.cacheConnection();

      const cachedAnime = await cacheImplementation.get(cacheConn, {
        type: "string",
        key: req.id,
      });

      if (cachedAnime) {
        console.log(`Data available in cache for anime id - ${req.id}`);
        return cachedAnime;
      } else {
        console.log(`Data unavailable in cache for anime id - ${req.id}`);
        const config: AxiosRequestConfig = {
          url: `http://api.anidb.net:9001/httpapi?request=anime&client=${process.env.CLIENT_NAME}&clientver=${process.env.CLIENT_VERSION}&protover=${process.env.PROTOTYPE_NUMBER}&aid=${req.id}`,
          method: "get",
        };

        console.log("configuration - ", config);

        return await axios(config)
          .then(async (resp: AxiosResponse) => {
            console.log(
              "type of response data from anime open API",
              typeof resp.data
            );
            const setCache = await cacheImplementation.set(cacheConn, {
              type: "string",
              key: req.id,
              value: resp.data,
              expiryTime: 60 * 60 * 12,
            });
            await cacheConn.disconnect();
            console.log("setCache details - ", setCache);
            return resp.data;
          })
          .catch((err: AxiosError) => {
            console.log("Axios Error in Repository", err);
            throw err;
          });
      }
    } catch (e) {
      console.log("Error in repository implementation", e);
      throw e;
    }
  }
}

export class DatabaseImpl implements DatabaseRepo {
  #mongoConn: any; //mongoDb connection

  /**Make connection with mongoDb
   * Make connection via mobile network if it fails through home/local wifi's
   */
  private async mongoDbConnection(): Promise<any> {
    try {
      console.log("making connection");
      const url = process.env.MONGO_URL!;
      const client = new MongoClient(url);
      await client.connect();
      client.db(process.env.DB_NAME);
      console.log(
        "Pinged your deployment. You successfully connected to MongoDB!"
      );
      return client;
    } catch (e) {
      console.log("Error in making connection", e);
      throw e;
    }
  }

  /**Query mongodb*/
  public async mongoDb(): Promise<any> {
    try {
      console.log("Inside mongoDb");
      this.#mongoConn = await this.mongoDbConnection();
    } catch (e) {
      console.log("Error in database implementation", e);
      // throw e;
    } finally {
      if (this.#mongoConn) await this.#mongoConn.close();
    }
  }
}

const cacheImplementation = new cache();
