import { ApiImpl, DatabaseImpl } from "../repository/repositoryImpl";
import { ServiceImpl } from "../service/serviceImpl";
import { Service } from "../service/service";
import { Controller } from "./controller";
import { AnimeApiRequest, PostAnimeRequest } from "../model/animeAPI/animeApiRequest";
import Ajv from "ajv"
import addFormats from "ajv-formats"
import ajvErrors from "ajv-errors"
import { schema } from "../validator/validator";

class ControllerImpl implements Controller {
  #service: Service;
  constructor(service: Service) {
    this.#service = service;
  }

  public getAnimeController = async (req: AnimeApiRequest): Promise<any> => {
    try {
      console.log("Inside get anime controller");

      const errorMessage: Array<Record<string, string>> = []

      if (!req.animeId || !req.customerId)
        errorMessage.push({ status: "400", statusMessage: "animeId and customerId are mandatory" })
      if (req.animeId && typeof req.animeId != 'string' || req.customerId && typeof req.customerId != 'string')
        errorMessage.push({ status: "400", statusMessage: "animeId and customerId must be present with string values" })

      if (errorMessage.length > 0)
        return { status: 400, statusMessage: errorMessage };

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

      /**Adding request validations */
      const ajv = new Ajv({ strict: false, allErrors: true })
      addFormats(ajv)
      ajvErrors(ajv)

      const validate = ajv.validate(schema, req)

      if (!validate) {
        console.log("Errors in request - ", ajv.errors)
        const ErrorMessage = Array.isArray(ajv.errors)
          ? ajv.errors.map((err) => (err.instancePath + " " + err.message))
          : ajv.errors
        return { status: 400, statusMessage: ErrorMessage };
      }

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
