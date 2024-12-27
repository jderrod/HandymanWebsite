import React, { useEffect, useState } from 'react';

const ServicesList = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/services')
      .then(response => response.json())
      .then(data => {
        console.log('Fetched data:', data);
        setServices(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Available Services</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map(service => (
          <div key={service._id} className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            {/* Image placeholder - we can add service images later */}
            <div className="h-48 bg-gray-200 rounded-t-lg"></div>
            <div className="p-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-3">{service.title}</h3>
              <p className="text-gray-600 mb-4 min-h-[80px]">{service.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-blue-600">{service.cost}</span>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300">
                  Book Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServicesList;