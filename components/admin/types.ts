export type Event = {
  id: string;
  title: string;
  date: string | null;
  start_time: string;
  end_time: string;
  description?: string;
  location?: string;
  capacity?: number;
  image_url?: string;
  created_at: string;
};

export type RSVP = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  event_id: string;
  created_at: string;
  events?: Event;
};

export type Photo = {
  id: string;
  title: string;
  description?: string;
  event_title?: string;
  year?: number;
  taken_at?: string;
  image_url: string;
  created_at?: string;
};

export type BoardMember = {
  id: string;
  name: string;
  role: string;
  email: string;
  status: string;
};

export type Resource = {
  id: string;
  title: string;
  description?: string;
  url: string;
  category?: string;
  created_at: string;
};

export type Sponsor = {
  id: string;
  name: string;
  logo_url?: string;
  description?: string;
  website?: string;
  order_index?: number;
  created_at: string;
};

