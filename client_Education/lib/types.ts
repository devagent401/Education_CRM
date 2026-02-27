// API-ready types for future backend integration
export interface Institution {
  id: string;
  name: string;
  slug: string;
  email: string;
  phone?: string;
  address?: string;
  logoUrl?: string;
  primaryColor?: string;
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  description: string;
  duration: string;
  eligibility: string;
  outcomes: string[];
  imageUrl?: string;
}

export interface Faculty {
  id: string;
  name: string;
  role: string;
  qualification: string;
  imageUrl?: string;
  socialLinks?: { type: string; url: string }[];
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  imageUrl?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  type: "image" | "video";
  url: string;
  thumbnailUrl?: string;
}

export interface Notice {
  id: string;
  slug: string;
  title: string;
  content: string;
  publishedAt: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  avatarUrl?: string;
}
