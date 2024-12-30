import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingQuote, setEditingQuote] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const navigate = useNavigate();

  const fetchQuotes = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/');
        return;
      }

      const response = await fetch('http://localhost:5000/api/quotes', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          navigate('/');
          return;
        }
        throw new Error('Failed to fetch quotes');
      }

      const data = await response.json();
      setQuotes(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchQuotes();
    const intervalId = setInterval(fetchQuotes, 30000);
    return () => clearInterval(intervalId);
  }, [fetchQuotes]);

  const updateQuote = async (quoteId, updates) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/quotes/${quoteId}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error('Failed to update quote');
      }

      const updatedQuote = await response.json();
      setQuotes(prevQuotes => 
        prevQuotes.map(quote => 
          quote._id === quoteId ? updatedQuote : quote
        ).sort((a, b) => {
          const dateA = new Date(a.lastUpdated || a.createdAt);
          const dateB = new Date(b.lastUpdated || b.createdAt);
          return dateB - dateA;
        })
      );
      setEditingQuote(null);
      await fetchQuotes();
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteQuote = async (quoteId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Not authenticated');
        navigate('/');
        return;
      }

      const response = await fetch(`http://localhost:5000/api/quotes/${quoteId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete quote');
      }

      setQuotes(prevQuotes => prevQuotes.filter(quote => quote._id !== quoteId));
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to delete quote');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const filteredQuotes = quotes.filter(quote => 
    statusFilter === 'all' ? true : quote.status === statusFilter
  );

  const QuoteCard = ({ quote }) => {
    const [status, setStatus] = useState(quote.status || 'pending');
    const [adminNotes, setAdminNotes] = useState(quote.adminNotes || '');
    const isEditing = editingQuote === quote._id;

    useEffect(() => {
      setStatus(quote.status || 'pending');
      setAdminNotes(quote.adminNotes || '');
    }, [quote]);

    const handleSave = () => {
      updateQuote(quote._id, { status, adminNotes });
    };

    const handleDelete = () => {
      if (window.confirm('Are you sure you want to delete this quote?')) {
        deleteQuote(quote._id);
      }
    };

    return (
      <div className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-md transition-shadow">
        {/* Header with Delete Button */}
        <div className="flex justify-between items-start mb-4">
          <h3 className="font-semibold">Quote Details</h3>
          <button
            onClick={handleDelete}
            className="text-red-600 hover:text-red-800 px-2 py-1 rounded-md hover:bg-red-50"
          >
            Delete
          </button>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold">Contact Information</h3>
            <p className="text-gray-600">Name: {quote.name}</p>
            <p className="text-gray-600">Phone: {quote.phoneNumber}</p>
            <p className="text-gray-600">Email: {quote.email}</p>
          </div>
          <div>
            <h3 className="font-semibold">Request Details</h3>
            <p className="text-gray-600">Subject: {quote.subject}</p>
            {quote.additionalDetails && (
              <p className="text-gray-600">Details: {quote.additionalDetails}</p>
            )}
          </div>
        </div>
        
        {/* Status Section */}
        <div className="mt-4 border-t pt-4">
          <div className="space-y-2">
            {isEditing ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Admin Notes</label>
                  <textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    rows="2"
                  />
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={handleSave}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setEditingQuote(null)}
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-gray-500">Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    status === 'completed' ? 'bg-green-100 text-green-800' :
                    status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                    status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </span>
                  <button
                    onClick={() => setEditingQuote(quote._id)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Edit
                  </button>
                </div>
                {adminNotes && (
                  <div className="mt-2">
                    <span className="text-sm font-medium text-gray-500">Admin Notes:</span>
                    <p className="text-gray-600 mt-1">{adminNotes}</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        
        <div className="mt-2 text-sm text-gray-500">
          Last Updated: {new Date(quote.lastUpdated || quote.createdAt).toLocaleString()}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Quote Requests</h2>
            <div className="flex items-center space-x-2">
              <label htmlFor="statusFilter" className="text-sm font-medium text-gray-700">
                Filter:
              </label>
              <select
                id="statusFilter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
          
          <div className="overflow-y-auto h-[800px] pr-4 -mr-4">
            <div className="space-y-4">
              {filteredQuotes.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  {statusFilter === 'all' 
                    ? 'No quotes found.'
                    : `No quotes with status "${statusFilter}" found.`}
                </p>
              ) : (
                filteredQuotes.map((quote) => (
                  <QuoteCard key={quote._id} quote={quote} />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;