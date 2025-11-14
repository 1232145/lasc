import React, { useMemo, useState } from 'react';
import { EventForm } from '../forms/EventForm';
import { Pagination } from '../ui/Pagination';
import { EmptyState } from '../ui/EmptyState';
import type { Event } from '../types';
import { SortableHeader } from '../ui/SortableHeader';
import { SearchInput } from '../ui/SearchInput';

interface EventsTabProps {
  events: Event[];
  editingEvent: Event | null;
  showCreateEvent: boolean;
  newEvent: any;
  currentEvents: Event[];
  currentPage: number;
  totalPages: number;
  startIndex: number;
  endIndex: number;
  getRSVPCountForEvent: (eventId: string) => number;
  handleCreateNewEvent: () => void;
  handleUpdateEvent: (e: React.FormEvent) => void;
  handleCreateEvent: (e: React.FormEvent) => void;
  handleFormChange: (field: string, value: string) => void;
  handleEditEvent: (event: Event) => void;
  handleDeleteEvent: (eventId: string, eventTitle: string) => void;
  handlePageChange: (page: number) => void;
  clearForm: () => void;
}

export const EventsTab: React.FC<EventsTabProps> = ({
  events,
  editingEvent,
  showCreateEvent,
  newEvent,
  currentEvents,
  currentPage,
  totalPages,
  startIndex,
  endIndex,
  getRSVPCountForEvent,
  handleCreateNewEvent,
  handleUpdateEvent,
  handleCreateEvent,
  handleFormChange,
  handleEditEvent,
  handleDeleteEvent,
  handlePageChange,
  clearForm
}) => {
  type SortKey = 'title' | 'description' | 'date' | 'location' | 'capacity' | 'rsvps';
  const [sort, setSort] = useState<{ key: SortKey | null; direction: 'asc' | 'desc' | null }>({ key: null, direction: null });
  const [query, setQuery] = useState('');

  const filteredCurrent = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return currentEvents;
    return currentEvents.filter((e) => {
      const title = (e.title || '').toLowerCase();
      const description = (e.description || '').toLowerCase();
      const location = (e.location || '').toLowerCase();
      const date = e.date ? new Date(`${e.date}T00:00:00`).toLocaleDateString().toLowerCase() : '';
      return (
        title.includes(q) ||
        description.includes(q) ||
        location.includes(q) ||
        date.includes(q)
      );
    });
  }, [currentEvents, query]);

  const sortedCurrent = useMemo(() => {
    if (!sort.key || !sort.direction) return filteredCurrent;
    const arr = [...filteredCurrent];
    arr.sort((a, b) => {
      const dir = sort.direction === 'asc' ? 1 : -1;
      switch (sort.key) {
        case 'title':
          return dir * (a.title || '').localeCompare(b.title || '');
        case 'description':
          return dir * (a.description || '').localeCompare(b.description || '');
        case 'date': {
          const da = a.date ? new Date(`${a.date}T00:00:00`).getTime() : Number.POSITIVE_INFINITY;
          const db = b.date ? new Date(`${b.date}T00:00:00`).getTime() : Number.POSITIVE_INFINITY;
          return dir * (da - db);
        }
        case 'location':
          return dir * (a.location || '').localeCompare(b.location || '');
        case 'capacity':
          return dir * (((a.capacity as any) ?? -Infinity) - ((b.capacity as any) ?? -Infinity));
        case 'rsvps':
          return dir * (getRSVPCountForEvent(a.id) - getRSVPCountForEvent(b.id));
        default:
          return 0;
      }
    });
    return arr;
  }, [filteredCurrent, sort, getRSVPCountForEvent]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6 gap-3">
        <h2 className="text-xl font-semibold text-gray-800">Events</h2>
        <div className="flex-1 hidden md:block" />
        <SearchInput value={query} onChange={setQuery} placeholder="Search events..." />
        <button
          onClick={handleCreateNewEvent}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 cursor-pointer"
        >
          Add New Event
        </button>
      </div>

      {editingEvent && (
        <EventForm
          isEditing={true}
          onSubmit={handleUpdateEvent}
          onCancel={() => {
            handleEditEvent(null as any);
            clearForm();
          }}
          title={`Edit Event: ${editingEvent.title}`}
          formData={newEvent}
          onFormChange={handleFormChange}
        />
      )}

      {showCreateEvent && (
        <EventForm
          isEditing={false}
          onSubmit={handleCreateEvent}
          onCancel={() => {
            handleCreateNewEvent();
            clearForm();
          }}
          title="Create New Event"
          formData={newEvent}
          onFormChange={handleFormChange}
        />
      )}

      {events.length === 0 ? (
        <EmptyState message="No events found." />
      ) : (
        <div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <SortableHeader label="Title" columnKey="title" sort={sort} onChange={setSort} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" />
                  <SortableHeader label="Description" columnKey="description" sort={sort} onChange={setSort} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" />
                  <SortableHeader label="Date" columnKey="date" sort={sort} onChange={setSort} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" />
                  <SortableHeader label="Location" columnKey="location" sort={sort} onChange={setSort} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" />
                  <SortableHeader label="Capacity" columnKey="capacity" sort={sort} onChange={setSort} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" />
                  <SortableHeader label="RSVPs" columnKey="rsvps" sort={sort} onChange={setSort} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" />
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedCurrent.map((event) => (
                  <tr key={event.id}>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900 max-w-xs whitespace-normal">{event.title}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 max-w-lg whitespace-normal max-h-20 overflow-y-auto" style={{ maxHeight: '5rem' }}>
                        {event.description || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {event.date
                        ? new Date(`${event.date}T00:00:00`).toLocaleDateString()
                        : 'TBD'}
                      {(event.start_time || event.end_time) && (
                        <div className="text-gray-500 text-xs">
                          {event.start_time
                            ? `🕒 ${event.start_time}${event.end_time ? ` – ${event.end_time}` : ''}`
                            : ''}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 max-w-2xl whitespace-normal">{event.location || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {event.capacity ? `${event.capacity} people` : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                        {getRSVPCountForEvent(event.id)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button onClick={() => handleEditEvent(event)} className="text-blue-600 hover:text-blue-900 mr-3 cursor-pointer">
                        Edit
                      </button>
                      <button onClick={() => handleDeleteEvent(event.id, event.title)} className="text-red-600 hover:text-red-900 cursor-pointer">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            startIndex={startIndex}
            endIndex={endIndex}
            totalItems={events.length}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};
