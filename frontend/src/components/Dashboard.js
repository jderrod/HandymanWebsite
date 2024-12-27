// frontend/src/components/Dashboard.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/");
          return;
        }

        const response = await fetch("http://localhost:5000/api/quotes", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            // Token expired or invalid
            localStorage.removeItem("token");
            navigate("/");
            return;
          }
          throw new Error("Failed to fetch quotes");
        }

        const data = await response.json();
        setQuotes(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching quotes:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuotes();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
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

        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">
              Recent Quote Requests
            </h2>

            {quotes.length === 0 ? (
              <p className="text-gray-500">No quotes found.</p>
            ) : (
              <div className="space-y-4">
                {quotes.map((quote) => (
                  <div
                    key={quote._id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="font-semibold">Contact Information</h3>
                        <p className="text-gray-600">Name: {quote.name}</p>
                        <p className="text-gray-600">
                          Phone: {quote.phoneNumber}
                        </p>
                        <p className="text-gray-600">Email: {quote.email}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold">Request Details</h3>
                        <p className="text-gray-600">
                          Subject: {quote.subject}
                        </p>
                        {quote.additionalDetails && (
                          <p className="text-gray-600">
                            Details: {quote.additionalDetails}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-gray-500">
                      Submitted: {new Date(quote.createdAt).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
