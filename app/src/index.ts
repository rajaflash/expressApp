import express from "express";
import { getAnimeController, postAnimeController } from "./controller/controllerImpl";
import { config } from "dotenv";

//environment variable configuration
config({
  path: "F:\\coding\\Typescript_expressApp\\expressApp\\app\\properties.env",
});

const expressapp = express();
//this can be used for larger applications with more routes
// route = express.Router();

//express app configuration
// expressapp.use(route);

expressapp.use(express.json());
// expressapp.enable("strict routing"); //strict path check and routes

/**welcome page */
expressapp.get("/", (req, res) => {
  console.log("Inside the base handler");
  res.send("Hello there").status(200);
});

/**getting data from anime API */
expressapp.get("/anime", async (req, res) => {
  try {
    console.log("Inside Anime url route", req.query);
    /**to avoid a type error from an express built interface called parsedQs*/
    const request: any = {
      animeId: req.query["animeId"],
      customerId: req.query["customerId"],
    };
    const response = await getAnimeController(request);
    console.log("Response from anime API - ", response);
    res.status(response.status).send(response.statusMessage);
  } catch (e: any) {
    console.log("error from anime API - ", e);
    res.status(e.status).send(e.statusMessage);
  }
});

// /**posting data in to database */
expressapp.post("/postAnime", async (req, res) => {
  try {
    console.log("Inside postAnime url route", req.body);
    const response = await postAnimeController(req.body);
    console.log("Response from postAnime route- ", response);
    res.status(response.status).send({ "Error": response.statusMessage });
  } catch (e: any) {
    console.log("Error from postAnime route- ", e);
    res.status(e.status).send(e)
  }
});

// route.post("/goCheck", async (req, res) => {
//   console.log("Inside go url route");
//   const response = await controller(req.body.params);
//   console.log("Response from go API - ", response);
//   res.send(response).status(200);
// });

expressapp.listen(process.env.PORT_NUMBER, () => {
  console.log(`Server running at ${process.env.PORT_NUMBER}`);
});
