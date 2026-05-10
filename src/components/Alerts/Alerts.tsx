import { AlertTriangle, Activity } from 'lucide-react';
import { Alert } from '../../services/api';

interface AlertsProps {
  alerts: Alert[];
}

export const Alerts = ({ alerts }: AlertsProps) => {
  return (
    <div className="bg-surface border border-borderLight rounded-lg p-6">
      
      {/* HEADER */}
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="w-5 h-5 text-danger" />
        <h3 className="text-lg font-semibold text-primaryText">
          High Risk Alerts
        </h3>
      </div>

      {/* EMPTY STATE */}
      {alerts.length === 0 ? (
        <p className="text-secondaryText text-sm">
          No high-risk alerts at this time.
        </p>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div
              key={alert.transaction_id}
              className={`border rounded-lg p-4 transition-all ${
                alert.ml_anomaly
                  ? 'border-danger bg-danger/10'
                  : 'border-warning bg-warning/10'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  
                  {/* TOP */}
                  <div className="flex items-center gap-2 mb-2">
                    {alert.ml_anomaly && (
                      <div className="flex items-center gap-1 bg-danger text-white text-xs px-2 py-1 rounded">
                        <Activity className="w-3 h-3" />
                        ML Anomaly
                      </div>
                    )}
                    <span className="text-xs text-secondaryText">
                      ID: {alert.transaction_id}
                    </span>
                  </div>

                  {/* DETAILS */}
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    
                    <div>
                      <span className="text-secondaryText">Vendor:</span>
                      <span className="text-primaryText ml-2 font-medium">
                        {alert.vendor_id}
                      </span>
                    </div>

                    <div>
                      <span className="text-secondaryText">Amount:</span>
                      <span className="text-primaryText ml-2 font-medium">
                        ${alert.amount.toLocaleString()}
                      </span>
                    </div>

                    <div>
                      <span className="text-secondaryText">Decision:</span>
                      <span
                        className={`ml-2 font-medium ${
                          alert.decision === 'escalated'
                            ? 'text-danger'
                            : 'text-warning'
                        }`}
                      >
                        {alert.decision.replace('_', ' ')}
                      </span>
                    </div>

                    <div>
                      <span className="text-secondaryText">Risk Score:</span>
                      <span className="text-danger ml-2 font-bold">
                        {alert.risk_score}
                      </span>
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