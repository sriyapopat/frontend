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
        return 'bg-success/10 border-success/30 hover:border-success/60';
      case 'manual_review':
        return 'bg-warning/10 border-warning/30 hover:border-warning/60';
      case 'escalated':
        return 'bg-danger/10 border-danger/30 hover:border-danger/60';
      default:
        return 'bg-gray-100 border-borderLight';
    }
  };

  const getDecisionBadge = (decision: string) => {
    switch (decision) {
      case 'approved':
        return 'bg-success text-white';
      case 'manual_review':
        return 'bg-warning text-white';
      case 'escalated':
        return 'bg-danger text-white';
      default:
        return 'bg-gray-400 text-white';
    }
  };

  return (
    <div className="bg-surface border border-borderLight rounded-lg overflow-hidden">
      
      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full">
          
          {/* HEADER */}
          <thead className="bg-gray-100 border-b border-borderLight">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-secondaryText uppercase">
                Transaction ID
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-secondaryText uppercase">
                Vendor
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-secondaryText uppercase">
                Amount
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-secondaryText uppercase">
                Risk Score
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-secondaryText uppercase">
                Decision
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-secondaryText uppercase">
                Signals
              </th>
            </tr>
          </thead>

          {/* BODY */}
          <tbody className="divide-y divide-borderLight">
            {transactions.map((transaction) => (
              <tr
                key={transaction.transaction_id}
                onClick={() => onRowClick(transaction)}
                className={`cursor-pointer transition-all ${getDecisionColor(
                  transaction.decision
                )}`}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-primaryText font-mono">
                      {transaction.transaction_id}
                    </span>
                    {transaction.ml_anomaly && (
                      <Activity className="w-4 h-4 text-danger" title="ML Anomaly Detected" />
                    )}
                  </div>
                </td>

                <td className="px-6 py-4 text-sm text-secondaryText">
                  {transaction.vendor_id}
                </td>

                <td className="px-6 py-4 text-sm font-medium text-primaryText">
                  ${transaction.amount.toLocaleString()}
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`text-sm font-bold ${
                      transaction.risk_score >= 70
                        ? 'text-danger'
                        : transaction.risk_score >= 40
                        ? 'text-warning'
                        : 'text-success'
                    }`}
                  >
                    {transaction.risk_score}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded ${getDecisionBadge(
                      transaction.decision
                    )}`}
                  >
                    {transaction.decision.replace('_', ' ')}
                  </span>
                </td>

                <td className="px-6 py-4 text-sm text-secondaryText">
                  {transaction.signal_count}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="bg-gray-50 px-6 py-4 border-t border-borderLight flex items-center justify-between">
        
        <div className="flex items-center gap-4">
          <span className="text-sm text-secondaryText">Rows per page:</span>
          <select
            value={limit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            className="bg-white border border-borderLight text-primaryText rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
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
            className="p-2 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-secondaryText" />
          </button>

          <span className="text-sm text-secondaryText">Page {page}</span>

          <button
            onClick={() => onPageChange(page + 1)}
            disabled={transactions.length < limit}
            className="p-2 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-secondaryText" />
          </button>
        </div>
      </div>
    </div>
  );
};