
import React from 'react';
import { Server, MessageCircle, Terminal, Users, FileText, TestTube } from 'lucide-react';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView }) => {
  const menuItems = [
    { id: 'server', icon: Server, label: 'Painel do Servidor' },
    { id: 'client', icon: MessageCircle, label: 'Interface do Cliente' },
    { id: 'logs', icon: FileText, label: 'Visualizador de Logs' },
  ];

  return (
    <div className="w-64 bg-gray-900 border-r border-gray-700 h-screen flex flex-col">
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-xl font-bold text-white">Sistema de Chat TCP</h1>
        <p className="text-gray-400 text-sm mt-1">Ferramenta de Rede Distribuída</p>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setActiveView(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  activeView === item.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span>Sistema Ativo</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
