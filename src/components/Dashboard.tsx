
import React from 'react';
import { Server, MessageCircle, FileText, TestTube, Users, Activity } from 'lucide-react';

interface DashboardProps {
  setActiveView: (view: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ setActiveView }) => {
  const cards = [
    {
      id: 'server',
      title: 'Iniciar Servidor',
      description: 'Iniciar servidor TCP e monitorar conexões',
      icon: Server,
      color: 'bg-green-600 hover:bg-green-700',
    },
    {
      id: 'client',
      title: 'Iniciar Cliente',
      description: 'Conectar ao servidor e entrar no chat',
      icon: MessageCircle,
      color: 'bg-blue-600 hover:bg-blue-700',
    },
    {
      id: 'logs',
      title: 'Visualizador de Logs',
      description: 'Visualizar e analisar logs do sistema',
      icon: FileText,
      color: 'bg-purple-600 hover:bg-purple-700',
    },
    {
      id: 'tests',
      title: 'Testes do Sistema',
      description: 'Executar testes automatizados de conexão',
      icon: TestTube,
      color: 'bg-orange-600 hover:bg-orange-700',
    },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-4">Sistema de Chat Distribuído</h1>
        <p className="text-gray-300 text-lg">
          Uma ferramenta abrangente para testar e visualizar comunicações de chat baseadas em 
          socket TCP entre múltiplos clientes e instâncias de servidor. Perfeito para fins 
          educacionais e desenvolvimento de programação de rede.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {cards.map((card) => (
          <button
            key={card.id}
            onClick={() => setActiveView(card.id)}
            className={`${card.color} p-6 rounded-lg transition-all duration-200 transform hover:scale-105 text-left`}
          >
            <div className="flex items-center space-x-4">
              <card.icon size={32} className="text-white" />
              <div>
                <h3 className="text-xl font-semibold text-white">{card.title}</h3>
                <p className="text-gray-200 mt-1">{card.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800 p-6 rounded-lg">
          <div className="flex items-center space-x-3 mb-4">
            <Users className="text-blue-400" size={24} />
            <h3 className="text-lg font-semibold text-white">Conexões Ativas</h3>
          </div>
          <p className="text-3xl font-bold text-blue-400">3</p>
          <p className="text-gray-400 text-sm">Clientes conectados</p>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg">
          <div className="flex items-center space-x-3 mb-4">
            <Activity className="text-green-400" size={24} />
            <h3 className="text-lg font-semibold text-white">Mensagens Hoje</h3>
          </div>
          <p className="text-3xl font-bold text-green-400">127</p>
          <p className="text-gray-400 text-sm">Total de mensagens enviadas</p>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg">
          <div className="flex items-center space-x-3 mb-4">
            <Server className="text-purple-400" size={24} />
            <h3 className="text-lg font-semibold text-white">Status do Servidor</h3>
          </div>
          <p className="text-3xl font-bold text-green-400">Online</p>
          <p className="text-gray-400 text-sm">Porta 8080</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
