
export enum UserRole {
  Customer = 'CUSTOMER',
  Provider = 'PROVIDER',
}

export enum ServiceCategory {
  Plumber = 'Plumber',
  Electrician = 'Electrician',
  ACRepair = 'AC Repair',
  Carpenter = 'Carpenter',
  Painter = 'Painter',
}

// New type to store user role linked to their auth uid
export interface UserProfile {
  uid: string;
  role: UserRole;
  email: string;
  name: string;
  photoURL?: string;
}

export interface Review {
  id: string;
  authorName: string;
  authorImage: string;
  rating: number;
  comment: string;
  date: string;
}

export interface ServiceProvider {
  uid: string; // Changed from id to uid for Firebase integration
  name: string;
  profilePhoto: string;
  isVerified: boolean; // Platform verified (e.g. after manual check)
  isApproved: boolean; // Admin approved to go live
  isOnline: boolean;
  rating: number;
  jobsCompleted: number;
  services: ServiceCategory[];
  pricePerHour: number;
  distanceKm?: number; // Will be calculated dynamically
  location: {
    latitude: number;
    longitude: number;
    areaName: string;
  };
  availability: 'Today' | 'Tomorrow' | 'Later';
  experienceYears: number;
  workGallery: string[];
  verifications: {
    phone: boolean;
    police: boolean;
  };
  reviews: Review[];
}
