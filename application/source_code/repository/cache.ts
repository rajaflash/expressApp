import { createClient, RedisClientType } from "redis";
export type cacheConnType = RedisClientType;

export class cache {
  public async cacheConnection(): Promise<any> {
    console.log("Inside cache Implementation");
    try {
      const client = await createClient({
        password: process.env.REDIS_PASSWORD,
        socket: {
          host: process.env.REDIS_HOST,
          port: parseInt(process.env.REDIS_PORT || "0"),
        },
      })
        .connect()
        .then((res) => {
          console.log("Connection successfull with Redis");
          return res;
        })
        .catch((error) => {
          console.log("Error while connecting to cache");
          throw error;
        });

      return client;
    } catch (e) {
      console.log("error while caching connection", e);
      throw { statusCode: "500", message: `Error in cache connection - ${e}` };
    }
  }

  public async get(
    connection: cacheConnType,
    req: Record<string, any>
  ): Promise<any> {
    console.log("Inside get cache");
    if (req.type == "string") {
      console.log("Inside get cache for anticipated string response");
      return await connection.get(req.key);
    } else if (req.type == "object") {
      console.log("Inside get method for anticipated object response");
      return await connection.hGetAll(req.key);
    }
  }

  public async set(
    connection: cacheConnType,
    req: Record<string, any>
  ): Promise<any> {
    if (req.type == "string") {
      console.log("Inside set cache");
      return await connection.set(req.key, req.value, { EX: req.expiryTime });
    } else if (req.type == "object") {
      console.log("Inside set - hSet for object");
      return await connection.hSet(
        req.key,
        req.value,
        req.expiryTimeFormat,
        req.expiryTime
      );
    }
  }
}
