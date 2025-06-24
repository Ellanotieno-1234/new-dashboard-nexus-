"use client";
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import type { LucideIcon } from 'lucide-react';
import { IconWrapper } from '@/components/common/IconWrapper';
import {
  Cpu, 
  HardDrive, 
  Wifi, 
  Shield, 
  Terminal, 
  Settings, 
  Database,
  Network,
  MessageSquare,
  Activity,
  Eye,
  RotateCcw,
  Download,
  Play,
  AlertTriangle,
  CheckCircle,
  Clock,
  Package,
  FileText,
  TrendingUp,
  Plane,
  Wrench
} from 'lucide-react';
import Link from 'next/link';

interface InventoryItem {
  id: number;
  part_number: string;
  name: string;
  category: string;
  in_stock: number;
  min_required: number;
  on_order: number;
  last_updated: string;
}

// Mock data for when API is not available
const mockInventory: InventoryItem[] = [
  {
    id: 1,
    part_number: "AP-001",
    name: "Aircraft Engine Filter",
    category: "Engine",
    in_stock: 45,
    min_required: 20,
    on_order: 15,
    last_updated: "2024-01-15"
  },
  {
    id: 2,
    part_number: "AP-002",
    name: "Landing Gear Assembly",
    category: "Landing Gear",
    in_stock: 8,
    min_required: 10,
    on_order: 5,
    last_updated: "2024-01-14"
  },
  {
    id: 3,
    part_number: "AP-003",
    name: "Avionics Display Unit",
    category: "Avionics",
    in_stock: 12,
    min_required: 15,
    on_order: 8,
    last_updated: "2024-01-13"
  },
  {
    id: 4,
    part_number: "AP-004",
    name: "Hydraulic Pump",
    category: "Hydraulics",
    in_stock: 25,
    min_required: 30,
    on_order: 12,
    last_updated: "2024-01-12"
  }
];

interface MenuItemProps {
  icon: LucideIcon;
  label: string;
  href: string;
  active?: boolean;
}

interface MetricCardProps {
  title: string;
  value: number;
  unit: string;
  icon: LucideIcon;
  color?: string;
  details?: string;
  trend?: boolean;
}

interface QuickActionProps {
  icon: LucideIcon;
  label: string;
  href: string;
}

