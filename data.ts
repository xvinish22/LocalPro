
import { ServiceProvider, ServiceCategory } from './types';

// Locations are now specific to Pune for the limited launch
export const mockServiceProviders: ServiceProvider[] = [
  {
    id: '1',
    name: 'Rajesh Kumar',
    profilePhoto: 'https://picsum.photos/id/1005/200/200',
    isVerified: true,
    isApproved: true, // Auto-approved
    isOnline: true,
    rating: 4.8,
    jobsCompleted: 124,
    services: [ServiceCategory.Plumber],
    pricePerHour: 450,
    location: { latitude: 18.4591, longitude: 73.8512, areaName: "Katraj" },
    availability: 'Today',
    experienceYears: 8,
    workGallery: ['https://picsum.photos/id/10/400/300', 'https://picsum.photos/id/11/400/300'],
    verifications: { phone: true, police: true },
    reviews: [
      { id: 'r1', authorName: 'Anjali S.', authorImage: 'https://picsum.photos/id/1011/100/100', rating: 5, comment: 'Very professional and quick service. Highly recommended!', date: '2 days ago' },
      { id: 'r2', authorName: 'Vikram B.', authorImage: 'https://picsum.photos/id/1012/100/100', rating: 4, comment: 'Good work, but was a bit late.', date: '1 week ago' },
    ],
  },
  {
    id: '2',
    name: 'Sunita Sharma',
    profilePhoto: 'https://picsum.photos/id/1011/200/200',
    isVerified: true,
    isApproved: true, // Auto-approved
    isOnline: true,
    rating: 4.6,
    jobsCompleted: 88,
    services: [ServiceCategory.Electrician],
    pricePerHour: 500,
    location: { latitude: 18.4776, longitude: 73.8915, areaName: "Kondhwa" },
    availability: 'Today',
    experienceYears: 6,
    workGallery: ['https://picsum.photos/id/20/400/300', 'https://picsum.photos/id/21/400/300'],
    verifications: { phone: true, police: false },
    reviews: [
      { id: 'r3', authorName: 'Priya M.', authorImage: 'https://picsum.photos/id/1013/100/100', rating: 5, comment: 'Sunita fixed our wiring issue perfectly. Very knowledgeable.', date: '4 days ago' },
    ],
  },
  {
    id: '3',
    name: 'Amit Singh',
    profilePhoto: 'https://picsum.photos/id/1025/200/200',
    isVerified: false,
    isApproved: true, // Auto-approved
    isOnline: true,
    rating: 4.2,
    jobsCompleted: 35,
    services: [ServiceCategory.ACRepair],
    pricePerHour: 600,
    location: { latitude: 18.4784, longitude: 73.8631, areaName: "Bibwewadi" },
    availability: 'Tomorrow',
    experienceYears: 3,
    workGallery: ['https://picsum.photos/id/30/400/300'],
    verifications: { phone: true, police: false },
    reviews: [],
  },
  {
    id: '4',
    name: 'Karan Mehra',
    profilePhoto: 'https://picsum.photos/id/1084/200/200',
    isVerified: true,
    isApproved: true, // Auto-approved
    isOnline: true,
    rating: 4.9,
    jobsCompleted: 55,
    services: [ServiceCategory.Carpenter],
    pricePerHour: 520,
    location: { latitude: 18.4650, longitude: 73.8600, areaName: "Bibwewadi" },
    availability: 'Today',
    experienceYears: 10,
    workGallery: [],
    verifications: { phone: true, police: false },
    reviews: [],
  },
];