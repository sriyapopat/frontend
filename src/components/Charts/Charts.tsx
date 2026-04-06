import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
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
    const bucket = riskBuckets.find((b) => t.risk_score >= b.min && t.risk_score <= b.max);
    if (bucket) bucket.value += 1;
  });

  const COLORS = {
    approved: '#10b981',
    manual_review: '#f59e0b',
    escalated: '#ef4444',
  };

  const PIE_COLORS = ['#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Decision Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={decisionData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {decisionData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[entry.name as keyof typeof COLORS] || PIE_COLORS[index % PIE_COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#1f2937',
                border: '1px solid #374151',
                borderRadius: '0.5rem',
                color: '#fff',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Risk Score Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={riskBuckets}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1f2937',
                border: '1px solid #374151',
                borderRadius: '0.5rem',
                color: '#fff',
              }}
            />
            <Legend />
            <Bar dataKey="value" fill="#3b82f6" name="Transactions" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
