import "./bootstrap";
import "./database";
import { createServer } from 'net';
import { handleConnection } from "./libs/socket";
import express from 'express';
import routes from "./routes";
import cors from 'cors'; // importe o pacote
const app = express();
const PORT = 4000;
const HTTP_PORT = 4001;
app.use(cors({
  origin: '*', // ou '*', mas sem credentials

}));

app.options('*', cors()); // responde requisições preflight
app.use(express.json());
app.use(routes)

async function start() {
  createServer(handleConnection).listen(PORT, () =>
    console.log(`Servidor TCP rodando na porta ${PORT}`)
  );
  app.listen(HTTP_PORT, () => {
    console.log(`Servidor HTTP rodando em http://localhost:${HTTP_PORT}`);
  });
}

start().catch(console.error);
