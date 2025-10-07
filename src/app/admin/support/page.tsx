'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  HelpCircle,
  MessageSquare,
  Phone,
  Mail,
  Clock,
  CheckCircle,
  AlertCircle,
  Send,
} from 'lucide-react';

interface Ticket {
  id: number;
  subject: string;
  employeeName: string;
  createdAt: string;
  status: string;
  description: string;
}

export default function AdminSupport() {
  const router = useRouter();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const isAdmin = localStorage.getItem('isAdmin');
    if (!token || isAdmin !== 'true') {
      router.push('/signin');
      return;
    }
    fetchTickets();
  }, [router]);

  const fetchTickets = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/support/tickets', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setTickets(data.tickets);
      } else {
        console.error('Failed to fetch tickets');
      }
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async () => {
    if (!reply.trim() || !selectedTicket) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/support/tickets/${selectedTicket.id}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: reply }),
      });
      if (response.ok) {
        setReply('');
        fetchTickets();
        setSelectedTicket(null);
      } else {
        alert('Failed to send reply');
      }
    } catch (error) {
      alert('Error sending reply');
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/support/tickets/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      if (response.ok) {
        fetchTickets();
      } else {
        alert('Failed to update status');
      }
    } catch (error) {
      alert('Error updating status');
    }
  };

  const filteredTickets = tickets.filter((ticket) => {
    if (filter === 'all') return true;
    return ticket.status === filter;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'open':
        return <AlertCircle className="w-5 h-5 text-red-400" />;
      case 'in-progress':
        return <Clock className="w-5 h-5 text-yellow-400" />;
      case 'resolved':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      default:
        return <HelpCircle className="w-5 h-5 text-slate-400" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
        <div className="animate-spin w-8 h-8 border-4 border-cyan-400 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-white text-2xl font-bold">Support Center</h1>
        <div className="flex space-x-4">
          <div className="flex items-center space-x-2 text-slate-300">
            <Phone className="w-5 h-5" />
            <span>+1 (555) 123-4567</span>
          </div>
          <div className="flex items-center space-x-2 text-slate-300">
            <Mail className="w-5 h-5" />
            <span>support@hireconnect.com</span>
          </div>
        </div>
      </div>

      <div className="flex space-x-4 mb-4">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="bg-slate-800 text-white border border-slate-600 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400"
        >
          <option value="all">All Tickets</option>
          <option value="open">Open</option>
          <option value="in-progress">In Progress</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4">
            <h2 className="text-white text-xl font-semibold mb-4">Support Tickets</h2>
            <div className="space-y-4">
              {filteredTickets.length === 0 && (
                <div className="text-center py-8 text-slate-400">
                  No tickets found.
                </div>
              )}
              {filteredTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  onClick={() => setSelectedTicket(ticket)}
                  className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                    selectedTicket?.id === ticket.id
                      ? 'bg-cyan-600/20 border-cyan-400'
                      : 'bg-slate-800/50 border-slate-600 hover:bg-slate-700/50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      {getStatusIcon(ticket.status)}
                      <div>
                        <h3 className="text-white font-medium">{ticket.subject}</h3>
                        <p className="text-slate-400 text-sm">{ticket.employeeName}</p>
                        <p className="text-slate-500 text-xs">{ticket.createdAt}</p>
                      </div>
                    </div>
                    <span className="text-slate-400 text-sm capitalize">{ticket.status}</span>
                  </div>
                  <p className="text-slate-300 text-sm mt-2 line-clamp-2">{ticket.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          {selectedTicket ? (
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4">
              <h2 className="text-white text-xl font-semibold mb-4">Ticket Details</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-white font-medium">{selectedTicket.subject}</h3>
                  <p className="text-slate-400 text-sm">{selectedTicket.employeeName}</p>
                  <p className="text-slate-500 text-xs">{selectedTicket.createdAt}</p>
                </div>
                <div>
                  <p className="text-slate-300">{selectedTicket.description}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleStatusChange(selectedTicket.id, 'in-progress')}
                    className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-2 rounded text-sm"
                  >
                    In Progress
                  </button>
                  <button
                    onClick={() => handleStatusChange(selectedTicket.id, 'resolved')}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-sm"
                  >
                    Resolve
                  </button>
                </div>
                <div>
                  <textarea
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    placeholder="Type your reply..."
                    className="w-full bg-slate-800 text-white border border-slate-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    rows={4}
                  />
                  <button
                    onClick={handleReply}
                    className="mt-2 flex items-center space-x-2 bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Reply</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4">
              <div className="text-center py-8 text-slate-400">
                <MessageSquare className="w-12 h-12 mx-auto mb-4" />
                <p>Select a ticket to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
