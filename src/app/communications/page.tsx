"use client";
import React, { useState } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function CommunicationsPage() {
  const { t } = useLanguage();
  // State for notification preferences
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);

  // State for message history
  const [messageHistory, setMessageHistory] = useState([
    { type: 'Email', content: 'Weekly report sent', sentDate: '2025-06-19' },
    { type: 'SMS', content: 'Meeting reminder', sentDate: '2025-06-18' },
    { type: 'Push', content: 'New update available', sentDate: '2025-06-17' },
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 p-6 rounded-lg">
        <h1 className="text-3xl font-bold text-cyan-400 mb-2">{t('communications.title')}</h1>
        <p className="text-gray-400 mb-6">{t('communications.subtitle')}</p>

        {/* Notification Preferences Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4">{t('communications.preferences.title')}</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">{t('communications.preferences.email')}</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={emailNotifications} onChange={(e) => setEmailNotifications(e.target.checked)} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">{t('communications.preferences.sms')}</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={smsNotifications} onChange={(e) => setSmsNotifications(e.target.checked)} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Message History Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4">{t('communications.messages.title')}</h2>
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-800/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">{t('communications.messages.type')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">{t('communications.messages.content')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">{t('communications.messages.sentDate')}</th>
              </tr>
            </thead>
            <tbody className="bg-gray-900/30 divide-y divide-gray-700">
              {messageHistory.map((message, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-cyan-400">{message.type}</td>
                  <td className="px-6 py-4 text-sm text-gray-300">{message.content}</td>
                  <td className="px-6 py-4 text-sm text-gray-400">{message.sentDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
