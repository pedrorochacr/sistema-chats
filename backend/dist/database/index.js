"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
const Message_1 = __importDefault(require("../models/Message"));
const Logs_1 = __importDefault(require("../models/Logs"));
// eslint-disable-next-line
const dbConfig = require("../config/database");
// import dbConfig from "../config/database";
const sequelize = new sequelize_typescript_1.Sequelize(dbConfig);
const models = [
    Message_1.default,
    Logs_1.default
];
sequelize.addModels(models);
exports.default = sequelize;
//# sourceMappingURL=index.js.map