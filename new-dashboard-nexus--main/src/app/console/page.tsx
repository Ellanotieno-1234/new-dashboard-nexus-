"use client";
import React, { useState } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

// Helper to safely display values and avoid NaN/undefined/null in UI
function safeDisplay(value: any, fallback = '-') {
  if (typeof value === 'number' && isNaN(value)) return fallback;
  if (value === undefined || value === null || value === '') return fallback;
  return value;
}

export default function ConsolePage() {
  const { t, language } = useLanguage();
  // State for system metrics (example data)
  const [uptime, setUptime] = useState('10 days, 12 hours');
  const [errorCount, setErrorCount] = useState(12);
  const [apiRequestCount, setApiRequestCount] = useState(1542);

  // State for recent logs (example data)
  const [recentLogs, setRecentLogs] = useState([
    { eventType: 'ERROR', timestamp: '2025-06-19T11:00:00Z', message: 'Failed login attempt' },
    { eventType: 'INFO', timestamp: '2025-06-19T10:55:00Z', message: 'API request received' },
    { eventType: 'WARN', timestamp: '2025-06-19T10:50:00Z', message: 'High CPU usage' },
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 p-6 rounded-lg">
        <h1 className="text-3xl font-bold text-cyan-400 mb-2">{t('console.title')}</h1>
        <p className="text-gray-400 mb-6">{t('console.subtitle')}</p>

        {/* System Status Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4">{t('console.metrics.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-800/50 border border-gray-700/50 p-4 rounded-lg">
              <p className="text-cyan-400 font-medium">{t('console.metrics.uptime')}</p>
              <p className="text-2xl font-bold text-cyan-400">{safeDisplay(uptime)}</p>
            </div>
            <div className="bg-gray-800/50 border border-gray-700/50 p-4 rounded-lg">
              <p className="text-red-400 font-medium">{t('console.metrics.errors')}</p>
              <p className="text-2xl font-bold text-red-400">{safeDisplay(errorCount)}</p>
            </div>
            <div className="bg-gray-800/50 border border-gray-700/50 p-4 rounded-lg">
              <p className="text-cyan-400 font-medium">{t('console.metrics.requests')}</p>
              <p className="text-2xl font-bold text-cyan-400">{safeDisplay(apiRequestCount)}</p>
            </div>
          </div>
        </div>

        {/* Recent Logs Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4">{t('console.logs.title')}</h2>
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-800/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">{t('console.logs.eventType')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">{t('console.logs.timestamp')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">{t('console.logs.message')}</th>
              </tr>
            </thead>
            <tbody className="bg-gray-900/30 divide-y divide-gray-700">
              {recentLogs.map((log, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${log.eventType === 'ERROR' ? 'bg-red-900/50 text-red-300' : log.eventType === 'WARN' ? 'bg-yellow-900/50 text-yellow-300' : 'bg-green-900/50 text-green-300'}`}>
                      {log.eventType}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{log.timestamp}</td>
                  <td className="px-6 py-4 text-sm text-gray-300">{log.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
