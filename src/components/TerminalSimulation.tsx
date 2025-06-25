
import React, { useState } from 'react';
import { Terminal, Server, MessageCircle } from 'lucide-react';

const TerminalSimulation: React.FC = () => {
  const [activeTab, setActiveTab] = useState('server');
  
  const serverLogs = [
    '$ ./tcp_server',
    'Servidor TCP iniciando...',
    'Ouvindo na porta 8080',
    'Socket do servidor criado com sucesso',
    'Aguardando conexões...',
    '',
    '[14:30:15] Cliente conectado: 192.168.1.100:52341',
    '[14:30:15] Nova thread de cliente iniciada para Alice',
    '[14:30:22] Cliente conectado: 192.168.1.101:52342',
    '[14:30:22] Nova thread de cliente iniciada para Bob',
    '[14:30:28] Cliente conectado: 192.168.1.102:52343',
    '[14:30:28] Nova thread de cliente iniciada para Charlie',
    '',
    '[14:31:02] Mensagem de Alice: "Olá pessoal!"',
    '[14:31:02] Transmitindo mensagem para 3 clientes',
    '[14:31:15] Mensagem de Bob: "Como vocês estão?"',
    '[14:31:15] Transmitindo mensagem para 3 clientes',
    '',
    'Servidor rodando... Pressione Ctrl+C para parar',
  ];

  const client1Logs = [
    '$ ./tcp_client Alice',
    'Cliente TCP iniciando...',
    'Conectando ao servidor em localhost:8080',
    'Conectado com sucesso!',
    'Nome de usuário: Alice',
    'Digite mensagens (ou /quit para sair)',
    '',
    '> Olá pessoal!',
    '[14:31:02] Alice: Olá pessoal!',
    '[14:31:15] Bob: Como vocês estão?',
    '[14:31:28] Charlie: Ótimo estar aqui!',
    '',
    '> Alguém trabalhando em projetos interessantes?',
    '[14:31:35] Alice: Alguém trabalhando em projetos interessantes?',
    '[14:31:42] Bob: Estou testando este sistema de chat para minha aula de redes',
    '',
    '> _',
  ];

  const client2Logs = [
    '$ ./tcp_client Bob',
    'Cliente TCP iniciando...',
    'Conectando ao servidor em localhost:8080',
    'Conectado com sucesso!',
    'Nome de usuário: Bob',
    'Digite mensagens (ou /quit para sair)',
    '',
    '[14:31:02] Alice: Olá pessoal!',
    '> Como vocês estão?',
    '[14:31:15] Bob: Como vocês estão?',
    '[14:31:28] Charlie: Ótimo estar aqui!',
    '[14:31:35] Alice: Alguém trabalhando em projetos interessantes?',
    '',
    '> Estou testando este sistema de chat para minha aula de redes',
    '[14:31:42] Bob: Estou testando este sistema de chat para minha aula de redes',
    '',
    '> _',
  ];

  const tabs = [
    { id: 'server', label: 'Terminal do Servidor', icon: Server, logs: serverLogs },
    { id: 'client1', label: 'Cliente 1 (Alice)', icon: MessageCircle, logs: client1Logs },
    { id: 'client2', label: 'Cliente 2 (Bob)', icon: MessageCircle, logs: client2Logs },
  ];

  return (
    <div className="p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-4">Simulação de Terminal</h2>
        <p className="text-gray-400">
          Visualização em tempo real das interações do terminal do servidor e cliente
        </p>
      </div>

      <div className="bg-gray-800 rounded-lg">
        <div className="flex border-b border-gray-700">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-3 font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-gray-700 text-white border-b-2 border-blue-500'
                  : 'text-gray-400 hover:text-white hover:bg-gray-750'
              }`}
            >
              <tab.icon size={16} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="p-6">
          <div className="bg-black rounded-lg p-4 h-96 overflow-y-auto">
            <div className="flex items-center space-x-2 mb-4">
              <Terminal className="text-green-400" size={16} />
              <span className="text-green-400 font-mono text-sm">
                {tabs.find(tab => tab.id === activeTab)?.label}
              </span>
            </div>
            
            <div className="font-mono text-sm space-y-1">
              {tabs.find(tab => tab.id === activeTab)?.logs.map((line, index) => (
                <div key={index} className={`${
                  line.startsWith('$') ? 'text-green-400' :
                  line.startsWith('[') ? 'text-blue-400' :
                  line.startsWith('>') ? 'text-yellow-400' :
                  line.includes('Erro') || line.includes('erro') ? 'text-red-400' :
                  line.includes('sucesso') || line.includes('Conectado') ? 'text-green-300' :
                  'text-gray-300'
                }`}>
                  {line || '\u00A0'}
                </div>
              ))}
              <div className="text-green-400 animate-pulse">█</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-white font-semibold mb-2">Status do Servidor</h3>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-green-400 text-sm">Rodando na Porta 8080</span>
          </div>
        </div>
        
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-white font-semibold mb-2">Conexões Ativas</h3>
          <p className="text-blue-400 text-xl font-bold">3</p>
        </div>
        
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-white font-semibold mb-2">Mensagens/seg</h3>
          <p className="text-purple-400 text-xl font-bold">0,8</p>
        </div>
      </div>
    </div>
  );
};

export default TerminalSimulation;
