import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import { PieChart, BarChart3, TrendingUp, CreditCard, Banknote } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

export const DashboardCharts: React.FC = () => {
  const { categories, expenses, incomes, incomeSources, currency, metrics, theme } = useFinance();

  const isDark = theme === 'dark';
  const textColor = isDark ? '#94a3b8' : '#475569';
  const gridColor = isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)';
  const sliceBorderColor = isDark ? '#12131a' : '#ffffff';

  // 1. Category Chart Data (Aggregated by dynamic category)
  const categoryTotals: { [id: string]: number } = {};
  categories.forEach(cat => { categoryTotals[cat.id] = 0; });
  expenses.forEach(exp => {
    if (categoryTotals[exp.categoryId] !== undefined) {
      categoryTotals[exp.categoryId] += exp.amount;
    } else {
      categoryTotals[exp.categoryId] = exp.amount;
    }
  });

  const activeCategories = categories.filter(cat => (categoryTotals[cat.id] || 0) > 0);
  const donutLabels = activeCategories.length > 0 
    ? activeCategories.map(c => c.name) 
    : ['No Expenses'];
  const donutData = activeCategories.length > 0 
    ? activeCategories.map(c => categoryTotals[c.id]) 
    : [1];
  const donutColors = activeCategories.length > 0 
    ? activeCategories.map(c => c.color) 
    : [isDark ? '#1e293b' : '#e2e8f0'];

  const categoryDonutChartData = {
    labels: donutLabels,
    datasets: [
      {
        data: donutData,
        backgroundColor: donutColors,
        borderColor: sliceBorderColor,
        borderWidth: 3,
        hoverOffset: 6
      }
    ]
  };

  const donutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: textColor,
          boxWidth: 12,
          padding: 12,
          font: { family: 'Plus Jakarta Sans', size: 11, weight: 'bold' as const }
        }
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const val = context.raw || 0;
            const total = metrics.totalExpenses || 1;
            const pct = Math.round((val / total) * 100);
            return ` ${currency}${val.toLocaleString()} (${pct}%)`;
          }
        }
      }
    },
    cutout: '72%'
  };

  // 2. Expense Chart Data (Ranked bar chart by category)
  const sortedCategories = [...categories]
    .map(cat => ({
      name: cat.name,
      amount: categoryTotals[cat.id] || 0,
      color: cat.color
    }))
    .filter(c => c.amount > 0)
    .sort((a, b) => b.amount - a.amount);

  const expenseBarData = {
    labels: sortedCategories.length > 0 ? sortedCategories.map(c => c.name) : ['None'],
    datasets: [
      {
        label: 'Expense Amount',
        data: sortedCategories.length > 0 ? sortedCategories.map(c => c.amount) : [0],
        backgroundColor: sortedCategories.length > 0 ? sortedCategories.map(c => c.color) : ['#f43f5e'],
        borderRadius: 8
      }
    ]
  };

  const expenseBarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context: any) => ` ${currency}${(context.raw || 0).toLocaleString()}`
        }
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: textColor, font: { family: 'Plus Jakarta Sans', size: 10 } }
      },
      y: {
        grid: { color: gridColor },
        ticks: {
          color: textColor,
          font: { family: 'JetBrains Mono', size: 10 },
          callback: (value: any) => `${currency}${value}`
        }
      }
    }
  };

  // 3. Incomes Chart Data (Multiple Dynamic Incomes Breakdown)
  const incomeTotals: { [sourceId: string]: number } = {};
  incomeSources.forEach(s => { incomeTotals[s.id] = 0; });
  incomes.forEach(inc => {
    if (incomeTotals[inc.sourceId] !== undefined) {
      incomeTotals[inc.sourceId] += inc.amount;
    } else {
      incomeTotals[inc.sourceId] = inc.amount;
    }
  });

  const activeIncomeSources = incomeSources.filter(s => (incomeTotals[s.id] || 0) > 0);
  const incomeBarLabels = activeIncomeSources.length > 0 
    ? activeIncomeSources.map(s => s.name) 
    : ['No Income Logged'];
  const incomeBarValues = activeIncomeSources.length > 0 
    ? activeIncomeSources.map(s => incomeTotals[s.id]) 
    : [0];
  const incomeBarColors = activeIncomeSources.length > 0 
    ? activeIncomeSources.map(s => s.color) 
    : ['#10b981'];

  const incomeChartData = {
    labels: incomeBarLabels,
    datasets: [
      {
        label: 'Income Received',
        data: incomeBarValues,
        backgroundColor: incomeBarColors,
        borderRadius: 8
      }
    ]
  };

  const incomeChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context: any) => ` ${currency}${(context.raw || 0).toLocaleString()}`
        }
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: textColor, font: { family: 'Plus Jakarta Sans', size: 10 } }
      },
      y: {
        grid: { color: gridColor },
        ticks: {
          color: textColor,
          font: { family: 'JetBrains Mono', size: 10 },
          callback: (value: any) => `${currency}${value}`
        }
      }
    }
  };

  return (
    <div className="charts-grid">
      {/* Chart 1: Category Distribution Chart (Donut) */}
      <div className="glass-card chart-card-col-5">
        <div className="chart-header">
          <h3 className="chart-title">
            <PieChart size={18} color="var(--accent-cyan)" />
            Category Allocation
          </h3>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {activeCategories.length} Categories
          </span>
        </div>
        <div className="chart-container-donut">
          <Doughnut data={categoryDonutChartData} options={donutOptions} />
          <div className="chart-center-label">
            <div className="chart-center-amount mono-num">
              {currency}{metrics.totalExpenses.toLocaleString()}
            </div>
            <div className="chart-center-sub">Total Spent</div>
          </div>
        </div>
      </div>

      {/* Chart 2: Expense Breakdown Ranked Bar Chart */}
      <div className="glass-card chart-card-col-7">
        <div className="chart-header">
          <h3 className="chart-title">
            <BarChart3 size={18} color="var(--accent-rose)" />
            Expense Breakdown by Category
          </h3>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Ranked by Spend
          </span>
        </div>
        <div style={{ height: '250px' }}>
          <Bar data={expenseBarData} options={expenseBarOptions} />
        </div>
      </div>

      {/* Chart 3: Multiple Incomes Streams Comparison */}
      <div className="glass-card chart-card-col-7">
        <div className="chart-header">
          <h3 className="chart-title">
            <TrendingUp size={18} color="var(--accent-emerald)" />
            Multiple Income Streams
          </h3>
          <span style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)', fontWeight: 600 }}>
            {currency}{metrics.totalIncome.toLocaleString()} Total
          </span>
        </div>
        <div style={{ height: '220px' }}>
          <Bar data={incomeChartData} options={incomeChartOptions} />
        </div>
      </div>

      {/* Mini Widget: Online vs Cash Payment Split */}
      <div className="glass-card chart-card-col-5" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div className="chart-header" style={{ marginBottom: '12px' }}>
            <h3 className="chart-title" style={{ fontSize: '0.98rem' }}>
              <CreditCard size={18} color="var(--accent-cyan)" />
              Online vs Cash Spend
            </h3>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Leakage Check</span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
            Youngsters often lose track due to frictionless UPI scans. Here is your payment channel split:
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Online */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '4px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-cyan)', fontWeight: 600 }}>
                  <CreditCard size={14} /> Online (UPI / Card / NetBanking)
                </span>
                <span className="mono-num" style={{ fontWeight: 700 }}>
                  {currency}{metrics.onlineTotal.toLocaleString()} ({metrics.totalExpenses > 0 ? Math.round((metrics.onlineTotal / metrics.totalExpenses) * 100) : 0}%)
                </span>
              </div>
              <div style={{ height: '8px', background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)', borderRadius: '99px', overflow: 'hidden' }}>
                <div 
                  style={{ 
                    height: '100%', 
                    background: 'linear-gradient(90deg, var(--accent-cyan), var(--accent-purple))',
                    width: `${metrics.totalExpenses > 0 ? Math.round((metrics.onlineTotal / metrics.totalExpenses) * 100) : 0}%`,
                    borderRadius: '99px',
                    transition: 'width 0.4s ease'
                  }} 
                />
              </div>
            </div>

            {/* Cash */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '4px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-emerald)', fontWeight: 600 }}>
                  <Banknote size={14} /> Cash Payments
                </span>
                <span className="mono-num" style={{ fontWeight: 700 }}>
                  {currency}{metrics.cashTotal.toLocaleString()} ({metrics.totalExpenses > 0 ? Math.round((metrics.cashTotal / metrics.totalExpenses) * 100) : 0}%)
                </span>
              </div>
              <div style={{ height: '8px', background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)', borderRadius: '99px', overflow: 'hidden' }}>
                <div 
                  style={{ 
                    height: '100%', 
                    background: 'var(--accent-emerald)',
                    width: `${metrics.totalExpenses > 0 ? Math.round((metrics.cashTotal / metrics.totalExpenses) * 100) : 0}%`,
                    borderRadius: '99px',
                    transition: 'width 0.4s ease'
                  }} 
                />
              </div>
            </div>
          </div>
        </div>

        <div style={{
          marginTop: '16px',
          padding: '10px 12px',
          borderRadius: 'var(--radius-md)',
          background: isDark ? 'rgba(244, 63, 94, 0.08)' : '#fff1f2',
          border: isDark ? '1px solid rgba(244, 63, 94, 0.2)' : '1px solid #fecdd3',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--accent-rose)', fontWeight: 600 }}>
            🚨 Unplanned / Impulse Leaks:
          </span>
          <span className="mono-num" style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--accent-rose)' }}>
            {currency}{metrics.unplannedTotal.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};
