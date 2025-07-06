import { Sequelize } from "sequelize-typescript";
import Message from "../models/Message";
import Log from "../models/Logs";

// eslint-disable-next-line
const dbConfig = require("../config/database");
// import dbConfig from "../config/database";

const sequelize = new Sequelize(dbConfig);

const models = [
  Message,
  Log
];

sequelize.addModels(models);

export default sequelize;
