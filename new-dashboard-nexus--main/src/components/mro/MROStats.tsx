"use client";

import { useMemo } from "react";
import { Card } from "../../components/ui/card";
import { LoadingCardGrid } from "../../components/ui/loading-card";
import { Activity, CheckCircle, Clock, AlertTriangle, Wrench, ShieldAlert, Cog, Ruler } from "lucide-react";
import { Category, Progress, CATEGORIES, getCategoryColor } from "../../types/mro";
import { useMROData } from "../../hooks/useMROData";
import styles from "./animations.module.css";

const getCategoryIcon = (category: Category) => {
  switch (category) {
    case 'MECHANICAL':
      return <Wrench className="w-4 h-4 text-blue-400" />;
    case 'SAFETY COMPONENTS':
      return <ShieldAlert className="w-4 h-4 text-red-400" />;
    case 'PLANT AND EQUIPMENTS':
      return <Cog className="w-4 h-4 text-green-400" />;
    case 'CALIBRATION':
      return <Activity className="w-4 h-4 text-yellow-400" />;
    case 'STRUCTURAL':
      return <Ruler className="w-4 h-4 text-purple-400" />;
  }
};

const StatCard = ({ icon, title, value, valueColor }: { 
  icon: React.ReactNode;
  title: string;
  value: number;
  valueColor: string;
}) => (
  <Card className="p-6 bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 hover:bg-gray-900/60 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:shadow-gray-900/20">
    <div className="flex items-center space-x-2">
      {icon}
      <h3 className="text-sm font-medium text-gray-300">{title}</h3>
    </div>
    <p className={`mt-2 text-3xl font-bold ${valueColor}`}>{value}</p>
  </Card>
);

export function MROStats() {
  const { items, isLoading, error } = useMROData();

  const stats = useMemo(() => {
    const result = {
      total: items.length,
      inProgress: items.filter(item => 
        item.progress === "WIP" || item.progress === "ON PROGRESS"
      ).length,
      completed: items.filter(item => 
        item.progress === "CLOSED"
      ).length,
      pending: items.filter(item => 
        item.progress === "PENDING"
      ).length,
      categories: {} as Record<Category, number>
    };

    // Initialize categories with 0
    CATEGORIES.forEach(category => {
      result.categories[category] = 0;
    });

    // Count items by category
    items.forEach(item => {
      if (item.category) {
        result.categories[item.category]++;
      }
    });

    return result;
  }, [items]);

  if (isLoading) {
    return <LoadingCardGrid count={8} />;
  }

  if (error) {
    return (
      <Card className={`p-6 bg-red-900/10 border-red-500/50 text-red-200 ${styles.error}`}>
        <div className="flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5" />
          <p>{error}</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <div className={`grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 ${styles.statsGrid}`}>
        <StatCard
          icon={<Activity className="w-4 h-4 text-blue-400" />}
          title="Total Items"
          value={stats.total}
          valueColor="text-blue-400"
        />
        <StatCard
          icon={<Clock className="w-4 h-4 text-yellow-400" />}
          title="In Progress"
          value={stats.inProgress}
          valueColor="text-yellow-400"
        />
        <StatCard
          icon={<CheckCircle className="w-4 h-4 text-green-400" />}
          title="Completed"
          value={stats.completed}
          valueColor="text-green-400"
        />
        <StatCard
          icon={<AlertTriangle className="w-4 h-4 text-red-400" />}
          title="Pending"
          value={stats.pending}
          valueColor="text-red-400"
        />
      </div>

      <div className={`grid gap-4 grid-cols-1 md:grid-cols-3 lg:grid-cols-5 ${styles.statsGrid}`}>
        {(Object.entries(stats.categories) as [Category, number][]).map(([category, count]) => (
          <StatCard
            key={category}
            icon={getCategoryIcon(category)}
            title={category}
            value={count}
            valueColor={getCategoryColor(category)}
          />
        ))}
      </div>
    </div>
  );
}
