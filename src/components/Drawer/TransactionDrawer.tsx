import { X, Activity, AlertCircle } from 'lucide-react';
import { Transaction } from '../../services/api';
import { useEffect } from 'react';

interface TransactionDrawerProps {
  transaction: Transaction | null;
  isOpen: boolean;
  onClose: () => void;
}

export const TransactionDrawer = ({ transaction, isOpen, onClose }: TransactionDrawerProps) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !transaction) return null;

  const getDecisionColor = (decision: string) => {
    switch (decision) {
      case 'approved':
        return 'bg-green-600';
      case 'manual_review':
        return 'bg-yellow-600';
      case 'escalated':
        return 'bg-red-600';
      default:
        return 'bg-gray-600';
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      <div className="fixed inset-y-0 right-0 w-full sm:w-[600px] bg-gray-900 shadow-xl z-50 overflow-y-auto">
        <div className="sticky top-0 bg-gray-900 border-b border-gray-700 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Transaction Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-gray-400 mb-1">Transaction ID</p>
                <p className="text-lg font-mono text-white">{transaction.transaction_id}</p>
              </div>
              {transaction.ml_anomaly && (
                <div className="flex items-center gap-1 bg-red-600 text-white text-xs px-2 py-1 rounded">
                  <Activity className="w-3 h-3" />
                  ML Anomaly
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-400 mb-1">Vendor ID</p>
                <p className="text-white font-medium">{transaction.vendor_id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Amount</p>
                <p className="text-white font-medium">${transaction.amount.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Risk Score</p>
                <p
                  className={`text-lg font-bold ${
                    transaction.risk_score >= 70
                      ? 'text-red-400'
                      : transaction.risk_score >= 40
                      ? 'text-yellow-400'
                      : 'text-green-400'
                  }`}
                >
                  {transaction.risk_score}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Decision</p>
                <span
                  className={`inline-flex px-3 py-1 text-sm font-semibold rounded text-white ${getDecisionColor(
                    transaction.decision
                  )}`}
                >
                  {transaction.decision.replace('_', ' ')}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="w-5 h-5 text-blue-500" />
              <h3 className="text-lg font-semibold text-white">Decision Reason</h3>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">{transaction.decision_reason}</p>
          </div>

          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-3">
              Risk Signals ({transaction.signal_count})
            </h3>
            <div className="space-y-2">
              {Object.entries(transaction.risk_breakdown).map(([key, value]) => (
                <div
                  key={key}
                  className="flex items-center justify-between p-3 bg-gray-900 rounded border border-gray-700"
                >
                  <span className="text-sm text-gray-300 capitalize">
                    {key.replace(/_/g, ' ')}
                  </span>
                  <div className="flex items-center gap-3">
                    <div className="w-32 bg-gray-700 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          value >= 70
                            ? 'bg-red-500'
                            : value >= 40
                            ? 'bg-yellow-500'
                            : 'bg-green-500'
                        }`}
                        style={{ width: `${value}%` }}
                      />
                    </div>
                    <span
                      className={`text-sm font-bold w-12 text-right ${
                        value >= 70
                          ? 'text-red-400'
                          : value >= 40
                          ? 'text-yellow-400'
                          : 'text-green-400'
                      }`}
                    >
                      {value}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
