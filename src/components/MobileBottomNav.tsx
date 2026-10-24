import { LayoutDashboard, Receipt, Plus, Wallet, PieChart } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';

interface MobileBottomNavProps {
  onQuickAddClick: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ onQuickAddClick }) => {
  const { activeTab, setActiveTab } = useFinance();

  return (
    <nav className="mobile-bottom-nav">
      <button
        className={`bottom-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
        onClick={() => setActiveTab('dashboard')}
      >
        <LayoutDashboard size={20} />
        <span>Home</span>
      </button>

      <button
        className={`bottom-nav-item ${activeTab === 'expenses' ? 'active' : ''}`}
        onClick={() => setActiveTab('expenses')}
      >
        <Receipt size={20} />
        <span>Expenses</span>
      </button>

      {/* Floating center (+) button */}
      <button
        className="bottom-nav-item quick-add-trigger"
        onClick={() => {
          setActiveTab('dashboard');
          onQuickAddClick();
        }}
        aria-label="Quick Add Entry"
      >
        <Plus size={24} strokeWidth={2.8} />
      </button>

      <button
        className={`bottom-nav-item ${activeTab === 'incomes' ? 'active' : ''}`}
        onClick={() => setActiveTab('incomes')}
      >
        <Wallet size={20} />
        <span>Incomes</span>
      </button>

      <button
        className={`bottom-nav-item ${activeTab === 'analytics' ? 'active' : ''}`}
        onClick={() => setActiveTab('analytics')}
      >
        <PieChart size={20} />
        <span>Leaks</span>
      </button>
    </nav>
  );
};
