'use client';

import React from 'react';
import { 
  Activity, Eye, Plane, Package, FileText, TrendingUp, Database, Network, Shield, 
  Terminal, MessageSquare, Settings, HardDrive, Wifi, Cpu, Download, AlertTriangle,
  CheckCircle, Clock, RotateCcw
} from 'lucide-react';
import { Wrench } from 'lucide-react';
import Link from 'next/link';

const MenuItem = ({ icon: Icon, label, href, active = false }: { 
  icon: React.ElementType; 
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

const MetricCard = ({ title, value, unit, icon: Icon, color = 'cyan', details, trend }: {
  title: string;
  value: number;
  unit: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
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
          <span className="text-xs text-cyan-400">LIVE</span>
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

const QuickAction = ({ icon: Icon, label, href }: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
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

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white font-mono">
      {/* Header */}
      <header className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-700/50 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
                <Plane size={16} className="text-white" />
              </div>
              <h1 className="text-xl font-bold text-cyan-400">KENYA AIRWAYS NEXUS</h1>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-4 text-sm">
              <span className="text-gray-400">Aviation Parts System</span>
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
        {/* Sidebar */}
        <aside className="w-64 bg-gray-900/50 backdrop-blur-sm border-r border-gray-700/50 min-h-screen">
          <div className="p-6 space-y-2">
            <MenuItem icon={Activity} label="Dashboard" href="/" />
            <MenuItem icon={Package} label="Inventory" href="/inventory" />
            <MenuItem icon={FileText} label="Orders" href="/orders" />
            <MenuItem icon={TrendingUp} label="Analytics" href="/analytics" />
            <MenuItem icon={Wrench} label="MRO" href="/mro" />
            <MenuItem icon={Shield} label="Security" href="/security" />
            <MenuItem icon={Terminal} label="Console" href="/console" />
            <MenuItem icon={MessageSquare} label="Communications" href="/communications" />
            <MenuItem icon={Settings} label="Settings" href="/settings" />
          </div>
          {/* System Status */}
          <div className="px-6 py-4 border-t border-gray-700/50">
            <h3 className="text-gray-400 text-xs uppercase tracking-wider mb-4">System Status</h3>
            <div className="space-y-2">
              <SystemStatus label="Core Systems" value={82} color="green" />
              <SystemStatus label="Security" value={75} color="yellow" />
              <SystemStatus label="Network" value={85} color="cyan" />
            </div>
          </div>
        </aside>
        {/* Main Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
