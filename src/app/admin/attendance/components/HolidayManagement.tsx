'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

interface Holiday {
  id: number;
  name: string;
  date: string;
  type: 'national' | 'regional' | 'company';
  description?: string;
}

export default function HolidayManagement() {
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingHoliday, setEditingHoliday] = useState<Holiday | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    type: 'company' as 'national' | 'regional' | 'company',
    description: ''
  });

  useEffect(() => {
    fetchHolidays();
  }, []);

  const fetchHolidays = async () => {
    try {
      const response = await axios.get('/api/admin/holidays');
      setHolidays(response.data);
    } catch (error) {
      console.error('Error fetching holidays:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingHoliday) {
        await axios.put(`/api/admin/holidays/${editingHoliday.id}`, formData);
      } else {
        await axios.post('/api/admin/holidays', formData);
      }
      fetchHolidays();
      setShowForm(false);
      setEditingHoliday(null);
      setFormData({ name: '', date: '', type: 'company', description: '' });
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to save holiday');
    }
  };

  const handleEdit = (holiday: Holiday) => {
    setEditingHoliday(holiday);
    setFormData({
      name: holiday.name,
      date: holiday.date.split('T')[0],
      type: holiday.type,
      description: holiday.description || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this holiday?')) return;
    try {
      await axios.delete(`/api/admin/holidays/${id}`);
      fetchHolidays();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to delete holiday');
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'national': return 'bg-red-100 text-red-800';
      case 'regional': return 'bg-blue-100 text-blue-800';
      case 'company': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Holiday Management</h3>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
        >
          Add Holiday
        </button>
      </div>

      {/* Holiday Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50"
        >
          <h4 className="text-md font-semibold mb-4">
            {editingHoliday ? 'Edit Holiday' : 'Add New Holiday'}
          </h4>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Holiday Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="national">National Holiday</option>
                <option value="regional">Regional Holiday</option>
                <option value="company">Company Holiday</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description (Optional)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={2}
              />
            </div>
            <div className="flex space-x-3">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                {editingHoliday ? 'Update' : 'Add'} Holiday
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingHoliday(null);
                  setFormData({ name: '', date: '', type: 'company', description: '' });
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Holiday List */}
      <div className="space-y-3">
        {holidays.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No holidays configured</p>
            <p className="text-sm">Add your first holiday using the button above</p>
          </div>
        ) : (
          holidays
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .map((holiday) => (
              <motion.div
                key={holiday.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-center space-x-4">
                  <div>
                    <h4 className="font-semibold text-gray-800">{holiday.name}</h4>
                    <p className="text-sm text-gray-600">
                      {new Date(holiday.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                    {holiday.description && (
                      <p className="text-sm text-gray-500 mt-1">{holiday.description}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(holiday.type)}`}>
                    {holiday.type}
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(holiday)}
                      className="text-blue-600 hover:text-blue-900 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(holiday.id)}
                      className="text-red-600 hover:text-red-900 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
        )}
      </div>
    </div>
  );
}
