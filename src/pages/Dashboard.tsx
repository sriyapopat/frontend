import { useState, useEffect, useCallback } from 'react';
import { Header } from '../components/Header/Header';
import { KPICards } from '../components/KPI/KPICards';
import { Filters } from '../components/Filters/Filters';
import { Charts } from '../components/Charts/Charts';
import { Alerts } from '../components/Alerts/Alerts';
import { TransactionTable } from '../components/Table/TransactionTable';
import { TransactionDrawer } from '../components/Drawer/TransactionDrawer';
import { api, Transaction, Summary, Alert, TransactionFilters } from '../services/api';

export const Dashboard = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [filters, setFilters] = useState<TransactionFilters>({ page: 1, limit: 25 });
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [transactionsData, summaryData, alertsData] = await Promise.all([
        api.getTransactions(filters),
        api.getSummary(),
        api.getAlerts(),
      ]);
      setTransactions(transactionsData);
      setSummary(summaryData);
      setAlerts(alertsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleGenerateData = async () => {
    setIsGenerating(true);
    try {
      await api.generateData();
      await fetchData();
    } catch (error) {
      console.error('Error generating data:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFilterChange = (newFilters: TransactionFilters) => {
    setFilters({ ...newFilters, page: 1 });
  };

  const handleResetFilters = () => {
    setFilters({ page: 1, limit: filters.limit });
  };

  const handleRowClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsDrawerOpen(true);
  };

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page });
  };

  const handleLimitChange = (limit: number) => {
    setFilters({ ...filters, limit, page: 1 });
  };

  return (
    <div className="min-h-screen bg-gray-950">
      <Header onGenerateData={handleGenerateData} isGenerating={isGenerating} />

      <main className="max-w-[1600px] mx-auto px-6 py-8 space-y-6">
        <KPICards summary={summary} />

        <Filters
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilters}
        />

        <Charts transactions={transactions} />

        <Alerts alerts={alerts} />

        {loading ? (
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-12 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-400">Loading transactions...</p>
            </div>
          </div>
        ) : (
          <TransactionTable
            transactions={transactions}
            onRowClick={handleRowClick}
            page={filters.page || 1}
            limit={filters.limit || 25}
            onPageChange={handlePageChange}
            onLimitChange={handleLimitChange}
          />
        )}
      </main>

      <TransactionDrawer
        transaction={selectedTransaction}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </div>
  );
};
