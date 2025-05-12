"use client";

import { useState, useEffect } from 'react';
import DeviceList from '@/components/DeviceList';
import ReportList from '@/components/ReportList';
import UserList from '@/components/UserList';
import { useRouter } from 'next/navigation';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('devices');
  const [summary, setSummary] = useState({ devices: 0, activeReports: 0, resolvedReports: 0 });
  const router = useRouter();

  useEffect(() => {
    // Route protection: check session
    const adminSession = localStorage.getItem('adminSession');
    if (!adminSession) {
      router.replace('/login');
      return;
    }
  }, [router]);

  useEffect(() => {
    // Fetch summary data
    async function fetchSummary() {
      const [devicesRes, webReportsRes, mobileReportsRes] = await Promise.all([
        fetch('/api/devices'),
        fetch('/api/report'),
        fetch('/api/mobile/report'),
      ]);
      const devices = await devicesRes.json();
      let webReports = await webReportsRes.json();
      let mobileReports = await mobileReportsRes.json();
      // Eğer hata dönerse veya dizi değilse boş dizi ata
      if (!Array.isArray(webReports)) webReports = [];
      if (!Array.isArray(mobileReports)) mobileReports = [];
      // status alanı olmayanlara default değer ata
      webReports = webReports.map(r => ({ ...r, status: r.status || 'Unknown' }));
      mobileReports = mobileReports.map(r => ({ ...r, status: r.status || 'Unknown' }));
      const allReports = [...webReports, ...mobileReports];
      setSummary({
        devices: Array.isArray(devices) ? devices.length : 0,
        activeReports: allReports.filter(r => r.status !== 'Resolved').length,
        resolvedReports: allReports.filter(r => r.status === 'Resolved').length,
      });
    }
    fetchSummary();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminSession');
    router.replace('/welcome');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-8">
          <div className="text-2xl font-bold text-red-600 tracking-tight">FireX Admin</div>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/80 p-6 rounded-lg shadow flex flex-col items-center">
            <span className="text-lg font-medium text-gray-900">Total Devices</span>
            <span className="text-4xl font-bold text-red-500 mt-2">{summary.devices}</span>
          </div>
          <div className="bg-white/80 p-6 rounded-lg shadow flex flex-col items-center">
            <span className="text-lg font-medium text-gray-900">Active Reports</span>
            <span className="text-4xl font-bold text-red-500 mt-2">{summary.activeReports}</span>
          </div>
          <div className="bg-white/80 p-6 rounded-lg shadow flex flex-col items-center">
            <span className="text-lg font-medium text-gray-900">Resolved Reports</span>
            <span className="text-4xl font-bold text-red-500 mt-2">{summary.resolvedReports}</span>
          </div>
        </div>
        {/* Navigation Bar */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="flex -mb-px overflow-x-auto gap-2">
            <button
              onClick={() => setActiveTab('devices')}
              className={`px-6 py-3 text-sm font-medium whitespace-nowrap rounded-t-lg ${
                activeTab === 'devices'
                  ? 'border-b-2 border-red-500 text-red-500 bg-white'
                  : 'text-gray-500 hover:text-gray-700 bg-transparent'
              }`}
            >
              Devices
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`px-6 py-3 text-sm font-medium whitespace-nowrap rounded-t-lg ${
                activeTab === 'reports'
                  ? 'border-b-2 border-red-500 text-red-500 bg-white'
                  : 'text-gray-500 hover:text-gray-700 bg-transparent'
              }`}
            >
              Reports
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-6 py-3 text-sm font-medium whitespace-nowrap rounded-t-lg ${
                activeTab === 'users'
                  ? 'border-b-2 border-red-500 text-red-500 bg-white'
                  : 'text-gray-500 hover:text-gray-700 bg-transparent'
              }`}
            >
              Users
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-6 py-3 text-sm font-medium whitespace-nowrap rounded-t-lg ${
                activeTab === 'settings'
                  ? 'border-b-2 border-red-500 text-red-500 bg-white'
                  : 'text-gray-500 hover:text-gray-700 bg-transparent'
              }`}
            >
              Settings
            </button>
          </nav>
        </div>
        {/* Content Area */}
        <div className="p-6 bg-white/80 rounded-2xl shadow-lg">
          {activeTab === 'devices' && <DeviceList />}
          {activeTab === 'reports' && <ReportList />}
          {activeTab === 'users' && <UserList />}
          {activeTab === 'settings' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Settings</h2>
              <div className="bg-white/70 p-6 rounded-lg shadow mb-4">
                <p className="text-gray-500">This section allows you to manage the site name and email notification settings. <b>Currently, this is for display only and not connected to the backend.</b></p>
              </div>
              <div className="bg-white/70 p-6 rounded-lg shadow">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Site Name</label>
                    <input
                      type="text"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                      defaultValue="FireX"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email Notifications</label>
                    <div className="mt-2">
                      <label className="inline-flex items-center">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-red-500 focus:ring-red-500"
                        />
                        <span className="ml-2">Enable email notifications</span>
                      </label>
                    </div>
                  </div>
                  <div>
                    <button className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 