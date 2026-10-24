import React, { useState } from 'react';
import { FinanceProvider, useFinance } from './context/FinanceContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { MetricCards } from './components/MetricCards';
import { DashboardCharts } from './components/DashboardCharts';
import { InlineQuickAdd } from './components/InlineQuickAdd';
import { RecentTransactions } from './components/RecentTransactions';
import { ExpenseManager } from './components/ExpenseManager';
import { IncomeManager } from './components/IncomeManager';
import { CategoryManager } from './components/CategoryManager';
import { AnalyticsView } from './components/AnalyticsView';
import { SettingsView } from './components/SettingsView';
import { MobileBottomNav } from './components/MobileBottomNav';
import { AuthModal } from './components/AuthModal';
import './styles/components.css';

const AppContent: React.FC = () => {
  const { activeTab } = useFinance();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleScrollToQuickAdd = () => {
    const el = document.getElementById('quick-add-dock');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="app-layout">
      {/* Desktop Sidebar & Mobile Drawer */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="main-wrapper">
        <Header 
          onOpenSidebar={() => setSidebarOpen(true)} 
          onScrollToQuickAdd={handleScrollToQuickAdd} 
        />

        <main className="content-container">
          {activeTab === 'dashboard' && (
            <>
              {/* 1. Hero Financial Metrics */}
              <MetricCards />

              {/* 2. Visual Charts Deck */}
              <DashboardCharts />

              {/* 3. Inline Quick-Add Dock (Scroll down on dashboard) */}
              <InlineQuickAdd id="quick-add-dock" />

              {/* 4. Filterable Recent Transactions */}
              <RecentTransactions />
            </>
          )}

          {activeTab === 'expenses' && <ExpenseManager />}
          {activeTab === 'incomes' && <IncomeManager />}
          {activeTab === 'categories' && <CategoryManager />}
          {activeTab === 'analytics' && <AnalyticsView />}
          {activeTab === 'settings' && <SettingsView />}
        </main>

        {/* Mobile Bottom Navigation Bar */}
        <MobileBottomNav onQuickAddClick={handleScrollToQuickAdd} />
      </div>

      {/* Authentication Modal */}
      <AuthModal />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <FinanceProvider>
      <AppContent />
    </FinanceProvider>
  );
};

export default App;
