import { Socket } from 'net';
import Message from '../models/Message';
import Log from '../models/Logs';
const clients: Socket[] = [];

const userColors = [
  'text-green-400',
  'text-blue-500',
  'text-yellow-400',
  'text-pink-500',
  'text-purple-500',
  'text-indigo-500',
  'text-teal-400',
];
function getRandomColor() {
  return userColors[Math.floor(Math.random() * userColors.length)];
}

function getCurrentTime() {
  const d = new Date();
  return d.toLocaleTimeString('pt-BR', { hour12: false });
}


export function handleConnection(socket: Socket) {
  clients.push(socket);
  socket.write('Bem-vindo ao chat TCP!\nDigite seu nome: ');

  let username = '';

  socket.on('data', async data => {
    const txt = data.toString().trim();
    broadcastClientCount();
    if (!username) {
      username = txt;
      const messsage = {
        type:"message",
        time: getCurrentTime(),
        user: 'Servidor',
        message: `${username} entrou no chat.`,
        color: 'text-red-400'
      }
      let ip = socket.remoteAddress || 'IP desconhecido';

      if (ip === '::1') ip = '127.0.0.1'; // converte IPv6 localhost para IPv4
      const logData = {
        content:"Novo usuário conectou-se de " + ip + ` com o nome ${username}`,
      }
      await Log.create(logData);
      const json = JSON.stringify(messsage);
      broadcast(json, socket);
      return;
    }
      const messsage = {
         type:"message",
        time: getCurrentTime(),
        user: username,
        message: txt,
        color: 'text-green-400'
      }
          const logData = {
        content:`${username} enviou uma mensagem`,
      }
      await Log.create(logData);
    const json = JSON.stringify(messsage);
    broadcast(json, socket);
  });

  socket.on('end', async () => {
    clients.splice(clients.indexOf(socket), 1);
    broadcastClientCount();
      const messsage = {
        type:"message",
        time: getCurrentTime(),
        user: 'Servidor',
        message: `${username} saiu do chat.`,
        color: 'text-red-400'
      }
        const logData = {
        content:`${username} desconectou-se`,
      }
      await Log.create(logData);
      const json = JSON.stringify(messsage);
      broadcast(json, socket);
  });

  socket.on('error', () => {
    clients.splice(clients.indexOf(socket), 1);
  });
}


function broadcastClientCount() {
  const count = clients.length;
  const msg = JSON.stringify({ type: 'clientCount', count });
  for (const c of clients) {
    c.write(msg);
  }
}


function broadcast(msg: string, sender?: Socket) {
  for (const c of clients) {
     c.write(msg + '\n');
  }
}
