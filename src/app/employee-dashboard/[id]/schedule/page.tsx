'use client';

import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Users, ChevronLeft, ChevronRight } from 'lucide-react';

export default function SchedulePage({ params }: { params: { id: string } }) {
  const [currentWeek, setCurrentWeek] = useState(new Date());

  const scheduleData = [
    {
      id: 1,
      date: '2023-10-02',
      day: 'Monday',
      events: [
        { time: '09:00 AM', title: 'Team Standup', type: 'meeting', location: 'Conference Room A', attendees: 5 },
        { time: '02:00 PM', title: 'Project Review', type: 'meeting', location: 'Virtual', attendees: 8 }
      ]
    },
    {
      id: 2,
      date: '2023-10-03',
      day: 'Tuesday',
      events: [
        { time: '10:00 AM', title: 'Client Meeting', type: 'meeting', location: 'Board Room', attendees: 3 },
        { time: '03:00 PM', title: 'Training Session', type: 'training', location: 'Training Room', attendees: 12 }
      ]
    },
    {
      id: 3,
      date: '2023-10-04',
      day: 'Wednesday',
      events: [
        { time: '11:00 AM', title: 'Code Review', type: 'meeting', location: 'Virtual', attendees: 4 }
      ]
    },
    {
      id: 4,
      date: '2023-10-05',
      day: 'Thursday',
      events: [
        { time: '01:00 PM', title: 'Sprint Planning', type: 'meeting', location: 'Conference Room B', attendees: 6 }
      ]
    },
    {
      id: 5,
      date: '2023-10-06',
      day: 'Friday',
      events: [
        { time: '04:00 PM', title: 'Team Building', type: 'event', location: 'Outdoor Area', attendees: 15 }
      ]
    }
  ];

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'meeting':
        return 'bg-blue-500/20 border-blue-500 text-blue-400';
      case 'training':
        return 'bg-green-500/20 border-green-500 text-green-400';
      case 'event':
        return 'bg-purple-500/20 border-purple-500 text-purple-400';
      default:
        return 'bg-gray-500/20 border-gray-500 text-gray-400';
    }
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentWeek);
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentWeek(newDate);
  };

  return (
    <div className="p-6 text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Schedule</h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigateWeek('prev')}
            className="p-2 bg-[#1E2A44] hover:bg-[#15253B] rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-lg font-medium">
            {currentWeek.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </span>
          <button
            onClick={() => navigateWeek('next')}
            className="p-2 bg-[#1E2A44] hover:bg-[#15253B] rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Weekly Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
        {scheduleData.map((day) => (
          <div key={day.id} className="bg-[#1E2A44] rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">{day.day}</h3>
              <span className="text-sm text-slate-400">{day.date.split('-')[2]}</span>
            </div>
            <div className="space-y-2">
              {day.events.map((event, index) => (
                <div
                  key={index}
                  className={`p-2 rounded-lg border text-xs ${getEventTypeColor(event.type)}`}
                >
                  <div className="flex items-center space-x-2 mb-1">
                    <Clock className="w-3 h-3" />
                    <span>{event.time}</span>
                  </div>
                  <p className="font-medium truncate">{event.title}</p>
                </div>
              ))}
              {day.events.length === 0 && (
                <p className="text-slate-400 text-sm">No events</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Today's Schedule */}
      <div className="bg-[#1E2A44] rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-6">Today's Schedule</h2>
        <div className="space-y-4">
          {scheduleData[0].events.map((event, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border ${getEventTypeColor(event.type)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">{event.title}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4" />
                      <span>{event.attendees} attendees</span>
                    </div>
                  </div>
                </div>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                  Join
                </button>
              </div>
            </div>
          ))}
          {scheduleData[0].events.length === 0 && (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-400">No events scheduled for today</p>
            </div>
          )}
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="bg-[#1E2A44] rounded-xl p-6 mt-6">
        <h2 className="text-xl font-semibold mb-6">Upcoming Events</h2>
        <div className="space-y-3">
          {scheduleData.slice(1).flatMap(day =>
            day.events.map((event, index) => (
              <div key={`${day.id}-${index}`} className="flex items-center justify-between p-3 bg-[#15253B] rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={`w-3 h-3 rounded-full ${
                    event.type === 'meeting' ? 'bg-blue-400' :
                    event.type === 'training' ? 'bg-green-400' : 'bg-purple-400'
                  }`}></div>
                  <div>
                    <p className="font-medium">{event.title}</p>
                    <p className="text-sm text-slate-400">{day.day} at {event.time}</p>
                  </div>
                </div>
                <div className="text-right text-sm text-slate-400">
                  <p>{event.location}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
