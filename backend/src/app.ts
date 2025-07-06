import "./bootstrap";
import "reflect-metadata";
import "express-async-errors";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import * as Sentry from "@sentry/node";

import "./database";
import AppError from "./errors/AppError";



const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(Sentry.Handlers.requestHandler());


app.use(Sentry.Handlers.errorHandler());

app.use(async (err: Error, req: Request, res: Response, _: NextFunction) => {
  if (err instanceof AppError) {
  
    return res.status(err.statusCode).json({ error: err.message });
  }
  return res.status(500).json({ error: "Internal server error" });
});

export default app;
