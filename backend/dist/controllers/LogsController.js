"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.index = void 0;
const Logs_1 = __importDefault(require("../models/Logs"));
const index = async (req, res) => {
    const logs = await Logs_1.default.findAll({
        order: [['createdAt', 'DESC']],
    });
    return res.json(logs);
};
exports.index = index;
//# sourceMappingURL=LogsController.js.map