import React, { useMemo, useState } from 'react';
import { EmptyState } from '../ui/EmptyState';
import type { RSVP } from '../types';

interface RSVPsTabProps {
  rsvps: RSVP[];
}

export const RSVPsTab: React.FC<RSVPsTabProps> = ({ rsvps }) => {
  const [eventSort, setEventSort] = useState<'asc' | 'desc'>('asc');
  const [rsvpSort, setRsvpSort] = useState<'asc' | 'desc'>('desc');

  const grouped = useMemo(() => {
    const map = new Map<string, { eventId: string; eventTitle: string; eventDate: string | null; rsvps: RSVP[] }>();

    for (const r of rsvps) {
      const eventId = r.event_id;
      const title = r.events?.title || 'Unknown Event';
      const date = (r.events as any)?.date ?? null;

      if (!map.has(eventId)) {
        map.set(eventId, { eventId, eventTitle: title, eventDate: date, rsvps: [] });
      }
      map.get(eventId)!.rsvps.push(r);
    }

    const groups = Array.from(map.values());

    // sort RSVPs within each event by created_at
    for (const g of groups) {
      g.rsvps.sort((a, b) => {
        const da = new Date(a.created_at).getTime();
        const db = new Date(b.created_at).getTime();
        return rsvpSort === 'asc' ? da - db : db - da;
      });
    }

    // sort groups by event date (unknown at bottom)
    groups.sort((a, b) => {
      const da = a.eventDate ? new Date(`${a.eventDate}T00:00:00`).getTime() : Number.POSITIVE_INFINITY;
      const db = b.eventDate ? new Date(`${b.eventDate}T00:00:00`).getTime() : Number.POSITIVE_INFINITY;
      return eventSort === 'asc' ? da - db : db - da;
    });

    return groups;
  }, [rsvps, eventSort, rsvpSort]);

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
        <h2 className="text-xl font-semibold text-gray-800">RSVPs by Event</h2>
        <div className="flex items-center gap-3">
          <label className="text-sm text-gray-600">Event sort:</label>
          <select
            className="border rounded-md px-2 py-1 text-sm"
            value={eventSort}
            onChange={(e) => setEventSort(e.target.value as 'asc' | 'desc')}
          >
            <option value="asc">Date Oldest</option>
            <option value="desc">Date Newest</option>
          </select>
          <label className="text-sm text-gray-600 ml-2">RSVP sort:</label>
          <select
            className="border rounded-md px-2 py-1 text-sm"
            value={rsvpSort}
            onChange={(e) => setRsvpSort(e.target.value as 'asc' | 'desc')}
          >
            <option value="desc">Newest first</option>
            <option value="asc">Oldest first</option>
          </select>
          <button className="ml-3 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 cursor-pointer">
            Export Data
          </button>
        </div>
      </div>

      {rsvps.length === 0 ? (
        <EmptyState message="No RSVPs found." />
      ) : (
        <div className="space-y-8">
          {grouped.map((group) => (
            <div key={group.eventId} className="border rounded-lg overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-500">Event</div>
                  <div className="text-base font-medium text-gray-900">
                    {group.eventTitle}
                  </div>
                  <div className="text-sm text-gray-500">
                    {group.eventDate ? new Date(`${group.eventDate}T00:00:00`).toLocaleDateString() : 'TBD'}
                  </div>
                </div>
                <div className="text-sm text-gray-700">
                  {group.rsvps.length} RSVP{group.rsvps.length === 1 ? '' : 's'}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">RSVP Date</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {group.rsvps.map((rsvp) => (
                      <tr key={rsvp.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{rsvp.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{rsvp.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{rsvp.phone || '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(rsvp.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

