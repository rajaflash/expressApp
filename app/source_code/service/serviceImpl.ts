import { Repository } from "../repository/repository";
import { xml2js } from "xml-js";
import { Service } from "./service";
import { AnimeApiResponse } from "../model/animeAPI/animeApiResponse";
import { AnimeApiRequest } from "../model/animeAPI/animeApiRequest";

export class ServiceImpl implements Service {
  #repo: Repository; //declaring private field
  constructor(repository: Repository) {
    this.#repo = repository;
  }

  /**
   * @param anime id
   * @returns the required anime by the user
   **/

  public async animeService(req:AnimeApiRequest): Promise<Record<any, any>> {
    try {
      console.log("Inside anime service");
      const response = await this.#repo.animeApi(req);
      // console.log("Response in service layer", response);

      const xml2jsResponse: any = xml2js(response, { compact: true });
      console.log("JSON response", JSON.stringify(xml2jsResponse));

      const animeResponse: AnimeApiResponse = {
        animeName:
          xml2jsResponse?.anime?.titles?.title?.find(
            (t: Record<string, any>) =>
              t?.["_attributes"]?.["xml:lang"] == "x-jat" &&
              t?.["_attributes"]?.type == "main"
          )?.["_text"] || "Title unavailable",
        episodeCount:
          xml2jsResponse?.anime?.episodecount?.["_text"] ||
          "episode information unavailable",
        startDate:
          xml2jsResponse?.anime?.startdate?.["_text"] ||
          "start date information unavailable",
        endDate:
          xml2jsResponse?.anime?.enddate?.["_text"] ||
          "end Date information unavailable",
        engTitle:
          xml2jsResponse?.anime?.titles?.title?.find(
            (t: Record<string, any>) =>
              t?.["_attributes"]?.["xml:lang"] == "en" &&
              t?.["_attributes"]?.type == "official"
          )?.["_text"] || "english title unavailable",
        similarAnime: //do it with object check for response
          xml2jsResponse?.anime?.similaranime?.anime?.map(
            (a: Record<string, any>) => ({
              animeName: a?.["_text"] || "Title unavailable",
              animeId: a?.["_attributes"]?.id || "anime Id unavailable",
              episodeCount:
                a?.["_attributes"]?.total ||
                "episode count is unavailable for this anime",
            })
          ) || "information unvailable",
        relatedAnime: (() => //do it for array with ternary and isArray check
          !xml2jsResponse?.anime?.relatedanime?.["_text"] &&
          !xml2jsResponse?.anime?.relatedanime?.["_attributes"]?.type
            ? "information unavailable"
            : {
                animeName: xml2jsResponse?.anime?.relatedanime?.["_text"],
                relation:
                  xml2jsResponse?.anime?.relatedanime?.["_attributes"]?.type,
              })(),
      };

      console.log("animeObject resp - ", animeResponse);

      

      return animeResponse;
    } catch (e) {
      console.log("Inside catch method");
      throw e;
    }
  }
}
