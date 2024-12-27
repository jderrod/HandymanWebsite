import React from 'react';

const ServiceCard = ({ service }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="h-48 bg-gray-200">
        <img 
          src="/api/placeholder/400/300" 
          alt={service.title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
        <p className="text-gray-600 mb-4">{service.description}</p>
        <div className="text-lg font-bold text-blue-600">
          {service.cost}
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;