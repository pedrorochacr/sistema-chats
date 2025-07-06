"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RABBITMQ_PREFETCH = exports.RABBITMQ_URI = void 0;
exports.RABBITMQ_URI = process.env.RABBITMQ_URI || "amqp://localhost";
exports.RABBITMQ_PREFETCH = parseInt(process.env.RABBITMQ_PREFETCH || "1", 10);
//# sourceMappingURL=rabbitmq.js.map