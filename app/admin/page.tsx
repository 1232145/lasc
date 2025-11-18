"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useToast } from "@/contexts/ToastContext";
import { useConfirmation } from "@/contexts/ConfirmationContext";
import RootManageUsersPanel from 'components/RootManageUsersPanel';
import StatsCards from '@/components/admin/ui/StatsCards';
import { TabNavigation } from '@/components/admin/ui/TabNavigation';
import { EventsTab } from '@/components/admin/tabs/EventsTab';
import { RSVPsTab } from '@/components/admin/tabs/RSVPsTab';
import { PhotosTab } from '@/components/admin/tabs/PhotosTab';
import { BoardTab } from '@/components/admin/tabs/BoardTab';
import { ResourcesTab } from '@/components/admin/tabs/ResourcesTab';
import { SponsorsTab } from '@/components/admin/tabs/SponsorsTab';
import type { Event, RSVP, Photo, BoardMember, Resource, Sponsor } from '@/components/admin/types';
import AdminCenterToggle from "@/components/admin/AdminCenterToggle";


export default function AdminPage() {
  const { showSuccess, showError } = useToast();
  const { confirm } = useConfirmation();
  const [events, setEvents] = useState<Event[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [boardMembers, setBoardMembers] = useState<BoardMember[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'events' | 'rsvps' | 'photos' | 'board' | 'sponsors' | 'resources'>('events');
  const [user, setUser] = useState<any>(null);
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [showCreatePhoto, setShowCreatePhoto] = useState(false);
  const [showCreateResource, setShowCreateResource] = useState(false);
  const [showCreateSponsor, setShowCreateSponsor] = useState(false);
  const [sortPhotosBy, setSortPhotosBy] = useState<"uploaded" | "taken">("taken");
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: '',
    start_time: '',
    end_time: '',
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
  const [newBoardMember, setNewBoardMember] = useState({
    name: '',
    role: '',
    order_index: '',
    email: '',
  });
  const [newResource, setNewResource] = useState({
    title: '',
    description: '',
    url: '',
    category: ''
  });
  const [newSponsor, setNewSponsor] = useState({
    name: '',
    logo_url: '',
    description: '',
    website: '',
    order_index: ''
  });
  const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [editingSponsor, setEditingSponsor] = useState<Sponsor | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [eventsPerPage] = useState(10);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [editingBoardMember, setEditingBoardMember] = useState<BoardMember | null>(null);
  const [showCreateBoardMember, setShowCreateBoardMember] = useState(false);
  const [isRoot, setIsRoot] = useState(false);
  const router = useRouter();

  // 1. Get the user from Supabase when component mounts
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        setUser(session.user); // This triggers the next effect
      } else {
        router.push('/admin/login');
      }
    };

    checkUser();
  }, []);

  // 2. Once the user is set, fetch app data (rsvps, events, etc.)
  useEffect(() => {
    if (user) {
      fetchData(); // fetches events/photos/etc
    }
  }, [user]);

  // 3. Once the user is set, check their role
  useEffect(() => {
    const checkIfRoot = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .maybeSingle(); // Use maybeSingle() instead of single()

      if (error) {
        console.error('Error checking user role:', error.message);
        return;
      }

      setIsRoot(data?.role === 'root');
    };

    checkIfRoot();
  }, [user]);

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

    // Fetch Board Members
    const { data: boardData } = await supabase
      .from('board_members')
      .select('*')
      .order('order_index', { ascending: true });

    // Fetch Resources
    const { data: resourcesData } = await supabase
      .from('resources')
      .select('*')
      .order('category', { ascending: true })
      .order('title', { ascending: true });

    // Fetch Sponsors
    const { data: sponsorsData } = await supabase
      .from('sponsorships')
      .select('*')
      .order('order_index', { ascending: true });

    setEvents(eventsData || []);
    setRsvps(rsvpsData || []);
    setPhotos(photosData || []);
    setBoardMembers(boardData || []);
    setResources(resourcesData || []);
    setSponsors(sponsorsData || []);
    setLoading(false);

    // Remove duplicate role check - it's already handled in the useEffect above
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
    setNewEvent({ title: '', description: '', date: '', start_time: '', end_time: '', location: '', capacity: '', image_url: '' });
  };

  const handleCreateNewEvent = () => {
    setShowCreateEvent(true);
    setEditingEvent(null); // Close edit form if open
    clearForm(); // Clear the form
  };

  // Generic form change handler
  const handleFormChange = useCallback((field: string, value: string) => {
    setNewEvent(prev => ({ ...prev, [field]: value }));
  }, []);

  const handlePhotoFormChange = useCallback((field: string, value: string) => {
    setNewPhoto(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleBoardFormChange = useCallback((field: string, value: string) => {
    setNewBoardMember(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleResourceFormChange = useCallback((field: string, value: string) => {
    setNewResource(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleSponsorFormChange = useCallback((field: string, value: string) => {
    setNewSponsor(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newEvent.title || !newEvent.date) {
      showError('Validation Error', 'Please fill in title and date');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('events')
        .insert([{
          title: newEvent.title,
          description: newEvent.description || null,
          date: newEvent.date,
          start_time: newEvent.start_time || null,
          end_time: newEvent.end_time || null,
          location: newEvent.location || null,
          capacity: newEvent.capacity ? parseInt(newEvent.capacity) : null,
          image_url: newEvent.image_url || null
        }]);

      if (error) {
        console.error('Error creating event:', error);
        showError('Error', 'Failed to create event. Please try again.');
        return;
      }

      // Reset form and refresh data
      setNewEvent({ title: '', description: '', date: '', start_time: '', end_time: '', location: '', capacity: '', image_url: '' });
      setShowCreateEvent(false);
      fetchData();
      showSuccess('Success', 'Event created successfully!');
    } catch (err) {
      console.error('Error creating event:', err);
      showError('Error', 'Failed to create event. Please try again.');
    }
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setShowCreateEvent(false); // Close create form if open
    setNewEvent({
      title: event.title,
      description: event.description || '',
      date: event.date ? event.date.split('T')[0] : '', // Convert to date format
      start_time: event.start_time || '',
      end_time: event.end_time || '',
      location: event.location || '',
      capacity: event.capacity?.toString() || '',
      image_url: event.image_url || ''
    });
  };

  const handleUpdateEvent = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingEvent || !newEvent.title || !newEvent.date) {
      showError('Validation Error', 'Please fill in title and date');
      return;
    }

    try {
      const { error } = await supabase
        .from('events')
        .update({
          title: newEvent.title,
          description: newEvent.description || null,
          date: newEvent.date,
          start_time: newEvent.start_time || null,
          end_time: newEvent.end_time || null,
          location: newEvent.location || null,
          capacity: newEvent.capacity ? parseInt(newEvent.capacity) : null,
          image_url: newEvent.image_url || null
        })
        .eq('id', editingEvent.id);

      if (error) {
        console.error('Error updating event:', error);
        showError('Error', 'Failed to update event. Please try again.');
        return;
      }

      // Reset form and refresh data
      setEditingEvent(null);
      setNewEvent({ title: '', description: '', date: '', start_time: '', end_time: '', location: '', capacity: '', image_url: '' });
      fetchData();
      showSuccess('Success', 'Event updated successfully!');
    } catch (err) {
      console.error('Error updating event:', err);
      showError('Error', 'Failed to update event. Please try again.');
    }
  };

  const handleDeleteEvent = async (eventId: string, eventTitle: string) => {
    const confirmed = await confirm({
      title: 'Delete Event',
      message: `Are you sure you want to delete "${eventTitle}"? This action cannot be undone.`,
      confirmText: 'Delete Event',
      cancelText: 'Cancel',
      type: 'danger'
    });

    if (!confirmed) return;

    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId);

      if (error) {
        console.error('Error deleting event:', error);
        showError('Error', 'Failed to delete event. Please try again.');
        return;
      }

      fetchData();
      showSuccess('Success', 'Event deleted successfully!');
    } catch (err) {
      console.error('Error deleting event:', err);
      showError('Error', 'Failed to delete event. Please try again.');
    }
  };

  const handleCreatePhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from('photos').insert([{
        ...newPhoto,
        year: newPhoto.year ? parseInt(newPhoto.year) : null,
        taken_at: newPhoto.taken_at || null
      }]);

      if (error) {
        console.error('Error creating photo:', error);
        showError('Error', 'Failed to add photo. Please try again.');
        return;
      }

      setNewPhoto({ title: '', description: '', event_title: '', year: '', taken_at: '', image_url: '' });
      fetchData();
      showSuccess('Success', 'Photo added successfully!');
    } catch (err) {
      console.error('Error creating photo:', err);
      showError('Error', 'Failed to add photo. Please try again.');
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

    try {
      const { error } = await supabase
        .from('photos')
        .update({
          ...newPhoto,
          year: newPhoto.year ? parseInt(newPhoto.year) : null,
          taken_at: newPhoto.taken_at || null
        })
        .eq('id', editingPhoto.id);

      if (error) {
        console.error('Error updating photo:', error);
        showError('Error', 'Failed to update photo. Please try again.');
        return;
      }

      setEditingPhoto(null);
      setNewPhoto({ title: '', description: '', event_title: '', year: '', taken_at: '', image_url: '' });
      fetchData();
      showSuccess('Success', 'Photo updated successfully!');
    } catch (err) {
      console.error('Error updating photo:', err);
      showError('Error', 'Failed to update photo. Please try again.');
    }
  };

  const handleDeletePhoto = async (photoId: string) => {
    const confirmed = await confirm({
      title: 'Delete Photo',
      message: 'Are you sure you want to delete this photo? This action cannot be undone.',
      confirmText: 'Delete Photo',
      cancelText: 'Cancel',
      type: 'danger'
    });

    if (!confirmed) return;

    try {
      const { error } = await supabase.from('photos').delete().eq('id', photoId);
      if (error) {
        console.error('Error deleting photo:', error);
        showError('Error', 'Failed to delete photo. Please try again.');
        return;
      }

      fetchData();
      showSuccess('Success', 'Photo deleted successfully!');
    } catch (err) {
      console.error('Error deleting photo:', err);
      showError('Error', 'Failed to delete photo. Please try again.');
    }
  };

  const handleCreateBoardMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBoardMember.name || !newBoardMember.role) {
      showError('Validation Error', 'Name and role are required.');
      return;
    }

    try {
      const { error } = await supabase.from('board_members').insert([{
        name: newBoardMember.name,
        role: newBoardMember.role,
        order_index: newBoardMember.order_index ? parseInt(newBoardMember.order_index) : null,
        email: newBoardMember.email
      }]);

      if (error) {
        console.error('Error creating board member:', error);
        showError('Error', 'Failed to create board member. Please try again.');
        return;
      }

      setNewBoardMember({ name: '', role: '', order_index: '', email: '' });
      setShowCreateBoardMember(false);
      fetchData();
      showSuccess('Success', 'Board member created successfully!');
    } catch (err) {
      console.error('Error creating board member:', err);
      showError('Error', 'Failed to create board member. Please try again.');
    }
  };

  const handleEditBoardMember = (member: any) => {
    setEditingBoardMember(member);
    setShowCreateBoardMember(false);
    setNewBoardMember({
      name: member.name,
      role: member.role,
      order_index: member.order_index?.toString() || '',
      email: member.email
    });
  };

  const handleUpdateBoardMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBoardMember) return;

    try {
      const { error } = await supabase
        .from('board_members')
        .update({
          name: newBoardMember.name,
          role: newBoardMember.role,
          order_index: newBoardMember.order_index ? parseInt(newBoardMember.order_index) : null,
          email: newBoardMember.email
        })
        .eq('id', editingBoardMember.id);

      if (error) {
        console.error('Error updating board member:', error);
        showError('Error', 'Failed to update board member. Please try again.');
        return;
      }

      setEditingBoardMember(null);
      setNewBoardMember({ name: '', role: '', order_index: '', email: '' });
      fetchData();
      showSuccess('Success', 'Board member updated successfully!');
    } catch (err) {
      console.error('Error updating board member:', err);
      showError('Error', 'Failed to update board member. Please try again.');
    }
  };

  const handleDeleteBoardMember = async (id: string, name: string) => {
    const confirmed = await confirm({
      title: 'Delete Board Member',
      message: `Are you sure you want to delete "${name}"? This action cannot be undone.`,
      confirmText: 'Delete Member',
      cancelText: 'Cancel',
      type: 'danger'
    });

    if (!confirmed) return;

    try {
      const { error } = await supabase.from('board_members').delete().eq('id', id);
      if (error) {
        console.error('Error deleting board member:', error);
        showError('Error', 'Failed to delete board member. Please try again.');
        return;
      }

      fetchData();
      showSuccess('Success', 'Board member deleted successfully!');
    } catch (err) {
      console.error('Error deleting board member:', err);
      showError('Error', 'Failed to delete board member. Please try again.');
    }
  };

  const handleToggleVisibility = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'visible' ? 'hidden' : 'visible';

    try {
      const { error } = await supabase
        .from('board_members')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) {
        console.error('Error toggling visibility:', error);
        showError('Error', 'Failed to toggle board member visibility.');
        return;
      }

      // Refresh the list of members
      fetchData();
      showSuccess(
        'Success',
        `Board member is now ${newStatus === 'visible' ? 'visible' : 'hidden'} on the public site.`
      );
    } catch (err) {
      console.error('Error toggling visibility:', err);
      showError('Error', 'Failed to toggle board member visibility.');
    }
  };

  // Resource management functions
  const handleCreateResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newResource.title || !newResource.url) {
      showError('Validation Error', 'Please fill in title and URL');
      return;
    }

    try {
      const { error } = await supabase
        .from('resources')
        .insert([{
          title: newResource.title,
          description: newResource.description || null,
          url: newResource.url,
          category: newResource.category || null
        }]);

      if (error) {
        console.error('Error creating resource:', error);
        showError('Error', 'Failed to create resource. Please try again.');
        return;
      }

      setNewResource({ title: '', description: '', url: '', category: '' });
      setShowCreateResource(false);
      fetchData();
      showSuccess('Success', 'Resource created successfully!');
    } catch (err) {
      console.error('Error creating resource:', err);
      showError('Error', 'Failed to create resource. Please try again.');
    }
  };

  const handleEditResource = (resource: Resource) => {
    setEditingResource(resource);
    setShowCreateResource(false);
    setNewResource({
      title: resource.title,
      description: resource.description || '',
      url: resource.url,
      category: resource.category || ''
    });
  };

  const handleUpdateResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingResource || !newResource.title || !newResource.url) {
      showError('Validation Error', 'Please fill in title and URL');
      return;
    }

    try {
      const { error } = await supabase
        .from('resources')
        .update({
          title: newResource.title,
          description: newResource.description || null,
          url: newResource.url,
          category: newResource.category || null
        })
        .eq('id', editingResource.id);

      if (error) {
        console.error('Error updating resource:', error);
        showError('Error', 'Failed to update resource. Please try again.');
        return;
      }

      setEditingResource(null);
      setNewResource({ title: '', description: '', url: '', category: '' });
      fetchData();
      showSuccess('Success', 'Resource updated successfully!');
    } catch (err) {
      console.error('Error updating resource:', err);
      showError('Error', 'Failed to update resource. Please try again.');
    }
  };

  const handleDeleteResource = async (resourceId: string, resourceTitle: string) => {
    const confirmed = await confirm({
      title: 'Delete Resource',
      message: `Are you sure you want to delete "${resourceTitle}"? This action cannot be undone.`,
      confirmText: 'Delete Resource',
      cancelText: 'Cancel',
      type: 'danger'
    });

    if (!confirmed) return;

    try {
      const { error } = await supabase
        .from('resources')
        .delete()
        .eq('id', resourceId);

      if (error) {
        console.error('Error deleting resource:', error);
        showError('Error', 'Failed to delete resource. Please try again.');
        return;
      }

      fetchData();
      showSuccess('Success', 'Resource deleted successfully!');
    } catch (err) {
      console.error('Error deleting resource:', err);
      showError('Error', 'Failed to delete resource. Please try again.');
    }
  };

  // Sponsor management functions
  const handleCreateSponsor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSponsor.name) {
      showError('Validation Error', 'Please fill in sponsor name');
      return;
    }

    try {
      const { error } = await supabase
        .from('sponsorships')
        .insert([{
          name: newSponsor.name,
          logo_url: newSponsor.logo_url || null,
          description: newSponsor.description || null,
          website: newSponsor.website || null,
          order_index: newSponsor.order_index ? parseInt(newSponsor.order_index) : null
        }]);

      if (error) {
        console.error('Error creating sponsor:', error);
        showError('Error', 'Failed to create sponsor. Please try again.');
        return;
      }

      setNewSponsor({ name: '', logo_url: '', description: '', website: '', order_index: '' });
      setShowCreateSponsor(false);
      fetchData();
      showSuccess('Success', 'Sponsor created successfully!');
    } catch (err) {
      console.error('Error creating sponsor:', err);
      showError('Error', 'Failed to create sponsor. Please try again.');
    }
  };

  const handleEditSponsor = (sponsor: Sponsor) => {
    setEditingSponsor(sponsor);
    setShowCreateSponsor(false);
    setNewSponsor({
      name: sponsor.name,
      logo_url: sponsor.logo_url || '',
      description: sponsor.description || '',
      website: sponsor.website || '',
      order_index: sponsor.order_index?.toString() || ''
    });
  };

  const handleUpdateSponsor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSponsor || !newSponsor.name) {
      showError('Validation Error', 'Please fill in sponsor name');
      return;
    }

    try {
      const { error } = await supabase
        .from('sponsorships')
        .update({
          name: newSponsor.name,
          logo_url: newSponsor.logo_url || null,
          description: newSponsor.description || null,
          website: newSponsor.website || null,
          order_index: newSponsor.order_index ? parseInt(newSponsor.order_index) : null
        })
        .eq('id', editingSponsor.id);

      if (error) {
        console.error('Error updating sponsor:', error);
        showError('Error', 'Failed to update sponsor. Please try again.');
        return;
      }

      setEditingSponsor(null);
      setNewSponsor({ name: '', logo_url: '', description: '', website: '', order_index: '' });
      fetchData();
      showSuccess('Success', 'Sponsor updated successfully!');
    } catch (err) {
      console.error('Error updating sponsor:', err);
      showError('Error', 'Failed to update sponsor. Please try again.');
    }
  };

  const handleDeleteSponsor = async (sponsorId: string, sponsorName: string) => {
    const confirmed = await confirm({
      title: 'Delete Sponsor',
      message: `Are you sure you want to delete "${sponsorName}"? This action cannot be undone.`,
      confirmText: 'Delete Sponsor',
      cancelText: 'Cancel',
      type: 'danger'
    });

    if (!confirmed) return;

    try {
      const { error } = await supabase
        .from('sponsorships')
        .delete()
        .eq('id', sponsorId);

      if (error) {
        console.error('Error deleting sponsor:', error);
        showError('Error', 'Failed to delete sponsor. Please try again.');
        return;
      }

      fetchData();
      showSuccess('Success', 'Sponsor deleted successfully!');
    } catch (err) {
      console.error('Error deleting sponsor:', err);
      showError('Error', 'Failed to delete sponsor. Please try again.');
    }
  };


  // Helper functions for opening/closing forms
  const closeEventForm = () => {
    setEditingEvent(null);  // resets editingEvent
    setShowCreateEvent(false);  // resets create state
    clearForm();  // clears the form data
  };
  
  const openCreatePhoto = () => {
    setEditingPhoto(null);
    setNewPhoto({ title: '', description: '', event_title: '', year: '', taken_at: '', image_url: '' });
    setShowCreatePhoto(true);
  };

  const closePhotoForm = () => {
    setEditingPhoto(null);
    setNewPhoto({ title: '', description: '', event_title: '', year: '', taken_at: '', image_url: '' });
    setShowCreatePhoto(false);
  };

  const openCreateBoardMember = () => {
    setShowCreateBoardMember(true);
    setEditingBoardMember(null);
    setNewBoardMember({ name: '', role: '', order_index: '', email: '' });
  };

  const closeBoardMemberForm = () => {
    setShowCreateBoardMember(false);
    setEditingBoardMember(null);
    setNewBoardMember({ name: '', role: '', order_index: '', email: '' });
  };

  const openCreateResource = () => {
    setEditingResource(null);
    setNewResource({ title: '', description: '', url: '', category: '' });
    setShowCreateResource(true);
  };

  const closeResourceForm = () => {
    setEditingResource(null);
    setNewResource({ title: '', description: '', url: '', category: '' });
    setShowCreateResource(false);
  };

  const openCreateSponsor = () => {
    setEditingSponsor(null);
    setNewSponsor({ name: '', logo_url: '', description: '', website: '', order_index: '' });
    setShowCreateSponsor(true);
  };

  const closeSponsorForm = () => {
    setEditingSponsor(null);
    setNewSponsor({ name: '', logo_url: '', description: '', website: '', order_index: '' });
    setShowCreateSponsor(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-orange-50 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
            <p className="mt-4 text-stone-600">Loading admin data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-orange-50 py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-stone-900 mb-2">Admin Dashboard</h1>
              <p className="text-stone-600">Manage events and RSVPs for LASC</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-stone-500">
                Logged in as: {user?.email}
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors cursor-pointer font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Center Status Toggle */}
        <div className="my-4">
          <AdminCenterToggle />
        </div>

        <StatsCards
          events={events.length}
          rsvps={rsvps.length}
          sponsors={sponsors.length}
          photos={photos.length}
        />

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-lg mb-6 border border-orange-200">
          <TabNavigation
            activeTab={activeTab}
            onTabChange={setActiveTab}
            counts={{
              events: events.length,
              rsvps: rsvps.length,
              photos: photos.length,
              board: boardMembers.length,
              resources: resources.length,
              sponsors: sponsors.length
            }}
          />

          <div className="p-6">
            {activeTab === 'events' && (
              <EventsTab
                events={events}
                editingEvent={editingEvent}
                showCreateEvent={showCreateEvent}
                newEvent={newEvent}
                currentEvents={currentEvents}
                currentPage={currentPage}
                totalPages={totalPages}
                startIndex={startIndex}
                endIndex={endIndex}
                getRSVPCountForEvent={getRSVPCountForEvent}
                handleCreateNewEvent={handleCreateNewEvent}
                handleUpdateEvent={handleUpdateEvent}
                handleCreateEvent={handleCreateEvent}
                handleFormChange={handleFormChange}
                handleEditEvent={handleEditEvent}
                handleDeleteEvent={handleDeleteEvent}
                handlePageChange={handlePageChange}
                closeEventForm={closeEventForm}
                clearForm={clearForm}
              />
            )}
            {activeTab === 'rsvps' && (
              <RSVPsTab rsvps={rsvps} />
            )}
            {activeTab === 'photos' && (
              <PhotosTab
                photos={photos}
                editingPhoto={editingPhoto}
                showCreatePhoto={showCreatePhoto}
                newPhoto={newPhoto}
                sortPhotosBy={sortPhotosBy}
                handlePhotoFormChange={handlePhotoFormChange}
                handleUpdatePhoto={handleUpdatePhoto}
                handleCreatePhoto={handleCreatePhoto}
                handleEditPhoto={handleEditPhoto}
                handleDeletePhoto={handleDeletePhoto}
                setSortPhotosBy={setSortPhotosBy}
                openCreatePhoto={openCreatePhoto}
                closePhotoForm={closePhotoForm}
              />
            )}
            {activeTab === 'board' && (
              <BoardTab
                boardMembers={boardMembers}
                editingBoardMember={editingBoardMember}
                showCreateBoardMember={showCreateBoardMember}
                newBoardMember={newBoardMember}
                handleBoardFormChange={handleBoardFormChange}
                handleUpdateBoardMember={handleUpdateBoardMember}
                handleCreateBoardMember={handleCreateBoardMember}
                handleEditBoardMember={handleEditBoardMember}
                handleDeleteBoardMember={handleDeleteBoardMember}
                handleToggleVisibility={handleToggleVisibility}
                openCreateBoardMember={openCreateBoardMember}
                closeBoardMemberForm={closeBoardMemberForm}
              />
            )}
            {activeTab === 'resources' && (
              <ResourcesTab
                resources={resources}
                editingResource={editingResource}
                showCreateResource={showCreateResource}
                newResource={newResource}
                handleResourceFormChange={handleResourceFormChange}
                handleUpdateResource={handleUpdateResource}
                handleCreateResource={handleCreateResource}
                handleEditResource={handleEditResource}
                handleDeleteResource={handleDeleteResource}
                openCreateResource={openCreateResource}
                closeResourceForm={closeResourceForm}
              />
            )}
            {activeTab === 'sponsors' && (
              <SponsorsTab
                sponsors={sponsors}
                editingSponsor={editingSponsor}
                showCreateSponsor={showCreateSponsor}
                newSponsor={newSponsor}
                handleSponsorFormChange={handleSponsorFormChange}
                handleUpdateSponsor={handleUpdateSponsor}
                handleCreateSponsor={handleCreateSponsor}
                handleEditSponsor={handleEditSponsor}
                handleDeleteSponsor={handleDeleteSponsor}
                openCreateSponsor={openCreateSponsor}
                closeSponsorForm={closeSponsorForm}
              />
            )}
            {isRoot && (
              <div>
                <RootManageUsersPanel />
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
