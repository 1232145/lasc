import React from 'react';
import { EmptyState } from '../ui/EmptyState';
import type { RSVP } from '../types';

interface RSVPsTabProps {
  rsvps: RSVP[];
}

export const RSVPsTab: React.FC<RSVPsTabProps> = ({ rsvps }) => (
  <div>
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-semibold text-gray-800">Recent RSVPs</h2>
      <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 cursor-pointer">
        Export Data
      </button>
    </div>

    {rsvps.length === 0 ? (
      <EmptyState message="No RSVPs found." />
    ) : (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">RSVP Date</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {rsvps.map((rsvp) => (
              <tr key={rsvp.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{rsvp.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{rsvp.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{rsvp.phone || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{rsvp.events?.title || 'Unknown Event'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(rsvp.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
);

