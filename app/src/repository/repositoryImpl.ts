import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { DatabaseRepo, ApiRepo } from "./repository";
import { cacheConnType, cache } from "./cache";
import { AnimeApiRequest, PostAnimeRequest } from "../model/animeAPI/animeApiRequest";
import { MongoClient, Collection, UpdateResult, Document } from "mongodb";

let mongoConn: MongoClient;
let collectionInstance: Collection;

export class ApiImpl implements ApiRepo {

  /**
   * @param animeId
   * @returns An Xml String value from API/Cache
   */

  public async animeApi(req: AnimeApiRequest): Promise<string> {
    try {
      console.log("Inside anime repository");

      /**can be connected and disconnected everytime*/
      const cacheConn: cacheConnType =
        await cacheImplementation.cacheConnection();

      const cachedAnime = await cacheImplementation.get(cacheConn, {
        type: "string",
        key: req.animeId,
      });

      if (cachedAnime) {
        console.log(`Data available in cache for anime id - ${req.animeId}`);
        return cachedAnime;
      }

      console.log(`Data unavailable in cache for anime id - ${req.animeId}`);
      const config: AxiosRequestConfig = {
        url: `http://api.anidb.net:9001/httpapi?request=anime&client=${process.env.CLIENT_NAME}&clientver=${process.env.CLIENT_VERSION}&protover=${process.env.PROTOTYPE_NUMBER}&aid=${req.animeId}`,
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
            key: req.animeId,
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

    } catch (e) {
      console.log("Error in repository implementation", e);
      throw e;
    }
  }

}

export class DatabaseImpl implements DatabaseRepo {

  /**update/Insert into mongodb*/
  public async mongoDb(processedRequest: PostAnimeRequest): Promise<UpdateResult<Document>> {
    try {
      console.log("Inside mongoDb with request - ", processedRequest);
      await this.mongoDbConnection();
      const upsert: UpdateResult<Document> = await this.upsert(
        processedRequest
      );
      return upsert;
    } catch (e) {
      console.log("Error in database implementation", e);
      throw e;
    } finally {
      if (mongoConn) await mongoConn.close();
    }
  }

  /**Make connection with mongoDb
   * Make connection via mobile network if it fails through home/local wifi's
   */
  private async mongoDbConnection(): Promise<void> {
    try {
      console.log("making connection");
      mongoConn = new MongoClient(process.env.MONGO_URL!);
      await mongoConn.connect();
      collectionInstance = mongoConn
        .db(process.env.DB_NAME!)
        .collection(process.env.TABLE_NAME!);

      console.log(
        "Pinged your deployment. You successfully connected to MongoDB!"
      );
    } catch (e) {
      console.log("Error in making connection", e);
      throw e;
    }
  }

  private async upsert(request: PostAnimeRequest): Promise<UpdateResult<Document>> {
    try {
      console.log("Upsertion operation");
      const response = await collectionInstance.updateOne(
        { customerId: request.customerId },
        {
          $push: { animeDetails: request.animeDetails },
          $setOnInsert: { customerDetails: request.customerDetails },
        },
        { upsert: true }
      );
      console.log("Insertion operation response", response);
      return response;
    } catch (e) {
      console.log("Error in mongoDb insertion", e);
      throw e;
    }
  }
}

const cacheImplementation = new cache();