const NexusOSDashboard = () => {
  const { t, language } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [cpuUsage, setCpuUsage] = useState(48);
  const [memoryUsage, setMemoryUsage] = useState(63);
  const [networkUsage, setNetworkUsage] = useState(85);
  const [systemLoad, setSystemLoad] = useState(48);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(false);

  // Load inventory data with fallback to mock data
  const loadInventory = async () => {
    try {
      const { fetchInventory } = await import('@/lib/api');
      const data = await fetchInventory();
      setInventory(data && data.length > 0 ? data : mockInventory);
      setApiError(false);
    } catch (err) {
      console.warn('API not available, using mock data:', err);
      setInventory(mockInventory);
      setApiError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    loadInventory();
    
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      setCpuUsage((prev: number) => Math.max(20, Math.min(90, prev + (Math.random() - 0.5) * 10)));
      setMemoryUsage((prev: number) => Math.max(30, Math.min(95, prev + (Math.random() - 0.5) * 8)));
      setNetworkUsage((prev: number) => Math.max(40, Math.min(100, prev + (Math.random() - 0.5) * 12)));
      setSystemLoad((prev: number) => Math.max(25, Math.min(80, prev + (Math.random() - 0.5) * 6)));
    }, 2000);

    return () => clearInterval(timer);
  }, [mounted]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString(language, { 
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString(language, {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Calculate inventory metrics
  const totalParts = inventory.length;
  const lowStockItems = inventory.filter(item => item.in_stock < item.min_required).length;
  const totalInStock = inventory.reduce((sum, item) => sum + item.in_stock, 0);
  const totalOnOrder = inventory.reduce((sum, item) => sum + item.on_order, 0);

  const MenuItem = ({ icon: Icon, label, href, active = false }: MenuItemProps) => (
    <Link href={href}>
      <div className={`flex items-center space-x-3 px-4 py-3 rounded-lg cursor-pointer transition-all duration-200 ${
        active 
          ? 'bg-cyan-500/20 text-cyan-400 border-l-2 border-cyan-400' 
          : 'text-gray-400 hover:text-cyan-300 hover:bg-gray-800/50'
      }`}>
        <IconWrapper icon={Icon} size={18} />
        <span className="text-sm font-medium">{label}</span>
      </div>
    </Link>
  );

  const MetricCard = ({ title, value, unit, icon, color = 'cyan', details, trend }: MetricCardProps) => (
    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:border-cyan-500/30 transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg bg-${color}-500/20`}>
            <IconWrapper icon={icon} size={20} className={`text-${color}-400`} />
          </div>
          <h3 className="text-gray-300 text-sm font-medium">{title}</h3>
        </div>
        {trend && (
          <div className="flex items-center space-x-1">
            <IconWrapper icon={Activity} size={14} className="text-cyan-400" />
            <span className="text-xs text-cyan-400">{t('dashboard.status.live')}</span>
          </div>
        )}
      </div>
      <div className="space-y-2">
        <div className="flex items-baseline space-x-2">
          <span className={`text-3xl font-bold text-${color}-400`}>{value}</span>
          <span className="text-gray-500 text-sm">{unit}</span>
        </div>
        {details && <p className="text-gray-500 text-xs">{details}</p>}
      </div>
    </div>
  );

  const ProgressBar = ({ value, color = 'cyan', height = 'h-2' }: {
    value: number;
    color?: string;
    height?: string;
  }) => (
    <div className={`w-full bg-gray-800 rounded-full ${height} overflow-hidden`}>
      <div 
        className={`bg-gradient-to-r from-${color}-600 to-${color}-400 ${height} rounded-full transition-all duration-1000 ease-out relative`}
        style={{ width: `${value}%` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
      </div>
    </div>
  );

  const SystemStatus = ({ label, value, color = 'green' }: {
    label: string;
    value: number;
    color?: string;
  }) => (
    <div className="flex items-center justify-between py-2">
      <span className="text-gray-400 text-sm">{label}</span>
      <div className="flex items-center space-x-2">
        <span className={`text-${color}-400 text-sm font-medium`}>{value}%</span>
        <ProgressBar value={value} color={color} height="h-1" />
      </div>
    </div>
  );

  const QuickAction = ({ icon, label, href }: QuickActionProps) => (
    <Link href={href}>
      <button className="flex flex-col items-center justify-center p-4 bg-gray-900/50 border border-gray-700/50 rounded-xl hover:border-cyan-500/50 hover:bg-cyan-500/10 transition-all duration-300 group w-full">
        <IconWrapper icon={icon} size={24} className="text-gray-400 group-hover:text-cyan-400 mb-2" />
        <span className="text-xs text-gray-500 group-hover:text-cyan-400">{label}</span>
      </button>
    </Link>
  );

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white font-mono">
        <div className="text-center">
          <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center mx-auto mb-4">
            <IconWrapper icon={Plane} size={16} className="text-white" />
          </div>
          <h1 className="text-xl font-bold text-cyan-400 mb-2">{t('dashboard.title')}</h1>
          <p className="text-gray-400">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Dashboard Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title={t('inventory.items.title')}
          value={totalParts}
          unit={t('dashboard.inventoryStatus.items')}
          icon={Package}
          color="cyan"
          details={t('dashboard.metrics.systemStatus')}
          trend
        />
        <MetricCard
          title={t('inventory.overview.title')}
          value={totalInStock}
          unit={t('dashboard.inventoryStatus.items')}
          icon={HardDrive}
          color="green"
          details={t('dashboard.inventoryStatus.stockLevel')}
          trend
        />
        <MetricCard
          title={t('orders.recent.title')}
          value={totalOnOrder}
          unit={t('dashboard.inventoryStatus.pending')}
          icon={Download}
          color="purple"
          details={t('dashboard.inventoryStatus.orderStatus')}
          trend
        />
        <MetricCard
          title={t('dashboard.securityStatus.title')}
          value={lowStockItems}
          unit={t('dashboard.inventoryStatus.items')}
          icon={AlertTriangle}
          color="yellow"
          details={t('dashboard.alerts.lowStock').replace('{count}', lowStockItems.toString())}
          trend
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* System Performance */}
        <div className="lg:col-span-2 bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <h3 className="text-white font-semibold">{t('dashboard.performance.title')}</h3>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-cyan-400 rounded-full"></div>
                  <span className="text-gray-400">{t('dashboard.performance.metrics.cpu')}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                  <span className="text-gray-400">{t('dashboard.performance.metrics.memory')}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <span className="text-gray-400">{t('dashboard.performance.metrics.network')}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Performance Chart */}
          <div className="h-48 flex items-end justify-center space-x-2">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="flex flex-col items-center space-y-1">
                <div className="w-8 bg-gray-800 rounded-t relative" style={{ height: '120px' }}>
                  <div 
                    className="absolute bottom-0 w-full bg-gradient-to-t from-cyan-600 to-cyan-400 rounded-t"
                    style={{ height: `${mounted ? Math.random() * 80 + 10 : 50}%` }}
                  ></div>
                </div>
                <span className="text-xs text-gray-500">{String(i * 2).padStart(2, '0')}:00</span>
              </div>
            ))}
          </div>
        </div>

        {/* Security Status */}
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <IconWrapper icon={CheckCircle} size={20} className="text-green-400" />
            <h3 className="text-white font-semibold">{t('dashboard.securityStatus.title')}</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-sm">{t('dashboard.securityStatus.firewall')}</span>
              <span className="text-green-400 text-sm">{t('dashboard.securityStatus.firewallStatus')}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-sm">{t('dashboard.securityStatus.encryption')}</span>
              <span className="text-green-400 text-sm">{t('dashboard.securityStatus.encryptionStatus')}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-sm">{t('dashboard.securityStatus.threatLevel')}</span>
              <span className="text-green-400 text-sm">{t('dashboard.securityStatus.threatStatus')}</span>
            </div>
          </div>
        </div>

        {/* System Alerts */}
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <IconWrapper icon={AlertTriangle} size={20} className="text-yellow-400" />
            <h3 className="text-white font-semibold">{t('dashboard.alerts.title')}</h3>
          </div>
          <div className="space-y-3">
            {lowStockItems > 0 ? (
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <span className="text-gray-400 text-sm">
                  {t('dashboard.alerts.lowStock').replace('{count}', lowStockItems.toString())}
                </span>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-gray-400 text-sm">{t('dashboard.alerts.normalStock')}</span>
              </div>
            )}
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span className="text-gray-400 text-sm">{t('dashboard.alerts.systemUpdate')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
        <h3 className="text-white font-semibold mb-4">{t('dashboard.quickActions.title')}</h3>
        <div className="grid grid-cols-2 gap-3">
          <QuickAction icon={Package} label={t('dashboard.menu.inventory')} href="/inventory" />
          <QuickAction icon={FileText} label={t('dashboard.menu.orders')} href="/orders" />
          <QuickAction icon={TrendingUp} label={t('dashboard.menu.analytics')} href="/analytics" />
          <QuickAction icon={Download} label={t('dashboard.quickActions.export')} href="/" />
        </div>
      </div>
    </div>
  );
};

export default NexusOSDashboard;
