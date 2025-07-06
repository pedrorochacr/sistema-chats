
import React, { useState, useEffect } from 'react';
import { Play, Square, Users, Activity } from 'lucide-react';

const ServerPanel: React.FC = () => {
  const [isServerRunning, setIsServerRunning] = useState(false);
  const [connectedClients, setConnectedClients] = useState(3);
  const [logs, setLogs] = useState([
    { time: '14:30:12', type: 'info', message: 'Servidor iniciado na porta 8080' },
    { time: '14:30:15', type: 'success', message: 'Cliente "Alice" conectou de 192.168.1.100' },
    { time: '14:30:18', type: 'success', message: 'Cliente "Bob" conectou de 192.168.1.101' },
    { time: '14:30:22', type: 'success', message: 'Cliente "Charlie" conectou de 192.168.1.102' },
    { time: '14:30:45', type: 'info', message: 'Mensagem transmitida para 3 clientes' },
    { time: '14:31:02', type: 'info', message: 'Mensagem de Alice: "Olá pessoal!"' },
    { time: '14:31:15', type: 'info', message: 'Mensagem de Bob: "Como vocês estão?"' },
  ]);

  const toggleServer = () => {
    setIsServerRunning(!isServerRunning);
    const newLog = {
      time: new Date().toLocaleTimeString(),
      type: isServerRunning ? 'warning' : 'success',
      message: isServerRunning ? 'Servidor parado' : 'Servidor iniciado na porta 8080'
    };
    setLogs(prev => [...prev, newLog]);
  };

  const getLogColor = (type: string) => {
    switch (type) {
      case 'success': return 'text-green-400';
      case 'warning': return 'text-yellow-400';
      case 'error': return 'text-red-400';
      default: return 'text-gray-300';
    }
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-4">Painel de Controle do Servidor</h2>
        
        <div className="flex items-center space-x-4 mb-6">

          
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-gray-800 p-4 rounded-lg">
            <div className="flex items-center space-x-3 mb-2">
              <Users className="text-blue-400" size={20} />
              <h3 className="text-white font-semibold">Clientes Conectados</h3>
            </div>
            <p className="text-2xl font-bold text-blue-400">{connectedClients}</p>
          </div>
          

        </div>
      </div>

      <div className="bg-gray-800 rounded-lg">
        <div className="p-4 border-b border-gray-700">
          <h3 className="text-lg font-semibold text-white">Logs do Servidor</h3>
        </div>
        <div className="p-4 h-96 overflow-y-auto">
          <div className="space-y-2 font-mono text-sm">
            {logs.map((log, index) => (
              <div key={index} className="flex space-x-4">
                <span className="text-gray-500">[{log.time}]</span>
                <span className={`${getLogColor(log.type)} uppercase text-xs font-bold w-16`}>
                  {log.type === 'info' ? 'INFO' : log.type === 'success' ? 'SUCESSO' : log.type === 'warning' ? 'AVISO' : 'ERRO'}
                </span>
                <span className="text-gray-300 flex-1">{log.message}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServerPanel;
