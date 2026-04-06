import { TrendingUp, AlertTriangle, Eye, BarChart3 } from 'lucide-react';
import { Summary } from '../../services/api';

interface KPICardsProps {
  summary: Summary | null;
}

export const KPICards = ({ summary }: KPICardsProps) => {
  const cards = [
    {
      title: 'Total Transactions',
      value: summary?.total ?? 0,
      icon: BarChart3,
      color: 'blue',
      bgColor: 'bg-blue-600/10',
      iconColor: 'text-blue-500',
    },
    {
      title: 'Manual Review',
      value: summary?.manual ?? 0,
      icon: Eye,
      color: 'yellow',
      bgColor: 'bg-yellow-600/10',
      iconColor: 'text-yellow-500',
    },
    {
      title: 'Escalated',
      value: summary?.escalated ?? 0,
      icon: AlertTriangle,
      color: 'red',
      bgColor: 'bg-red-600/10',
      iconColor: 'text-red-500',
    },
    {
      title: 'Avg Risk Score',
      value: summary?.avg_risk ? summary.avg_risk.toFixed(2) : '0.00',
      icon: TrendingUp,
      color: 'purple',
      bgColor: 'bg-emerald-600/10',
      iconColor: 'text-emerald-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-gray-600 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">{card.title}</p>
                <p className="text-3xl font-bold text-white">{card.value}</p>
              </div>
              <div className={`${card.bgColor} p-3 rounded-lg`}>
                <Icon className={`w-6 h-6 ${card.iconColor}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
