
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
}

type FilterType = 'Price' | 'Rating' | 'Distance' | 'Availability';

// Mock customer location in Katraj, Pune
const CUSTOMER_LOCATION = { latitude: 18.4591, longitude: 73.8512, areaName: "Katraj" };

const ListingScreen: React.FC<ListingScreenProps> = ({ providers, onViewProfile, onBook, onBack }) => {
  const [activeFilter, setActiveFilter] = useState<FilterType | null>(null);

  const processedProviders = useMemo(() => {
    const visibleProviders = providers.filter(p => p.isApproved && p.isOnline);

    if (visibleProviders.length === 0) return [];

    const allDistancedProviders = visibleProviders.map(p => ({
      ...p,
      distanceKm: calculateDistance(CUSTOMER_LOCATION.latitude, CUSTOMER_LOCATION.longitude, p.location.latitude, p.location.longitude)
    }));

    let nearbyProviders = allDistancedProviders.filter(p => p.distanceKm <= 2);
    
    let isFallback = false;
    if (nearbyProviders.length === 0) {
      isFallback = true;
      allDistancedProviders.sort((a, b) => a.distanceKm - b.distanceKm);
      if (allDistancedProviders[0]) nearbyProviders = [allDistancedProviders[0]];
    }

    nearbyProviders.sort((a, b) => {
      const aIsInSameArea = a.location.areaName === CUSTOMER_LOCATION.areaName;
      const bIsInSameArea = b.location.areaName === CUSTOMER_LOCATION.areaName;
      if (aIsInSameArea !== bIsInSameArea) return aIsInSameArea ? -1 : 1;
      if (a.distanceKm !== b.distanceKm) return a.distanceKm - b.distanceKm;
      if (a.isVerified !== b.isVerified) return b.isVerified ? -1 : 1;
      if (a.experienceYears !== b.experienceYears) return b.experienceYears - a.experienceYears;
      return 0;
    });
    
    return nearbyProviders.map(p => ({
      ...p,
      isFar: isFallback || p.location.areaName !== CUSTOMER_LOCATION.areaName,
    }));

  }, [providers, activeFilter]);
  
  const handleFilterClick = (filter: FilterType) => {
    setActiveFilter(prev => prev === filter ? null : filter);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="p-4 bg-white border-b sticky top-0 z-10">
        <div className="flex items-center">
          <button onClick={onBack} className="p-2 -ml-2 mr-2"><ArrowLeftIcon className="w-6 h-6 text-gray-600"/></button>
          <h1 className="text-xl font-bold text-gray-800">Providers in {CUSTOMER_LOCATION.areaName}</h1>
        </div>
        <div className="flex gap-2 overflow-x-auto py-2 mt-2">
          {(['Distance', 'Rating', 'Price', 'Availability'] as FilterType[]).map((filter) => (
            <FilterPill key={filter} label={filter} isActive={activeFilter === filter} onClick={() => handleFilterClick(filter)} />
          ))}
        </div>
      </header>
      
      <main className="flex-grow p-4 bg-gray-50 overflow-y-auto">
        {processedProviders.length > 0 ? (
          processedProviders.map((provider) => (
            <ServiceCard
              key={provider.uid}
              provider={provider}
              onViewProfile={onViewProfile}
              onBook={onBook}
              isFar={(provider as any).isFar}
            />
          ))
        ) : (
          <div className="text-center py-16 px-6">
            <h3 className="text-xl font-semibold text-gray-700">No service providers found</h3>
            <p className="text-gray-500 mt-2">We are expanding our network. Please check back later.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default ListingScreen;
