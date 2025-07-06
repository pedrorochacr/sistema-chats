import { Request, Response } from "express";
import Log from "../models/Logs";

export const index = async (req: Request, res: Response): Promise<Response> => {
 
    const logs = await Log.findAll();
  

  return res.json(logs);
};