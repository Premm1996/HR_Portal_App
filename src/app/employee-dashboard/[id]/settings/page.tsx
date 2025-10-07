'use client';

import React, { useState } from 'react';
import { User, Bell, Shield, Palette, Save } from 'lucide-react';

export default function SettingsPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState('profile');
  const [settings, setSettings] = useState({
    profile: {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: '30'
    },
    appearance: {
      theme: 'dark',
      language: 'en'
    }
  });

  const handleSettingChange = (category: string, setting: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [setting]: value
      }
    }));
  };

  const handleSave = () => {
    // Implement save logic
    console.log('Saving settings:', settings);
  };

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6 bg-[#1E2A44] p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center space-x-2 flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'profile' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Profile</span>
        </button>
        <button
          onClick={() => setActiveTab('notifications')}
          className={`flex items-center space-x-2 flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'notifications' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Notifications</span>
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`flex items-center space-x-2 flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'security' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Security</span>
        </button>
        <button
          onClick={() => setActiveTab('appearance')}
          className={`flex items-center space-x-2 flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'appearance' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>Appearance</span>
        </button>
      </div>

      {/* Profile Settings */}
      {activeTab === 'profile' && (
        <div className="bg-[#1E2A44] rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-6">Profile Settings</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Account Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Display Name</label>
                  <input
                    type="text"
                    defaultValue="John Doe"
                    className="w-full bg-[#15253B] border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Email</label>
                  <input
                    type="email"
                    defaultValue="john.doe@truerize.com"
                    className="w-full bg-[#15253B] border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notification Settings */}
      {activeTab === 'notifications' && (
        <div className="bg-[#1E2A44] rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-6">Notification Preferences</h2>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Email Notifications</h3>
                <p className="text-sm text-slate-400">Receive notifications via email</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.profile.emailNotifications}
                  onChange={(e) => handleSettingChange('profile', 'emailNotifications', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">SMS Notifications</h3>
                <p className="text-sm text-slate-400">Receive notifications via SMS</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.profile.smsNotifications}
                  onChange={(e) => handleSettingChange('profile', 'smsNotifications', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Push Notifications</h3>
                <p className="text-sm text-slate-400">Receive push notifications in browser</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.profile.pushNotifications}
                  onChange={(e) => handleSettingChange('profile', 'pushNotifications', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Security Settings */}
      {activeTab === 'security' && (
        <div className="bg-[#1E2A44] rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-6">Security Settings</h2>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Two-Factor Authentication</h3>
                <p className="text-sm text-slate-400">Add an extra layer of security to your account</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.security.twoFactorAuth}
                  onChange={(e) => handleSettingChange('security', 'twoFactorAuth', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Session Timeout (minutes)</label>
              <select
                value={settings.security.sessionTimeout}
                onChange={(e) => handleSettingChange('security', 'sessionTimeout', e.target.value)}
                className="w-full bg-[#15253B] border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="60">1 hour</option>
                <option value="120">2 hours</option>
              </select>
            </div>
            <div>
              <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors">
                Change Password
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Appearance Settings */}
      {activeTab === 'appearance' && (
        <div className="bg-[#1E2A44] rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-6">Appearance Settings</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Theme</label>
              <select
                value={settings.appearance.theme}
                onChange={(e) => handleSettingChange('appearance', 'theme', e.target.value)}
                className="w-full bg-[#15253B] border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="dark">Dark</option>
                <option value="light">Light</option>
                <option value="auto">Auto</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Language</label>
              <select
                value={settings.appearance.language}
                onChange={(e) => handleSettingChange('appearance', 'language', e.target.value)}
                className="w-full bg-[#15253B] border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Save Button */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSave}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center transition-colors"
        >
          <Save className="w-4 h-4 mr-2" />
          Save Settings
        </button>
      </div>
    </div>
  );
}
