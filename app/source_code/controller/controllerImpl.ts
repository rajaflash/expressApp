import { RepositoryImpl } from "../repository/repositoryImpl";
import { ServiceImpl } from "../service/serviceImpl";
import { Service } from "../service/service";
import { Controller } from "./controller";
import { AnimeApiRequest } from "../model/animeAPI/animeApiRequest";

class ControllerImpl implements Controller {
  #service: Service;
  constructor(service: Service) {
    this.#service = service;
  }

  public animeController = async (req: AnimeApiRequest): Promise<any> => {
    // public async ControllerApi(): Promise<Record<any, any>> {
    try {
      console.log("Inside anime controller");
      const response = await this.#service.animeService(req);
      // const response = await serviceLayer.animeService();
      // console.log("Response in controller layer", response);
      return { status: 200, statusMessage: response };
    } catch (e) {
      console.log("Catch method of controller layer", e);
      return { status: 400, statusMessage: e };
    }
  };
}

const repositoryLayer = new RepositoryImpl();
const serviceLayer = new ServiceImpl(repositoryLayer);
const controllerLayer = new ControllerImpl(serviceLayer);

export const controller = controllerLayer.animeController;
