import { X, Activity, AlertCircle } from 'lucide-react';
import { Transaction } from '../../services/api';
import { useEffect } from 'react';

interface TransactionDrawerProps {
  transaction: Transaction | null;
  isOpen: boolean;
  onClose: () => void;
}

export const TransactionDrawer = ({
  transaction,
  isOpen,
  onClose,
}: TransactionDrawerProps) => {
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
        return 'bg-success';
      case 'manual_review':
        return 'bg-warning';
      case 'escalated':
        return 'bg-danger';
      default:
        return 'bg-gray-400';
    }
  };

  return (
    <>
      {/* BACKDROP */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* DRAWER */}
      <div className="fixed inset-y-0 right-0 w-full sm:w-[600px] bg-surface shadow-xl z-50 overflow-y-auto">
        
        {/* HEADER */}
        <div className="sticky top-0 bg-surface border-b border-borderLight px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-primaryText">
            Transaction Details
          </h2>

          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-secondaryText" />
          </button>
        </div>

        {/* CONTENT */}
        <div className="p-6 space-y-6">

          {/* MAIN CARD */}
          <div className="bg-white border border-borderLight rounded-lg p-4">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-secondaryText mb-1">
                  Transaction ID
                </p>
                <p className="text-lg font-mono text-primaryText">
                  {transaction.transaction_id}
                </p>
              </div>

              {transaction.ml_anomaly && (
                <div className="flex items-center gap-1 bg-danger text-white text-xs px-2 py-1 rounded">
                  <Activity className="w-3 h-3" />
                  ML Anomaly
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              
              <div>
                <p className="text-sm text-secondaryText mb-1">Vendor ID</p>
                <p className="text-primaryText font-medium">
                  {transaction.vendor_id}
                </p>
              </div>

              <div>
                <p className="text-sm text-secondaryText mb-1">Amount</p>
                <p className="text-primaryText font-medium">
                  ${transaction.amount.toLocaleString()}
                </p>
              </div>

              <div>
                <p className="text-sm text-secondaryText mb-1">Risk Score</p>
                <p
                  className={`text-lg font-bold ${
                    transaction.risk_score >= 70
                      ? 'text-danger'
                      : transaction.risk_score >= 40
                      ? 'text-warning'
                      : 'text-success'
                  }`}
                >
                  {transaction.risk_score}
                </p>
              </div>

              <div>
                <p className="text-sm text-secondaryText mb-1">Decision</p>
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

          {/* DECISION REASON */}
          <div className="bg-white border border-borderLight rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-primaryText">
                Decision Reason
              </h3>
            </div>

            <p className="text-secondaryText text-sm leading-relaxed">
              {transaction.decision_reason}
            </p>
          </div>

          {/* RISK SIGNALS */}
          <div className="bg-white border border-borderLight rounded-lg p-4">
            <h3 className="text-lg font-semibold text-primaryText mb-3">
              Risk Signals ({transaction.signal_count})
            </h3>

            <div className="space-y-2">
              {Object.entries(transaction.risk_breakdown).map(([key, value]) => (
                <div
                  key={key}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded border border-borderLight"
                >
                  <span className="text-sm text-secondaryText capitalize">
                    {key.replace(/_/g, ' ')}
                  </span>

                  <div className="flex items-center gap-3">
                    
                    {/* PROGRESS BAR */}
                    <div className="w-32 bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          value >= 70
                            ? 'bg-danger'
                            : value >= 40
                            ? 'bg-warning'
                            : 'bg-success'
                        }`}
                        style={{ width: `${value}%` }}
                      />
                    </div>

                    <span
                      className={`text-sm font-bold w-12 text-right ${
                        value >= 70
                          ? 'text-danger'
                          : value >= 40
                          ? 'text-warning'
                          : 'text-success'
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