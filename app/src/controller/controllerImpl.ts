import { ApiImpl, DatabaseImpl } from "../repository/repositoryImpl";
import { ServiceImpl } from "../service/serviceImpl";
import { Service } from "../service/service";
import { Controller } from "./controller";
import { AnimeApiRequest, PostAnimeRequest } from "../model/animeAPI/animeApiRequest";

class ControllerImpl implements Controller {
  #service: Service;
  constructor(service: Service) {
    this.#service = service;
  }

  public getAnimeController = async (req: AnimeApiRequest): Promise<any> => {
    try {
      console.log("Inside get anime controller");
      const response = await this.#service.getAnimeService(req);
      return { status: 200, statusMessage: response };
    } catch (e) {
      console.log("Catch method of get anime controller layer", e);
      throw { status: 500, statusMessage: e };
    }
  };

  public postAnimeController = async (req: PostAnimeRequest): Promise<any> => {
    try {
      console.log("Inside post anime controller");
      const response = await this.#service.postAnimeService(req);
      return { status: 200, statusMessage: response };
    } catch (e) {
      console.log("Catch method of post anime controller layer", e);
      throw { status: 500, statusMessage: e };
    }
  };
}

const apiImpl = new ApiImpl();
const databaseImpl = new DatabaseImpl();
const serviceLayer = new ServiceImpl(apiImpl, databaseImpl);
const controllerLayer = new ControllerImpl(serviceLayer);

export const getAnimeController = controllerLayer.getAnimeController;
export const postAnimeController = controllerLayer.postAnimeController;
// export const animeController = controllerLayer.mongodbController;
