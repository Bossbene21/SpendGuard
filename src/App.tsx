import React from 'react';
import { useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Navbar } from './components/layout/Navbar';
import { GlobalSearchModal } from './components/layout/GlobalSearchModal';
import { Dashboard } from './components/dashboard/Dashboard';
import { AnomalyCenter } from './components/anomalies/AnomalyCenter';
import { AnomalyDetailModal } from './components/anomalies/AnomalyDetailModal';
import { TransactionList } from './components/transactions/TransactionList';
import { BudgetsView } from './components/budgets/BudgetsView';
import { AIInsightsView } from './components/insights/AIInsightsView';
import { WhatIfSimulator } from './components/whatif/WhatIfSimulator';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { SettingsView } from './components/settings/SettingsView';
import { AddExpenseModal } from './components/modals/AddExpenseModal';
import { WhySpendGuardModal } from './components/modals/WhySpendGuardModal';
import { LoginView } from './components/auth/LoginView';
import { DemoScenarioTour } from './components/demo/DemoScenarioTour';

export const App: React.FC = () => {
  const { isAuthenticated, activeTab } = useApp();

  if (!isAuthenticated) {
    return <LoginView />;
  }

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'anomalies':
        return <AnomalyCenter />;
      case 'transactions':
        return <TransactionList />;
      case 'budgets':
        return <BudgetsView />;
      case 'insights':
        return <AIInsightsView />;
      case 'whatif':
        return <WhatIfSimulator />;
      case 'analytics':
        return <AnalyticsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0B0F19] text-slate-100">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            {renderActiveView()}
          </div>
        </main>
      </div>

      {/* Global Application Modals */}
      <AnomalyDetailModal />
      <AddExpenseModal />
      <WhySpendGuardModal />
      <GlobalSearchModal />
      <DemoScenarioTour />
    </div>
  );
};

export default App;
