
import React, { useRef, useState } from 'react';
import { Send, Users, Wifi, WifiOff } from 'lucide-react';
import { set } from 'date-fns';

const ClientInterface: React.FC = () => {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [clientCount, setClientCount] = useState(0);

  //   const [messages, setMessages] = useState([
  //   { time: '14:30:15', user: 'Alice', message: 'Olá pessoal!', color: 'text-blue-400' },
  //   { time: '14:30:22', user: 'Bob', message: 'Como vocês estão?', color: 'text-green-400' },
  //   { time: '14:30:28', user: 'Charlie', message: 'Ótimo estar aqui!', color: 'text-purple-400' },
  //   { time: '14:30:35', user: 'Alice', message: 'Alguém trabalhando em projetos interessantes?', color: 'text-blue-400' },
  //   { time: '14:30:42', user: 'Bob', message: 'Estou testando este sistema de chat para minha aula de redes', color: 'text-green-400' },
  // ]);
  const socketRef = useRef<WebSocket | null>(null);
  const toggleConnection = () => {
    if (isConnected && socketRef.current) {
      socketRef.current.close();
      setIsConnected(false);
    } else {
      const socket = new WebSocket('ws://localhost:8081'); // ou 8081 se mudou a porta
      socketRef.current = socket;

      socket.onopen = () => {
        console.log('Conectado ao WebSocket');
        socketRef.current.send(username);
        setIsConnected(true);
      };

      socket.onmessage = (e) => {
        console.log('Mensagem recebida:', e.data);
        // Aqui você pode setar mensagens no estado, etc.
        const msgObj = JSON.parse(e.data);
  // msgObj = { time: '14:30:22', user: 'Bob', message: 'Como vocês estão?', color: 'text-green-400' }
        if(msgObj.type === 'clientCount') {
          setClientCount(msgObj.count);
        } else{
          setMessages(prev => [...prev, msgObj]);
        }
  
      };

      socket.onclose = () => {
        console.log('Desconectado');
        setIsConnected(false);
      };

      socket.onerror = (err) => {
        console.error('Erro no WebSocket:', err);
        setIsConnected(false);
      };
    }
  };

  const sendMessage = () => {
    if (!message.trim() || !isConnected) return;
    socketRef.current.send(message);

    setMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-4">Interface do Cliente</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Nome de Usuário</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isConnected}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
              placeholder="Digite seu nome de usuário"
            />
          </div>
          
          <div className="flex items-end">
            <button
              onClick={toggleConnection}
              className={`flex items-center space-x-2 px-6 py-2 rounded-lg font-semibold transition-all duration-200 ${
                isConnected 
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {isConnected ? <WifiOff size={20} /> : <Wifi size={20} />}
              <span>{isConnected ? 'Desconectar' : 'Conectar'}</span>
            </button>
          </div>
        </div>

        <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg mb-6 ${
          isConnected ? 'bg-green-900 text-green-300' : 'bg-gray-800 text-gray-400'
        }`}>
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-gray-500'}`}></div>
          <Users size={16} />
          <span>{isConnected ? `Conectado ao servidor (${clientCount} usuários online)` : 'Não conectado'}</span>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg">
        <div className="p-4 border-b border-gray-700">
          <h3 className="text-lg font-semibold text-white">Mensagens do Chat</h3>
        </div>
        
        <div className="p-4 h-80 overflow-y-auto">
          <div className="space-y-3">
            {messages.map((msg, index) => (
              <div key={index} className="flex flex-col space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500">{msg.time}</span>
                  <span className={`font-semibold ${msg.color}`}>{msg.user}:</span>
                </div>
                <p className="text-gray-300 ml-16">{msg.message}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="p-4 border-t border-gray-700">
          <div className="flex space-x-3">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={!isConnected}
              className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
              placeholder="Digite sua mensagem..."
            />
            <button
              onClick={sendMessage}
              disabled={!isConnected || !message.trim()}
              className="flex items-center space-x-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg font-semibold transition-all duration-200"
            >
              <Send size={16} />
              <span>Enviar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientInterface;
