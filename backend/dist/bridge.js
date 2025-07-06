"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = __importDefault(require("ws"));
const net_1 = __importDefault(require("net"));
const wss = new ws_1.default.Server({ port: 8081 });
console.log('Bridge WS iniciada em ws://localhost:8081');
wss.on('connection', ws => {
    const tcp = new net_1.default.Socket().connect(4000, 'localhost');
    tcp.on('data', chunk => ws.send(chunk.toString()));
    tcp.on('end', () => ws.close());
    tcp.on('error', () => ws.close());
    ws.on('message', msg => tcp.write(msg.toString()));
    ws.on('close', () => tcp.end());
});
//# sourceMappingURL=bridge.js.map