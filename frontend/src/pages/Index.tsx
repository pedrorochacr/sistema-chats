
import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Dashboard from '../components/Dashboard';
import ServerPanel from '../components/ServerPanel';
import ClientInterface from '../components/ClientInterface';
import TerminalSimulation from '../components/TerminalSimulation';
import LogViewer from '../components/LogViewer';
import TestPanel from '../components/TestPanel';

const Index = () => {
  const [activeView, setActiveView] = useState('dashboard');

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard setActiveView={setActiveView} />;
      case 'server':
        return <ServerPanel />;
      case 'client':
        return <ClientInterface />;
      case 'terminal':
        return <TerminalSimulation />;
      case 'logs':
        return <LogViewer />;
      case 'tests':
        return <TestPanel />;
      default:
        return <Dashboard setActiveView={setActiveView} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <div className="flex-1 overflow-auto">
        {renderActiveView()}
      </div>
    </div>
  );
};

export default Index;
