import { ChevronLeft, ChevronRight, Activity } from 'lucide-react';
import { Transaction } from '../../services/api';

interface TransactionTableProps {
  transactions: Transaction[];
  onRowClick: (transaction: Transaction) => void;
  page: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

export const TransactionTable = ({
  transactions,
  onRowClick,
  page,
  limit,
  onPageChange,
  onLimitChange,
}: TransactionTableProps) => {
  const getDecisionColor = (decision: string) => {
    switch (decision) {
      case 'approved':
        return 'bg-green-500/10 border-green-500/20 hover:border-green-500/40';
      case 'manual_review':
        return 'bg-yellow-500/10 border-yellow-500/20 hover:border-yellow-500/40';
      case 'escalated':
        return 'bg-red-500/10 border-red-500/20 hover:border-red-500/40';
      default:
        return 'bg-gray-500/10 border-gray-500/20 hover:border-gray-500/40';
    }
  };

  const getDecisionBadge = (decision: string) => {
    switch (decision) {
      case 'approved':
        return 'bg-green-600 text-white';
      case 'manual_review':
        return 'bg-yellow-600 text-white';
      case 'escalated':
        return 'bg-red-600 text-white';
      default:
        return 'bg-gray-600 text-white';
    }
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-900 border-b border-gray-700">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Transaction ID
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Vendor
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Risk Score
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Decision
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Signals
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {transactions.map((transaction) => (
              <tr
                key={transaction.transaction_id}
                onClick={() => onRowClick(transaction)}
                className={`border cursor-pointer transition-all ${getDecisionColor(
                  transaction.decision
                )}`}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-300 font-mono">
                      {transaction.transaction_id}
                    </span>
                    {transaction.ml_anomaly && (
                      <Activity className="w-4 h-4 text-red-500" title="ML Anomaly Detected" />
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {transaction.vendor_id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                  ${transaction.amount.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`text-sm font-bold ${
                      transaction.risk_score >= 70
                        ? 'text-red-400'
                        : transaction.risk_score >= 40
                        ? 'text-yellow-400'
                        : 'text-green-400'
                    }`}
                  >
                    {transaction.risk_score}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded ${getDecisionBadge(
                      transaction.decision
                    )}`}
                  >
                    {transaction.decision.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {transaction.signal_count}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-gray-900 px-6 py-4 border-t border-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-400">Rows per page:</span>
          <select
            value={limit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            className="bg-gray-800 border border-gray-700 text-white rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
            className="p-2 rounded hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-400" />
          </button>
          <span className="text-sm text-gray-400">Page {page}</span>
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={transactions.length < limit}
            className="p-2 rounded hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  );
};
