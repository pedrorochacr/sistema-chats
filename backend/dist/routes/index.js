"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const LogsController_1 = require("../controllers/LogsController");
const routes = (0, express_1.Router)();
routes.use("/logs", LogsController_1.index);
exports.default = routes;
//# sourceMappingURL=index.js.map