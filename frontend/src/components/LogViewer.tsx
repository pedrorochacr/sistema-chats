
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
                  <th className="text-left py-3 px-4 text-gray-300 font-semibold">Mensagem</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} className="border-b border-gray-700 hover:bg-gray-750">
                    <td className="py-3 px-4 text-gray-400 font-mono text-sm">
                      {log.createdAt}
                    </td>
                    <td className={`py-3 px-4  text-gray-400` }>
                      {log.content}
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
