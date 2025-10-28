import React from 'react';
import { EventForm } from '../forms/EventForm';
import { Pagination } from '../ui/Pagination';
import { EmptyState } from '../ui/EmptyState';
import type { Event } from '../types';

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
}) => (
  <div>
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-semibold text-gray-800">Events</h2>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">RSVPs</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentEvents.map((event) => (
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
                    {event.date ? new Date(`${event.date}T00:00:00`).toLocaleDateString() : 'TBD'}
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

