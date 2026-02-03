import { Card, CardContent } from '@/components/ui/card';
import { Package, CheckCircle2, Clock, MapPin } from 'lucide-react';
import type { OrderStats } from '@/types/order';

interface StatsPanelProps {
  stats: OrderStats | null;
}

export function StatsPanel({ stats }: StatsPanelProps) {
  if (!stats) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
              <div className="h-8 bg-muted rounded w-1/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const statItems = [
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Paid Orders',
      value: stats.paidOrders,
      icon: CheckCircle2,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Unpaid Orders',
      value: stats.unpaidOrders,
      icon: Clock,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
    },
    {
      title: 'Avg Distance',
      value: `${stats.avgDistance.toFixed(1)} km`,
      icon: MapPin,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statItems.map((item) => (
        <Card key={item.title} className="overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {item.title}
                </p>
                <p className="text-2xl font-bold mt-1">{item.value}</p>
              </div>
              <div className={`${item.bgColor} p-3 rounded-full`}>
                <item.icon className={`h-5 w-5 ${item.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
