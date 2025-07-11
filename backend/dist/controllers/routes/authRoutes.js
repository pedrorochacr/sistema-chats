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
const SessionController = __importStar(require("../controllers/SessionController"));
const UserController = __importStar(require("../controllers/UserController"));
const isAuth_1 = __importDefault(require("../middleware/isAuth"));
const envTokenAuth_1 = __importDefault(require("../middleware/envTokenAuth"));
const authRoutes = (0, express_1.Router)();
authRoutes.post("/signup", envTokenAuth_1.default, UserController.store);
authRoutes.post("/login", SessionController.store);
authRoutes.post("/refresh_token", SessionController.update);
authRoutes.delete("/logout", isAuth_1.default, SessionController.remove);
authRoutes.get("/me", isAuth_1.default, SessionController.me);
exports.default = authRoutes;
//# sourceMappingURL=authRoutes.js.map