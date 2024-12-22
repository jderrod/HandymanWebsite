import React, { useEffect, useState } from 'react';

const ServicesList = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch data from the backend
    fetch('http://localhost:5000/api/services')
      .then((response) => response.json())
      .then((data) => {
        setServices(data);
        setLoading(false);
      })
      .catch((error) => console.error('Error fetching services:', error));
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Services</h1>
      <ul>
        {services.map((service) => (
          <li key={service._id}>
            <h2>{service.name}</h2>
            <p>{service.description}</p>
            <p>Price: ${service.price}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ServicesList;
