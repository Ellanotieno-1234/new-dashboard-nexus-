"use client";
import React, { useState } from 'react';
import { useTheme } from 'next-themes';
import { CheckCircle, Globe } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { languages, LanguageCode } from '@/lib/i18n/languages';

export default function SettingsPage() {
  // State for profile information
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    timezone: 'Africa/Nairobi'
  });

  // State for save notification
  const [showSaveNotification, setShowSaveNotification] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Theme
  const { theme, setTheme } = useTheme();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSaveNotification(true);
    setTimeout(() => {
      setShowSaveNotification(false);
    }, 3000);
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleThemeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTheme(e.target.checked ? 'dark' : 'light');
  };

  const { language, setLanguage, t } = useLanguage();

  // Handle hydration mismatch
  if (!mounted) {
    return null;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-cyan-400 mb-2">{t('settings.title')}</h1>
      <p className="text-gray-400 mb-6">{t('settings.subtitle')}</p>

      {/* Profile Information Section */}
      <div className="mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4">{t('settings.profile.title')}</h2>
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300">{t('settings.profile.name')}</label>
              <input
                type="text"
                id="name"
                name="name"
                value={profile.name}
                onChange={handleProfileChange}
                className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 text-white"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">{t('settings.profile.email')}</label>
              <input
                type="email"
                id="email"
                name="email"
                value={profile.email}
                onChange={handleProfileChange}
                className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 text-white"
              />
            </div>
            <div className="flex items-center justify-between pt-4">
              <button
                type="submit"
                className="bg-cyan-600 text-white px-4 py-2 rounded-md hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-900 flex items-center space-x-2"
              >
                {t('common.save')}
              </button>
              {showSaveNotification && (
                <div className="flex items-center space-x-2 text-green-400">
                  <CheckCircle size={16} />
                  <span>{t('common.saved')}</span>
                </div>
              )}
            </div>
          </form>
      </div>

      {/* Account Preferences Section */}
      <div className="mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4">{t('settings.preferences.title')}</h2>
        <div className="space-y-4">
          <div>
              <label htmlFor="language" className="block text-sm font-medium text-gray-300">{t('settings.preferences.language')}</label>
              <div className="relative">
                <select
                  id="language"
                  name="language"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as LanguageCode)}
                  className="mt-1 block w-full pl-10 pr-10 py-2 text-base bg-gray-800 border border-gray-600 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm rounded-md text-white"
                >
                  {Object.entries(languages).map(([code, lang]) => (
                    <option key={code} value={code}>
                      {lang.native} ({lang.name[language as keyof typeof lang.name]})
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-1">
                  <Globe size={16} className="text-gray-400" />
                </div>
              </div>
          </div>
          <div className="flex items-center">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                id="darkMode"
                name="darkMode"
                checked={theme === 'dark'}
                onChange={handleThemeChange}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
              <span className="ml-3 text-sm font-medium text-gray-300">{t('settings.preferences.darkMode')}</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
