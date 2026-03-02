import { useDocuments } from '../../contexts/DocumentContext';
import { 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  Clock,
  TrendingUp,
  Users
} from 'lucide-react';

export function StatsOverview() {
  const { state } = useDocuments();
  const { documents } = state;

  const stats = {
    total: documents.length,
    pending: documents.filter(d => d.status === 'pending' || d.status === 'processing').length,
    review: documents.filter(d => d.status === 'review').length,
    completed: documents.filter(d => d.status === 'completed').length,
    escalated: documents.filter(d => d.status === 'escalated').length,
    critical: documents.filter(d => d.priority === 'critical').length,
  };

  const statCards = [
    {
      label: 'Total Documents',
      value: stats.total,
      icon: <FileText className="w-6 h-6" />,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'Pending',
      value: stats.pending,
      icon: <Clock className="w-6 h-6" />,
      color: 'bg-yellow-500',
      textColor: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      label: 'In Review',
      value: stats.review,
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'bg-purple-500',
      textColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      label: 'Completed',
      value: stats.completed,
      icon: <CheckCircle className="w-6 h-6" />,
      color: 'bg-green-500',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      label: 'Escalated',
      value: stats.escalated,
      icon: <AlertTriangle className="w-6 h-6" />,
      color: 'bg-red-500',
      textColor: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      label: 'Critical Priority',
      value: stats.critical,
      icon: <Users className="w-6 h-6" />,
      color: 'bg-orange-500',
      textColor: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
      {statCards.map((stat) => (
        <div
          key={stat.label}
          className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-2">
            <div className={`${stat.bgColor} ${stat.textColor} p-2 rounded-lg`}>
              {stat.icon}
            </div>
            <span className={`text-2xl font-bold ${stat.textColor}`}>
              {stat.value}
            </span>
          </div>
          <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
