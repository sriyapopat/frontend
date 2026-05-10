import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Transaction } from '../../services/api';

interface ChartsProps {
  transactions: Transaction[];
}

export const Charts = ({ transactions }: ChartsProps) => {
  const decisionData = transactions.reduce((acc, t) => {
    const decision = t.decision;
    const existing = acc.find((d) => d.name === decision);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: decision, value: 1 });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  const riskBuckets = [
    { name: '0-20', min: 0, max: 20, value: 0 },
    { name: '21-40', min: 21, max: 40, value: 0 },
    { name: '41-60', min: 41, max: 60, value: 0 },
    { name: '61-80', min: 61, max: 80, value: 0 },
    { name: '81-100', min: 81, max: 100, value: 0 },
  ];

  transactions.forEach((t) => {
    const bucket = riskBuckets.find(
      (b) => t.risk_score >= b.min && t.risk_score <= b.max
    );
    if (bucket) bucket.value += 1;
  });

  const COLORS = {
    approved: '#16a34a', // green
    manual_review: '#f59e0b', // yellow
    escalated: '#ef4444', // red
  };

  const PIE_COLORS = ['#16a34a', '#f59e0b', '#ef4444', '#2563eb', '#f97316'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      
      {/* PIE CHART */}
      <div className="bg-surface border border-borderLight rounded-lg p-6">
        <h3 className="text-lg font-semibold text-primaryText mb-4">
          Decision Distribution
        </h3>

        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={decisionData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) =>
                `${name}: ${(percent * 100).toFixed(0)}%`
              }
              outerRadius={100}
              dataKey="value"
            >
              {decisionData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    COLORS[entry.name as keyof typeof COLORS] ||
                    PIE_COLORS[index % PIE_COLORS.length]
                  }
                />
              ))}
            </Pie>

            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                color: '#111827',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* BAR CHART */}
      <div className="bg-surface border border-borderLight rounded-lg p-6">
        <h3 className="text-lg font-semibold text-primaryText mb-4">
          Risk Score Distribution
        </h3>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={riskBuckets}>
            <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />

            <XAxis dataKey="name" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />

            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                color: '#111827',
              }}
            />

            <Legend />

            <Bar dataKey="value" fill="#2563eb" name="Transactions" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};