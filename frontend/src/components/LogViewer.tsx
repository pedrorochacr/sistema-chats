
import React, { useEffect, useState } from 'react';
import { Search, Download, Filter, Calendar } from 'lucide-react';
import axios from 'axios';
const LogViewer: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClient, setFilterClient] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const[logs, setLogs] = useState([]);
    useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await axios.get("http://localhost:4001/logs");
        setLogs(response.data);
      } catch (error) {
        console.error("Erro ao buscar logs:", error);
      }
    };

    fetchLogs();
  }, []);


  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.client.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClient = filterClient === 'all' || log.client === filterClient;
    const matchesType = filterType === 'all' || log.type === filterType;
    
    return matchesSearch && matchesClient && matchesType;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'connection': return 'text-green-400 bg-green-900';
      case 'disconnection': return 'text-red-400 bg-red-900';
      case 'message': return 'text-blue-400 bg-blue-900';
      case 'error': return 'text-red-400 bg-red-900';
      default: return 'text-gray-400 bg-gray-700';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'connection': return 'conexão';
      case 'disconnection': return 'desconexão';
      case 'message': return 'mensagem';
      case 'error': return 'erro';
      default: return 'info';
    }
  };

  const getClientColor = (client: string) => {
    switch (client) {
      case 'Alice': return 'text-blue-400';
      case 'Bob': return 'text-green-400';
      case 'Charlie': return 'text-purple-400';
      case 'Servidor': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };



  return (
    <div className="p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-4">Visualizador de Logs do Sistema</h2>
        <p className="text-gray-400">
          Visualize e analise todos os logs do sistema
        </p>
      </div>

      <div className="bg-gray-800 rounded-lg">
        <div className="p-4 border-b border-gray-700">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
              <div className="relative">
              

              </div>

     
            </div>
            

          </div>
        </div>

        <div className="p-4">
          <div className="text-sm text-gray-400 mb-4">
            Mostrando  {logs.length} entradas de log
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-gray-300 font-semibold">Timestamp</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-semibold">Cliente</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-semibold">Tipo</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-semibold">Mensagem</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="border-b border-gray-700 hover:bg-gray-750">
                    <td className="py-3 px-4 text-gray-400 font-mono text-sm">
                      {log.timestamp}
                    </td>
                    <td className={`py-3 px-4 font-semibold ${getClientColor(log.client)}`}>
                      {log.client}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(log.type)}`}>
                        {getTypeLabel(log.type)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-300">
                      {log.message}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogViewer;
