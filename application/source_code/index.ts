import express, { json } from "express";
import { animeController } from "./controller/controllerImpl";
import { config } from "dotenv";

//environment variable configuration
config({ path: "F:\\coding\\Typescript_express app\\expressApp\\app\\properties.env" });

const expressapp = express(),
  route = express.Router();

//express app configuration
expressapp.use(route);

// expressapp.use(json);
// expressapp.enable("strict routing"); //strict path check and routes

/**welcome page */
route.get("/", (req, res) => {
  console.log("Inside the base handler");
  res.send("Helo there").status(200);
});

/**getting data from anime API */
route.get("/anime/:id", async (req, res) => {
  console.log("Inside Anime url route", req.params);
  const response = await animeController(req.params);
  console.log("Response from anime API - ", response);
  res.send(response.statusMessage).status(response.status);
});

// /**posting data in to database */
// route.post("/mongoDb", async (req, res) => {
//   console.log("Inside mongoDb url route", req.params);
//   const response = await controller(req.body.params);
//   console.log("Response from posting data into mongoDb - ", response);
//   res.send(response.statusMessage).status(response.status);
// });

// route.post("/goCheck", async (req, res) => {
//   console.log("Inside go url route");
//   const response = await controller(req.body.params);
//   console.log("Response from go API - ", response);
//   res.send(response).status(200);
// });

expressapp.listen(process.env.PORT_NUMBER, () => {
  console.log(`Server running at ${process.env.PORT_NUMBER}`);
});
