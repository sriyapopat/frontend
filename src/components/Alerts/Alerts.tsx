import { AlertTriangle, Activity } from 'lucide-react';
import { Alert } from '../../services/api';

interface AlertsProps {
  alerts: Alert[];
}

export const Alerts = ({ alerts }: AlertsProps) => {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="w-5 h-5 text-red-500" />
        <h3 className="text-lg font-semibold text-white">High Risk Alerts</h3>
      </div>

      {alerts.length === 0 ? (
        <p className="text-gray-400 text-sm">No high-risk alerts at this time.</p>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div
              key={alert.transaction_id}
              className={`border rounded-lg p-4 transition-all ${
                alert.ml_anomaly
                  ? 'border-red-500 bg-red-500/10'
                  : 'border-yellow-500 bg-yellow-500/10'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {alert.ml_anomaly && (
                      <div className="flex items-center gap-1 bg-red-600 text-white text-xs px-2 py-1 rounded">
                        <Activity className="w-3 h-3" />
                        ML Anomaly
                      </div>
                    )}
                    <span className="text-xs text-gray-400">ID: {alert.transaction_id}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-400">Vendor:</span>
                      <span className="text-white ml-2 font-medium">{alert.vendor_id}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Amount:</span>
                      <span className="text-white ml-2 font-medium">
                        ${alert.amount.toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Decision:</span>
                      <span
                        className={`ml-2 font-medium ${
                          alert.decision === 'escalated'
                            ? 'text-red-400'
                            : 'text-yellow-400'
                        }`}
                      >
                        {alert.decision.replace('_', ' ')}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Risk Score:</span>
                      <span className="text-red-400 ml-2 font-bold">{alert.risk_score}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
