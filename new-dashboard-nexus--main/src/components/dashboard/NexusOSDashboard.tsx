"use client";

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { ComponentType } from 'react';
import type { LucideIcon } from 'lucide-react';

type IconType = ComponentType<{
  size?: number;
  className?: string;
  color?: string;
}> | LucideIcon;
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
  Wrench,
  ClipboardList,
  Hammer
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
  const [mroData, setMroData] = useState<{
    total: number;
    inProgress: number;
    completed: number;
    pending: number;
  }>({
    total: 0,
    inProgress: 0,
    completed: 0,
    pending: 0
  });

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

  const loadMROData = async () => {
    try {
      const response = await fetch('/api/mro/items');
      if (response.ok) {
        const items = await response.json();
        setMroData({
          total: items.length,
          inProgress: items.filter((item: any) => item.progress === "WIP" || item.progress === "ON PROGRESS").length,
          completed: items.filter((item: any) => item.progress === "CLOSED").length,
          pending: items.filter((item: any) => item.progress === "PENDING").length
        });
      }
    } catch (error) {
      console.error("Error fetching MRO data:", error);
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    loadInventory();
    loadMROData();
    
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

  const MenuItem = ({ icon: Icon, label, href, active = false }: { 
    icon: IconType;
    label: string; 
    href: string;
    active?: boolean 
  }) => (
    <Link href={href}>
      <div className={`flex items-center space-x-3 px-4 py-3 rounded-lg cursor-pointer transition-all duration-200 ${
        active 
          ? 'bg-cyan-500/20 text-cyan-400 border-l-2 border-cyan-400' 
          : 'text-gray-400 hover:text-cyan-300 hover:bg-gray-800/50'
      }`}>
        <Icon size={18} />
        <span className="text-sm font-medium">{label}</span>
      </div>
    </Link>
  );

  const MetricCard = ({ title, value, unit, icon: Icon, color = 'cyan', details, trend }: {
    title: string;
    value: number;
    unit: string;
    icon: LucideIcon;
    color?: string;
    details?: string;
    trend?: boolean;
  }) => (
    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:border-cyan-500/30 transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg bg-${color}-500/20`}>
            <Icon size={20} className={`text-${color}-400`} />
          </div>
          <h3 className="text-gray-300 text-sm font-medium">{title}</h3>
        </div>
        {trend && (
          <div className="flex items-center space-x-1">
            <Activity size={14} className="text-cyan-400" />
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

  const QuickAction = ({ icon: Icon, label, href }: {
    icon: IconType;
    label: string;
    href: string;
  }) => (
    <Link href={href}>
      <button className="flex flex-col items-center justify-center p-4 bg-gray-900/50 border border-gray-700/50 rounded-xl hover:border-cyan-500/50 hover:bg-cyan-500/10 transition-all duration-300 group w-full">
        <Icon size={24} className="text-gray-400 group-hover:text-cyan-400 mb-2" />
        <span className="text-xs text-gray-500 group-hover:text-cyan-400">{label}</span>
      </button>
    </Link>
  );

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white font-mono">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Plane size={16} className="text-white" />
            </div>
            <h1 className="text-xl font-bold text-cyan-400 mb-2">{t('dashboard.title')}</h1>
            <p className="text-gray-400">{t('common.loading')}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white font-mono">
      <header className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-700/50 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
                <Plane size={16} className="text-white" />
              </div>
              <h1 className="text-xl font-bold text-cyan-400">{t('dashboard.title')}</h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-4 text-sm">
              <span className="text-gray-400">{t('dashboard.subtitle')}</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                <Eye size={16} className="text-gray-400" />
              </div>
            </div>
            <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"></div>
          </div>
        </div>
      </header>

      <div className="flex">
        <aside className="w-64 bg-gray-900/50 backdrop-blur-sm border-r border-gray-700/50 min-h-screen">
          <div className="p-6 space-y-2">
            <MenuItem icon={Activity} label={t('dashboard.menu.dashboard')} href="/" active />
            <MenuItem icon={Package} label={t('dashboard.menu.inventory')} href="/inventory" />
            <MenuItem icon={FileText} label={t('dashboard.menu.orders')} href="/orders" />
            <MenuItem icon={TrendingUp} label={t('dashboard.menu.analytics')} href="/analytics" />
            <MenuItem icon={Hammer} label={t('dashboard.menu.mro')} href="/mro" />
            <MenuItem icon={Database} label={t('dashboard.menu.dataCenter')} href="/inventory" />
            <MenuItem icon={Network} label={t('dashboard.menu.network')} href="/analytics" />
            <MenuItem icon={Shield} label={t('dashboard.menu.security')} href="/security" />
            <MenuItem icon={Terminal} label={t('dashboard.menu.console')} href="/console" />
            <MenuItem icon={MessageSquare} label={t('dashboard.menu.communications')} href="/communications" />
            <MenuItem icon={Settings} label={t('dashboard.menu.settings')} href="/settings" />
          </div>

          <div className="px-6 py-4 border-t border-gray-700/50">
            <h3 className="text-gray-400 text-xs uppercase tracking-wider mb-4">{t('dashboard.metrics.systemStatus')}</h3>
            <div className="space-y-2">
              <SystemStatus label={t('dashboard.metrics.coreSystems')} value={82} color="green" />
              <SystemStatus label={t('dashboard.metrics.security')} value={75} color="yellow" />
              <SystemStatus label={t('dashboard.metrics.network')} value={85} color="cyan" />
            </div>
          </div>
        </aside>

        <main className="flex-1 p-6">
          {apiError && (
            <div className="mb-6 p-4 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertTriangle size={16} className="text-yellow-400" />
                <span className="text-yellow-400 text-sm">API connection unavailable. {t('dashboard.status.demo')}</span>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Activity size={24} className="text-cyan-400" />
              <h2 className="text-2xl font-bold text-white">{t('dashboard.title')}</h2>
              <div className="flex items-center space-x-2 px-3 py-1 bg-cyan-500/20 rounded-full">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                <span className="text-cyan-400 text-sm font-medium">{t('dashboard.status.live')}</span>
              </div>
              <button 
                onClick={() => loadInventory()}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <RotateCcw size={16} className="text-gray-400" />
              </button>
            </div>
            
            <div className="text-right">
              <div className="text-gray-400 text-sm">{t('dashboard.status.systemTime')}</div>
              <div className="text-3xl font-bold text-cyan-400">{formatTime(currentTime)}</div>
              <div className="text-gray-500 text-sm">{formatDate(currentTime)}</div>
            </div>
          </div>

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
            <MetricCard
              title={t('dashboard.mro.title')}
              value={mroData?.total || 0}
              unit={t('dashboard.mro.items')}
              icon={Wrench}
              color="purple"
              details={`${mroData?.inProgress || 0} in progress`}
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
                <CheckCircle size={20} className="text-green-400" />
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
                <AlertTriangle size={20} className="text-yellow-400" />
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
            <QuickAction icon={Hammer} label={t('dashboard.menu.mro')} href="/mro" />
            <QuickAction icon={ClipboardList} label={t('dashboard.menu.addMro')} href="/mro/new" />
            <QuickAction icon={TrendingUp} label={t('dashboard.menu.analytics')} href="/analytics" />
            <QuickAction icon={Download} label={t('dashboard.quickActions.export')} href="/" />
          </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default NexusOSDashboard;
