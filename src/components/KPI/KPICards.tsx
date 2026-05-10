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
      bgColor: 'bg-primary/10',
      iconColor: 'text-primary',
    },
    {
      title: 'Manual Review',
      value: summary?.manual ?? 0,
      icon: Eye,
      bgColor: 'bg-warning/10',
      iconColor: 'text-warning',
    },
    {
      title: 'Escalated',
      value: summary?.escalated ?? 0,
      icon: AlertTriangle,
      bgColor: 'bg-danger/10',
      iconColor: 'text-danger',
    },
    {
      title: 'Avg Risk Score',
      value: summary?.avg_risk ? summary.avg_risk.toFixed(2) : '0.00',
      icon: TrendingUp,
      bgColor: 'bg-success/10',
      iconColor: 'text-success',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className="bg-surface border border-borderLight rounded-lg p-6 hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-secondaryText mb-1">
                  {card.title}
                </p>
                <p className="text-3xl font-bold text-primaryText">
                  {card.value}
                </p>
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