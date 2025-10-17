"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

type Event = {
  id: string;
  title: string;
  date: string | null;
  description?: string;
  location?: string;
  capacity?: number;
  image_url?: string;
  created_at: string;
};

type RSVP = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  event_id: string;
  created_at: string;
  events?: Event;
};

type Photo = {
  id: string;
  title: string;
  description?: string;
  event_title?: string;
  year?: number;
  taken_at?: string;
  image_url: string;
  created_at?: string;
};

// Reusable Event Form Component
const EventForm = ({
  isEditing,
  onSubmit,
  onCancel,
  title,
  formData,
  onFormChange
}: {
  isEditing: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  title: string;
  formData: {
    title: string;
    description: string;
    date: string;
    location: string;
    capacity: string;
    image_url: string;
  };
  onFormChange: (field: string, value: string) => void;
}) => (
  <div className={`p-6 rounded-lg mb-6 border ${isEditing ? 'bg-yellow-50 border-yellow-200' : 'bg-gray-50'}`}>
    <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Event Title *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => onFormChange('title', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-100"
            placeholder="Enter event title"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date *
          </label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => onFormChange('date', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-100"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => onFormChange('location', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-100"
            placeholder="Enter event location"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Capacity
          </label>
          <input
            type="number"
            value={formData.capacity}
            onChange={(e) => onFormChange('capacity', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-100"
            placeholder="Enter maximum capacity"
            min="1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Image URL
          </label>
          <input
            type="url"
            value={formData.image_url}
            onChange={(e) => onFormChange('image_url', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-100"
            placeholder="https://example.com/image.jpg"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => onFormChange('description', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-100"
            placeholder="Enter event description"
            rows={3}
          />
        </div>
      </div>
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          className={`px-4 py-2 text-white rounded-md cursor-pointer ${isEditing
            ? 'bg-yellow-600 hover:bg-yellow-700'
            : 'bg-blue-600 hover:bg-blue-700'
            }`}
        >
          {isEditing ? 'Update Event' : 'Create Event'}
        </button>
      </div>
    </form>
  </div>
);

const PhotoForm = ({
  isEditing,
  onSubmit,
  onCancel,
  formData,
  onFormChange
}: {
  isEditing: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  formData: {
    title: string;
    description: string;
    event_title: string;
    year: string;
    taken_at: string;
    image_url: string;
  };
  onFormChange: (field: string, value: string) => void;
}) => (
  <div className={`p-6 rounded-lg mb-6 border ${isEditing ? 'bg-yellow-50 border-yellow-200' : 'bg-gray-50'}`}>
    <h3 className="text-lg font-semibold text-gray-800 mb-4">
      {isEditing ? "Edit Photo" : "Add New Photo"}
    </h3>
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Photo Title *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => onFormChange('title', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-100"
            placeholder="Enter photo title"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Event Title
          </label>
          <input
            type="text"
            value={formData.event_title}
            onChange={(e) => onFormChange('event_title', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-100"
            placeholder="Associated event (if any)"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Year
          </label>
          <input
            type="number"
            value={formData.year}
            onChange={(e) => onFormChange('year', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-100"
            placeholder="e.g. 2025"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Taken At
          </label>
          <input
            type="date"
            value={formData.taken_at}
            onChange={(e) => onFormChange('taken_at', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-100"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Image URL
          </label>
          <input
            type="url"
            value={formData.image_url}
            onChange={(e) => onFormChange('image_url', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-100"
            placeholder="https://example.com/photo.jpg"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => onFormChange('description', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-100"
            placeholder="Enter photo description"
            rows={3}
          />
        </div>
      </div>
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          className={`px-4 py-2 text-white rounded-md cursor-pointer ${isEditing
            ? 'bg-yellow-600 hover:bg-yellow-700'
            : 'bg-blue-600 hover:bg-blue-700'
            }`}
        >
          {isEditing ? 'Update Photo' : 'Create Photo'}
        </button>
      </div>
    </form>
  </div>
);

export default function AdminPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'events' | 'rsvps' | 'photos'>('events');
  const [user, setUser] = useState<any>(null);
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [showCreatePhoto, setShowCreatePhoto] = useState(false);
  const [sortPhotosBy, setSortPhotosBy] = useState<"uploaded" | "taken">("taken");
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    capacity: '',
    image_url: ''
  });
  const [newPhoto, setNewPhoto] = useState({
    title: '',
    description: '',
    event_title: '',
    year: '',
    taken_at: '',
    image_url: ''
  });
  const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [eventsPerPage] = useState(10);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const router = useRouter();

  useEffect(() => {
    checkUser();
    fetchData();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      setUser(session.user);
    } else {
      router.push('/admin/login');
    }
  };

  const fetchData = async () => {
    setLoading(true);

    // Fetch events
    const { data: eventsData } = await supabase
      .from('events')
      .select('*')
      .order('date', { ascending: true });

    // Fetch RSVPs with event details
    const { data: rsvpsData } = await supabase
      .from('rsvps')
      .select(`
        *,
        events (
          id,
          title,
          date
        )
      `)
      .order('created_at', { ascending: false });

    // Fetch Photos  
    const { data: photosData } = await supabase
      .from('photos')
      .select('*')
      .order('created_at', { ascending: false });

    setEvents(eventsData || []);
    setRsvps(rsvpsData || []);
    setPhotos(photosData || []);
    setLoading(false);
  };

  const getRSVPCountForEvent = (eventId: string) => {
    return rsvps.filter(rsvp => rsvp.event_id === eventId).length;
  };

  // Pagination logic
  const totalPages = Math.ceil(events.length / eventsPerPage);
  const startIndex = (currentPage - 1) * eventsPerPage;
  const endIndex = startIndex + eventsPerPage;
  const currentEvents = events.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const clearForm = () => {
    setNewEvent({ title: '', description: '', date: '', location: '', capacity: '', image_url: '' });
  };

  const handleCreateNewEvent = () => {
    setShowCreateEvent(true);
    setEditingEvent(null); // Close edit form if open
    clearForm(); // Clear the form
  };

  const handleFormChange = useCallback((field: string, value: string) => {
    setNewEvent(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newEvent.title || !newEvent.date) {
      alert('Please fill in title and date');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('events')
        .insert([{
          title: newEvent.title,
          description: newEvent.description || null,
          date: newEvent.date,
          location: newEvent.location || null,
          capacity: newEvent.capacity ? parseInt(newEvent.capacity) : null,
          image_url: newEvent.image_url || null
        }]);

      if (error) {
        console.error('Error creating event:', error);
        alert('Error creating event');
        return;
      }

      // Reset form and refresh data
      setNewEvent({ title: '', description: '', date: '', location: '', capacity: '', image_url: '' });
      setShowCreateEvent(false);
      fetchData();
      alert('Event created successfully!');
    } catch (err) {
      console.error('Error creating event:', err);
      alert('Error creating event');
    }
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setShowCreateEvent(false); // Close create form if open
    setNewEvent({
      title: event.title,
      description: event.description || '',
      date: event.date ? event.date.split('T')[0] : '', // Convert to date format
      location: event.location || '',
      capacity: event.capacity?.toString() || '',
      image_url: event.image_url || ''
    });
  };

  const handleUpdateEvent = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingEvent || !newEvent.title || !newEvent.date) {
      alert('Please fill in title and date');
      return;
    }

    try {
      const { error } = await supabase
        .from('events')
        .update({
          title: newEvent.title,
          description: newEvent.description || null,
          date: newEvent.date,
          location: newEvent.location || null,
          capacity: newEvent.capacity ? parseInt(newEvent.capacity) : null,
          image_url: newEvent.image_url || null
        })
        .eq('id', editingEvent.id);

      if (error) {
        console.error('Error updating event:', error);
        alert('Error updating event');
        return;
      }

      // Reset form and refresh data
      setEditingEvent(null);
      setNewEvent({ title: '', description: '', date: '', location: '', capacity: '', image_url: '' });
      fetchData();
      alert('Event updated successfully!');
    } catch (err) {
      console.error('Error updating event:', err);
      alert('Error updating event');
    }
  };

  const handleDeleteEvent = async (eventId: string, eventTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${eventTitle}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId);

      if (error) {
        console.error('Error deleting event:', error);
        alert('Error deleting event');
        return;
      }

      fetchData();
      alert('Event deleted successfully!');
    } catch (err) {
      console.error('Error deleting event:', err);
      alert('Error deleting event');
    }
  };

  const handlePhotoFormChange = (field: string, value: string) => {
    setNewPhoto(prev => ({ ...prev, [field]: value }));
  };

  const handleCreatePhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('photos').insert([{
      ...newPhoto,
      year: newPhoto.year ? parseInt(newPhoto.year) : null,
      taken_at: newPhoto.taken_at || null
    }]);
    if (!error) {
      setNewPhoto({ title: '', description: '', event_title: '', year: '', taken_at: '', image_url: '' });
      fetchData();
      alert('Photo added successfully!');
    }
  };

  const handleEditPhoto = (photo: Photo) => {
    setEditingPhoto(photo);
    setNewPhoto({
      title: photo.title,
      description: photo.description || '',
      event_title: photo.event_title || '',
      year: photo.year?.toString() || '',
      taken_at: photo.taken_at?.split('T')[0] || '',
      image_url: photo.image_url || ''
    });
  };

  const handleUpdatePhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPhoto) return;
    const { error } = await supabase
      .from('photos')
      .update({
        ...newPhoto,
        year: newPhoto.year ? parseInt(newPhoto.year) : null,
        taken_at: newPhoto.taken_at || null
      })
      .eq('id', editingPhoto.id);

    if (!error) {
      setEditingPhoto(null);
      setNewPhoto({ title: '', description: '', event_title: '', year: '', taken_at: '', image_url: '' });
      fetchData();
      alert('Photo updated successfully!');
    }
  };

  const handleDeletePhoto = async (photoId: string) => {
    if (!confirm('Are you sure you want to delete this photo?')) return;
    const { error } = await supabase.from('photos').delete().eq('id', photoId);
    if (!error) {
      fetchData();
      alert('Photo deleted successfully!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading admin data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
              <p className="text-gray-600">Manage events and RSVPs for LASC</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                Logged in as: {user?.email}
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors cursor-pointer"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-800">Total Events</h3>
            <p className="text-3xl font-bold text-blue-600">{events.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-800">Total RSVPs</h3>
            <p className="text-3xl font-bold text-green-600">{rsvps.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-800">Upcoming Events</h3>
            <p className="text-3xl font-bold text-orange-600">
              {events.filter(event => event.date && new Date(event.date) > new Date()).length}
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('events')}
                className={`py-4 px-1 border-b-2 font-medium text-sm cursor-pointer ${activeTab === 'events'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
              >
                Events ({events.length})
              </button>
              <button
                onClick={() => setActiveTab('rsvps')}
                className={`py-4 px-1 border-b-2 font-medium text-sm cursor-pointer ${activeTab === 'rsvps'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
              >
                RSVPs ({rsvps.length})
              </button>
              <button
                onClick={() => setActiveTab('photos')}
                className={`py-4 px-1 border-b-2 font-medium text-sm cursor-pointer ${activeTab === 'photos'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
              >
                Photos ({photos.length})
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'events' ? (
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

                {/* Edit Event Form */}
                {editingEvent && (
                  <EventForm
                    isEditing={true}
                    onSubmit={handleUpdateEvent}
                    onCancel={() => {
                      setEditingEvent(null);
                      clearForm();
                    }}
                    title={`Edit Event: ${editingEvent.title}`}
                    formData={newEvent}
                    onFormChange={handleFormChange}
                  />
                )}

                {/* Create Event Form */}
                {showCreateEvent && (
                  <EventForm
                    isEditing={false}
                    onSubmit={handleCreateEvent}
                    onCancel={() => {
                      setShowCreateEvent(false);
                      clearForm();
                    }}
                    title="Create New Event"
                    formData={newEvent}
                    onFormChange={handleFormChange}
                  />
                )}

                {events.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No events found.</p>
                ) : (
                  <div>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Title
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Description
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Location
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Capacity
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              RSVPs
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {currentEvents.map((event) => (
                            <tr key={event.id}>
                              <td className="px-6 py-4">
                                <div className="text-sm font-medium text-gray-900 max-w-xs whitespace-normal">
                                  {event.title}
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div
                                  className="text-sm text-gray-500 max-w-lg whitespace-normal max-h-20 overflow-y-auto"
                                  style={{ maxHeight: '5rem' }}
                                >
                                  {event.description || '-'}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {event.date ? new Date(event.date).toLocaleDateString() : 'TBD'}
                              </td>
                              <td className="px-6 py-4">
                                <div className="text-sm text-gray-500 max-w-2xl whitespace-normal">
                                  {event.location || '-'}
                                </div>
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
                                <button
                                  onClick={() => handleEditEvent(event)}
                                  className="text-blue-600 hover:text-blue-900 mr-3 cursor-pointer"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteEvent(event.id, event.title)}
                                  className="text-red-600 hover:text-red-900 cursor-pointer"
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                      <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                        <div className="flex-1 flex justify-between sm:hidden">
                          <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Previous
                          </button>
                          <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Next
                          </button>
                        </div>
                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                          <div>
                            <p className="text-sm text-gray-700">
                              Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                              <span className="font-medium">{Math.min(endIndex, events.length)}</span> of{' '}
                              <span className="font-medium">{events.length}</span> results
                            </p>
                          </div>
                          <div>
                            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                              <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                Previous
                              </button>

                              {/* Page Numbers */}
                              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <button
                                  key={page}
                                  onClick={() => handlePageChange(page)}
                                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${page === currentPage
                                    ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                    }`}
                                >
                                  {page}
                                </button>
                              ))}

                              <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                Next
                              </button>
                            </nav>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : activeTab === 'rsvps' ? (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-800">Recent RSVPs</h2>
                  <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 cursor-pointer">
                    Export Data
                  </button>
                </div>

                {rsvps.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No RSVPs found.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Name
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Email
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Phone
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Event
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            RSVP Date
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {rsvps.map((rsvp) => (
                          <tr key={rsvp.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {rsvp.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {rsvp.email}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {rsvp.phone || '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {rsvp.events?.title || 'Unknown Event'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(rsvp.created_at).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-800">Photos</h2>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 cursor-pointer"
                    onClick={() => {
                      setEditingPhoto(null); // sets isEditing to false in PhotoForm
                      setNewPhoto({
                        title: '',
                        description: '',
                        event_title: '',
                        year: '',
                        taken_at: '',
                        image_url: '',
                      });
                      setShowCreatePhoto(true);
                    }}>
                    Add New Photo
                  </button>
                </div>

                {(editingPhoto !== null || showCreatePhoto) && (
                  <PhotoForm
                    isEditing={!!editingPhoto}
                    onSubmit={editingPhoto ? handleUpdatePhoto : handleCreatePhoto}
                    onCancel={() => {
                      setEditingPhoto(null);
                      setNewPhoto({
                        title: '',
                        description: '',
                        event_title: '',
                        year: '',
                        taken_at: '',
                        image_url: '',
                      });
                      setShowCreatePhoto(false);
                    }}
                    formData={newPhoto}
                    onFormChange={handlePhotoFormChange}
                  />
                )}

                <div className="flex justify-end mb-4">
                  <label className="mr-2 text-sm text-gray-700">Sort by:</label>
                  <select
                    value={sortPhotosBy}
                    onChange={(e) => setSortPhotosBy(e.target.value as "uploaded" | "taken")}
                    className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none"
                  >
                    <option value="taken">Date Taken</option>
                    <option value="uploaded">Date Uploaded</option>
                  </select>
                </div>

                {photos.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No photos found.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {photos
                      .slice()
                      .sort((a, b) => {
                        const aDate = new Date(String(sortPhotosBy === "taken" ? a.taken_at : a.created_at));
                        const bDate = new Date(String(sortPhotosBy === "taken" ? b.taken_at : b.created_at));
                        return bDate.getTime() - aDate.getTime(); // Newest first
                      })
                      .map(photo => (
                        <div key={photo.id} className="bg-white border rounded-lg shadow-sm p-4">
                          <img
                            src={photo.image_url}
                            alt={photo.title}
                            className="w-full h-48 object-cover rounded mb-2"
                          />
                          <h3 className="font-semibold text-gray-800">{photo.title}</h3>
                          <p className="text-sm text-gray-600 truncate">{photo.description}</p>
                          <p className="text-xs text-gray-400">
                            Taken: {photo.taken_at?.split("T")[0]}
                          </p>
                          <div className="flex justify-end space-x-2 mt-3">
                            <button
                              className="text-blue-600 hover:underline text-sm"
                              onClick={() => handleEditPhoto(photo)}
                            >
                              Edit
                            </button>
                            <button
                              className="text-red-600 hover:underline text-sm"
                              onClick={() => handleDeletePhoto(photo.id)}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>

            )}
          </div>
        </div>

      </div>
    </div>
  );
}
