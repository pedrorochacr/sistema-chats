
import React, { useState } from 'react';
import { Play, Users, Activity, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const TestPanel: React.FC = () => {
  const [isRunningTest, setIsRunningTest] = useState(false);
  const [testResults, setTestResults] = useState([
    { name: 'Conexão de Cliente Único', status: 'success', latency: 15, details: 'Conectado com sucesso em 15ms' },
    { name: 'Conexões de Múltiplos Clientes', status: 'success', latency: 23, details: '5 clientes conectados simultaneamente' },
    { name: 'Transmissão de Mensagens', status: 'success', latency: 8, details: 'Mensagem entregue a todos os clientes' },
    { name: 'Desconexão de Cliente', status: 'success', latency: 12, details: 'Desconexão graciosa tratada' },
    { name: 'Teste de Carga do Servidor', status: 'warning', latency: 145, details: 'Alta latência com 50 conexões simultâneas' },
    { name: 'Tratamento de Erros', status: 'success', latency: 5, details: 'Mensagens inválidas tratadas corretamente' },
  ]);

  const runTest = async () => {
    setIsRunningTest(true);
    // Simular execução de teste
    setTimeout(() => {
      setIsRunningTest(false);
      // Atualizar resultados dos testes com novos timestamps
      setTestResults(prev => prev.map(test => ({
        ...test,
        latency: Math.floor(Math.random() * 100) + 5
      })));
    }, 3000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="text-green-400" size={20} />;
      case 'error': return <XCircle className="text-red-400" size={20} />;
      case 'warning': return <AlertCircle className="text-yellow-400" size={20} />;
      default: return <AlertCircle className="text-gray-400" size={20} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-400';
      case 'error': return 'text-red-400';
      case 'warning': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'success': return 'sucesso';
      case 'error': return 'erro';
      case 'warning': return 'aviso';
      default: return 'desconhecido';
    }
  };

  const metrics = {
    successRate: Math.round((testResults.filter(t => t.status === 'success').length / testResults.length) * 100),
    avgLatency: Math.round(testResults.reduce((acc, test) => acc + test.latency, 0) / testResults.length),
    totalTests: testResults.length,
    failedTests: testResults.filter(t => t.status === 'error').length,
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-4">Painel de Testes do Sistema</h2>
        <p className="text-gray-400">
          Suíte de testes automatizados para estabilidade de conexão, entrega de mensagens e métricas de desempenho
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-800 p-6 rounded-lg">
          <div className="flex items-center space-x-3 mb-2">
            <CheckCircle className="text-green-400" size={24} />
            <h3 className="text-white font-semibold">Taxa de Sucesso</h3>
          </div>
          <p className="text-3xl font-bold text-green-400">{metrics.successRate}%</p>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-lg">
          <div className="flex items-center space-x-3 mb-2">
            <Clock className="text-blue-400" size={24} />
            <h3 className="text-white font-semibold">Latência Média</h3>
          </div>
          <p className="text-3xl font-bold text-blue-400">{metrics.avgLatency}ms</p>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-lg">
          <div className="flex items-center space-x-3 mb-2">
            <Activity className="text-purple-400" size={24} />
            <h3 className="text-white font-semibold">Total de Testes</h3>
          </div>
          <p className="text-3xl font-bold text-purple-400">{metrics.totalTests}</p>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-lg">
          <div className="flex items-center space-x-3 mb-2">
            <XCircle className="text-red-400" size={24} />
            <h3 className="text-white font-semibold">Testes Falharam</h3>
          </div>
          <p className="text-3xl font-bold text-red-400">{metrics.failedTests}</p>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg">
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Suíte de Testes</h3>
            <button
              onClick={runTest}
              disabled={isRunningTest}
              className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg font-semibold transition-all duration-200"
            >
              <Play size={16} />
              <span>{isRunningTest ? 'Executando Testes...' : 'Executar Todos os Testes'}</span>
            </button>
          </div>
        </div>

        <div className="p-6">
          {isRunningTest && (
            <div className="mb-6 p-4 bg-blue-900 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400"></div>
                <span className="text-blue-300">Executando testes automatizados... Isso pode levar alguns momentos.</span>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {testResults.map((test, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-4">
                  {getStatusIcon(test.status)}
                  <div>
                    <h4 className="text-white font-medium">{test.name}</h4>
                    <p className="text-gray-400 text-sm">{test.details}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6">
                  <div className="text-right">
                    <p className="text-gray-300 text-sm">Latência</p>
                    <p className="text-white font-semibold">{test.latency}ms</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-300 text-sm">Status</p>
                    <p className={`font-semibold capitalize ${getStatusColor(test.status)}`}>
                      {getStatusText(test.status)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Opções de Teste de Carga</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors duration-200">
            <Users className="text-blue-400 mb-2" size={24} />
            <h4 className="text-white font-medium mb-1">10 Clientes Simultâneos</h4>
            <p className="text-gray-400 text-sm">Teste de carga leve</p>
          </button>
          
          <button className="p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors duration-200">
            <Users className="text-yellow-400 mb-2" size={24} />
            <h4 className="text-white font-medium mb-1">50 Clientes Simultâneos</h4>
            <p className="text-gray-400 text-sm">Teste de carga média</p>
          </button>
          
          <button className="p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors duration-200">
            <Users className="text-red-400 mb-2" size={24} />
            <h4 className="text-white font-medium mb-1">100 Clientes Simultâneos</h4>
            <p className="text-gray-400 text-sm">Teste de carga pesada</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestPanel;
