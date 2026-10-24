import React, { useState } from 'react';
import { FinanceProvider, useFinance } from './context/FinanceContext';
import { ErrorBoundary } from './components/ErrorBoundary';
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
import { QuickAddModal } from './components/QuickAddModal';
import './styles/components.css';

const AppContent: React.FC = () => {
  const { activeTab } = useFinance();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isQuickAddModalOpen, setIsQuickAddModalOpen] = useState(false);
  const [quickAddTab, setQuickAddTab] = useState<'expense' | 'income'>('expense');

  const handleOpenQuickAdd = (tab: 'expense' | 'income' = 'expense') => {
    setQuickAddTab(tab);
    setIsQuickAddModalOpen(true);
  };

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
          onOpenQuickAdd={() => handleOpenQuickAdd('expense')}
        />

        <main className="content-container">
          {activeTab === 'dashboard' && (
            <>
              {/* 1. Hero Financial Metrics & Quick Actions */}
              <MetricCards onOpenQuickAdd={handleOpenQuickAdd} />

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

        {/* Mobile Bottom Navigation Bar with instant sheet open */}
        <MobileBottomNav onQuickAddClick={() => handleOpenQuickAdd('expense')} />
      </div>

      {/* Mobile-Friendly Quick Add Bottom Sheet Modal */}
      <QuickAddModal 
        isOpen={isQuickAddModalOpen} 
        onClose={() => setIsQuickAddModalOpen(false)} 
        initialTab={quickAddTab}
      />

      {/* Authentication Modal */}
      <AuthModal />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <FinanceProvider>
        <AppContent />
      </FinanceProvider>
    </ErrorBoundary>
  );
};

export default App;
