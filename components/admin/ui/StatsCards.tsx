import React from 'react';

interface StatsCardsProps {
  events: number;
  rsvps: number;
  resources: number;
  photos: number;
  sponsors: number;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ 
  events, 
  rsvps, 
  resources, 
  photos, 
  sponsors 
}) => (
  <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold text-gray-800">Total Events</h3>
      <p className="text-3xl font-bold text-blue-600">{events}</p>
    </div>
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold text-gray-800">Total RSVPs</h3>
      <p className="text-3xl font-bold text-green-600">{rsvps}</p>
    </div>
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold text-gray-800">Resources</h3>
      <p className="text-3xl font-bold text-purple-600">{resources}</p>
    </div>
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold text-gray-800">Photos</h3>
      <p className="text-3xl font-bold text-orange-600">{photos}</p>
    </div>
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold text-gray-800">Sponsors</h3>
      <p className="text-3xl font-bold text-indigo-600">{sponsors}</p>
    </div>
  </div>
);

