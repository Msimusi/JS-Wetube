import express from "express";
import { postJoin, getJoin, login } from "../controllers/userController.js";
import { home, search } from "../controllers/videoController.js";

const rootRouter = express.Router();

rootRouter.get("/", home);
rootRouter.route("/join").get(getJoin).post(postJoin);
rootRouter.route("/login").get(login);
rootRouter.get("/search", search);

export default rootRouter;
