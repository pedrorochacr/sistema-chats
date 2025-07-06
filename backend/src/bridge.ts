import WebSocket from 'ws';
import net from 'net';

const wss = new WebSocket.Server({ port: 8081   });
console.log('Bridge WS iniciada em ws://localhost:8081');

wss.on('connection', ws => {
  const tcp = new net.Socket().connect(4000, 'localhost');
  tcp.on('data', chunk => ws.send(chunk.toString()));
  tcp.on('end', () => ws.close());
  tcp.on('error', () => ws.close());
  ws.on('message', msg => tcp.write(msg.toString()));
  ws.on('close', () => tcp.end());
});
