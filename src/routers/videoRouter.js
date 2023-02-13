import express from "express";
import { watch, edit, remove } from "../controllers/videoController";

const videoRouter = express.Router();

videoRouter.get("/watch", watch);
videoRouter.get("/watch", edit);
videoRouter.get("/watch", remove);

export default videoRouter;
