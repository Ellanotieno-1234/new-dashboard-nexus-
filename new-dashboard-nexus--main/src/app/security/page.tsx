"use client";
import React, { useState } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function SecurityPage() {
  const { t } = useLanguage();
  // State for password change
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  // State for two-factor authentication
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  // State for active sessions
  const [activeSessions, setActiveSessions] = useState([
    { device: 'Desktop', lastActive: '2025-06-19T11:00:00Z' },
    { device: 'Mobile (iPhone)', lastActive: '2025-06-19T10:45:00Z' },
  ]);

const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle password change logic here
    alert('Password change submitted. In a real app, this would save the changes.');
  };

const handleLogout = (deviceId: string) => {
    // Handle logout logic
    alert(`Logged out session for ${deviceId}`);
    // Remove the session from activeSessions
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 p-6 rounded-lg">
        <h1 className="text-3xl font-bold text-cyan-400 mb-2">{t('security.title')}</h1>
        <p className="text-gray-400 mb-6">{t('security.subtitle')}</p>

        {/* Password Change Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4">{t('security.password.title')}</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-300">{t('security.password.current')}</label>
              <input
                type="password"
                id="currentPassword"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 text-white"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300">{t('security.password.new')}</label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 text-white"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-300">{t('security.password.confirm')}</label>
              <input
                type="password"
                id="confirmNewPassword"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 text-white"
              />
            </div>
            <button
              type="submit"
              className="bg-cyan-600 text-white px-4 py-2 rounded-md hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              {t('security.password.update')}
            </button>
          </form>
        </div>

        {/* Two-Factor Authentication Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4">{t('security.twoFactor.title')}</h2>
          <div className="flex items-center mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={twoFactorEnabled}
                onChange={(e) => setTwoFactorEnabled(e.target.checked)}
                className="h-5 w-5 text-cyan-600 focus:ring-cyan-500 border-gray-600 rounded bg-gray-800"
              />
              <span className="ml-2 text-gray-300">{t('security.twoFactor.enable')}</span>
            </label>
          </div>
          {!twoFactorEnabled && (
            <button className="bg-cyan-600 text-white px-4 py-2 rounded-md hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-900">
              {t('security.twoFactor.setup')}
            </button>
          )}
        </div>

        {/* Active Sessions Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4">{t('security.sessions.title')}</h2>
          <ul>
            {activeSessions.map((session, index) => (
              <li key={index} className="flex justify-between items-center py-2 border-b border-gray-700">
                <div>
                  <span className="font-medium text-gray-300">{session.device}</span>
                  <span className="text-gray-500 ml-2">{t('security.sessions.lastActive')}: {session.lastActive}</span>
                </div>
                <button
                  onClick={() => handleLogout(session.device)}
                  className="text-red-400 hover:text-red-300 focus:outline-none"
                >
                  {t('security.sessions.logout')}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
