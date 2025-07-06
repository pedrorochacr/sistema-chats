import { Router } from "express";
import { index } from "../controllers/LogsController";

const routes = Router();


routes.use("/logs", index)

export default routes;
