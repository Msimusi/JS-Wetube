import express from "express";
import {
  postJoin,
  getJoin,
  postLogin,
  getLogin,
} from "../controllers/userController.js";
import { home, search } from "../controllers/videoController.js";
import { publicOnlyMiddleware } from "../middlewares.js";

const rootRouter = express.Router();

rootRouter.get("/", home);
rootRouter.route("/join").all(publicOnlyMiddleware).get(getJoin).post(postJoin);
rootRouter
  .route("/login")
  .all(publicOnlyMiddleware)
  .get(getLogin)
  .post(postLogin);
rootRouter.get("/search", search);

export default rootRouter;
