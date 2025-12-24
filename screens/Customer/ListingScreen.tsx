
import React, { useState, useMemo, useEffect } from 'react';
import { ServiceProvider } from '../../types';
import ServiceCard from '../../components/ServiceCard';
import FilterPill from '../../components/FilterPill';
import { ArrowLeftIcon } from '../../components/icons';
import { calculateDistance } from '../../utils/location';
import { PUNE_LOCATIONS } from '../../utils/puneLocation';

interface ListingScreenProps {
  providers: ServiceProvider[];
  onViewProfile: (provider: ServiceProvider) => void;
  onBook: (provider: ServiceProvider) => void;
  onBack: () => void;
  onGoHome: () => void;
}

type FilterType = 'Price' | 'Rating' | 'Distance' | 'Availability';

// Mock customer location in Katraj, Pune
const CUSTOMER_LOCATION = { latitude: 18.4591, longitude: 73.8512, areaName: "Katraj" };

const ListingScreen: React.FC<ListingScreenProps> = ({ providers, onViewProfile, onBook, onBack, onGoHome }) => {
  const [activeFilter, setActiveFilter] = useState<FilterType | null>(null);

  // DEBUG: Log customer location once
  useEffect(() => {
    console.log('[DEBUG] Customer Location:', CUSTOMER_LOCATION);
  }, []);

  const processedProviders = useMemo(() => {
    // 1. Filter for providers who are approved by admin and currently online
    const visibleProviders = providers.filter(p => p.isApproved && p.isOnline);

    if (visibleProviders.length === 0) {
      return [];
    }

    // 2. Map and calculate distance for all visible providers
    const allDistancedProviders = visibleProviders.map(p => {
      const distance = calculateDistance(
        CUSTOMER_LOCATION.latitude,
        CUSTOMER_LOCATION.longitude,
        p.location.latitude,
        p.location.longitude
      );
      return { ...p, distanceKm: distance };
    });

    // 3. Filter by 2km radius
    let nearbyProviders = allDistancedProviders.filter(p => p.distanceKm <= 2);
    
    // 4. Fallback Logic: If no providers are within 2km, find the single closest one from any allowed area
    let isFallback = false;
    if (nearbyProviders.length === 0) {
      isFallback = true;
      allDistancedProviders.sort((a, b) => a.distanceKm - b.distanceKm);
      const closestProvider = allDistancedProviders[0];
      if (closestProvider) {
        nearbyProviders = [closestProvider]; // Use an array with the single closest provider
      }
    }

    // 5. Sort providers by the new hyperlocal criteria
    nearbyProviders.sort((a, b) => {
      // Priority 1: Same Area vs. Different Area
      const aIsInSameArea = a.location.areaName === CUSTOMER_LOCATION.areaName;
      const bIsInSameArea = b.location.areaName === CUSTOMER_LOCATION.areaName;
      if (aIsInSameArea !== bIsInSameArea) return aIsInSameArea ? -1 : 1;

      // Priority 2: Nearest distance
      if (a.distanceKm !== b.distanceKm) return a.distanceKm - b.distanceKm;

      // Priority 3: Verified status
      if (a.isVerified !== b.isVerified) return b.isVerified ? -1 : 1;
        
      // Priority 4: Experience (higher is better)
      if (a.experienceYears !== b.experienceYears) return b.experienceYears - a.experienceYears;

      return 0; // Default no change
    });
    
    // Attach a flag to denote providers that are not in the customer's immediate area
    return nearbyProviders.map(p => ({
      ...p,
      isFar: isFallback || p.location.areaName !== CUSTOMER_LOCATION.areaName,
    }));

  }, [providers, activeFilter]);
  
  const handleFilterClick = (filter: FilterType) => {
    setActiveFilter(prev => prev === filter ? null : filter);
  };

  return (
    <div className="flex flex-col h-screen">
      <header className="p-4 bg-white border-b sticky top-0 z-10">
        <div className="flex items-center justify-between">
            <div className="flex items-center">
                <button onClick={onBack} className="p-2 -ml-2 mr-2">
                    <ArrowLeftIcon className="w-6 h-6 text-gray-600"/>
                </button>
                <h1 className="text-xl font-bold text-gray-800">Providers in {CUSTOMER_LOCATION.areaName}</h1>
            </div>
            <button onClick={onGoHome} className="text-sm font-semibold text-blue-600 hover:underline">
                Change Role
            </button>
        </div>
        <div className="flex gap-2 overflow-x-auto py-2 mt-2">
          {(['Distance', 'Rating', 'Price', 'Availability'] as FilterType[]).map((filter) => (
            <FilterPill
              key={filter}
              label={filter}
              isActive={activeFilter === filter}
              onClick={() => handleFilterClick(filter)}
            />
          ))}
        </div>
      </header>
      
      <main className="flex-grow p-4 bg-gray-50 overflow-y-auto">
        {providers.length === 0 ? (
          <div className="text-center py-16 px-6">
            <h3 className="text-xl font-semibold text-gray-700">No service providers available yet</h3>
            <p className="text-gray-500 mt-2">Be the first to register as a service provider.</p>
            <button
              onClick={onGoHome}
              className="mt-6 bg-blue-500 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-blue-600 transition-all"
            >
              Register as Provider
            </button>
          </div>
        ) : processedProviders.length > 0 ? (
          processedProviders.map((provider) => (
            <ServiceCard
              key={provider.id}
              provider={provider}
              onViewProfile={onViewProfile}
              onBook={onBook}
              isFar={(provider as any).isFar}
            />
          ))
        ) : (
          <div className="text-center py-16 px-6">
            <h3 className="text-xl font-semibold text-gray-700">No service providers available in this area yet</h3>
            <p className="text-gray-500 mt-2">We are onboarding professionals near your college.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default ListingScreen;