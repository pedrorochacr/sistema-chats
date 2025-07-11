"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const isAuth_1 = __importDefault(require("../middleware/isAuth"));
const UserController = __importStar(require("../controllers/UserController"));
const userRoutes = (0, express_1.Router)();
userRoutes.get("/users", isAuth_1.default, UserController.index);
userRoutes.get("/users/list", isAuth_1.default, UserController.list);
userRoutes.post("/users", isAuth_1.default, UserController.store);
userRoutes.put("/users/:userId", isAuth_1.default, UserController.update);
userRoutes.post("/users/resetPassword", UserController.updatePassword);
userRoutes.get("/users/:userId", isAuth_1.default, UserController.show);
userRoutes.delete("/users/:userId", isAuth_1.default, UserController.remove);
exports.default = userRoutes;
//# sourceMappingURL=userRoutes.js.map