
import React, { useState, useCallback } from 'react';
import { UserRole, ServiceProvider } from './types';
import LandingScreen from './screens/LandingScreen';
import SearchScreen from './screens/Customer/SearchScreen';
import ListingScreen from './screens/Customer/ListingScreen';
import ProfileScreen from './screens/Customer/ProfileScreen';
import BookingScreen from './screens/Customer/BookingScreen';
import RatingScreen from './screens/Customer/RatingScreen';
import OnboardingScreen from './screens/Provider/OnboardingScreen';
import DashboardScreen from './screens/Provider/DashboardScreen';
import { mockServiceProviders } from './data';
import { ArrowLeftIcon } from './components/icons';

// --- Profile Management Screen Component ---
// This component is placed here to avoid creating a new file, as per the constraints.
interface ProfileManagementScreenProps {
  provider: ServiceProvider;
  onUpdateProfile: (provider: ServiceProvider) => void;
  onBack: () => void;
}

const ProfileManagementScreen: React.FC<ProfileManagementScreenProps> = ({ provider, onUpdateProfile, onBack }) => {
  const [price, setPrice] = useState(provider.pricePerHour);
  const [experience, setExperience] = useState(provider.experienceYears);

  const handleSave = () => {
    if (!price || price <= 0) {
      alert("Price must be a positive number.");
      return;
    }
    if (!experience || experience <= 0) {
      alert("Experience must be a positive number.");
      return;
    }
    onUpdateProfile({
      ...provider,
      pricePerHour: price,
      experienceYears: experience,
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="p-4 bg-white border-b sticky top-0 z-10">
        <div className="flex items-center">
          <button onClick={onBack} className="p-2 -ml-2 mr-2">
            <ArrowLeftIcon className="w-6 h-6 text-gray-600" />
          </button>
          <h1 className="text-xl font-bold text-gray-800">Manage Profile</h1>
        </div>
      </header>
      <main className="flex-grow p-5 space-y-6 overflow-y-auto">
        {/* Price Input Section */}
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-3">Your Price</h3>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Price per hour</label>
          <div className="flex items-center gap-2 p-3 border border-gray-300 rounded-lg focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
            <span className="text-gray-500 font-semibold">₹</span>
            <input
              type="text"
              inputMode="numeric"
              id="price"
              value={price ? price : ''}
              onChange={e => setPrice(parseInt(e.target.value) || 0)}
              placeholder="Enter price"
              className="w-full text-lg outline-none bg-transparent"
            />
            <span className="text-gray-500">/ hour</span>
          </div>
        </div>

        {/* Experience Input Section */}
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-3">Your Experience</h3>
          <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">How many years of experience do you have?</label>
          <input
            type="text"
            inputMode="numeric"
            id="experience"
            placeholder="e.g., 5"
            value={experience ? experience : ''}
            onChange={e => setExperience(parseInt(e.target.value) || 0)}
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>
      </main>
      <footer className="p-4 border-t bg-white sticky bottom-0">
        <button onClick={handleSave} className="w-full bg-blue-500 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:bg-blue-600 transition-all">
          Save Changes
        </button>
      </footer>
    </div>
  );
};


// --- Main App Component ---
const App: React.FC = () => {
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [view, setView] = useState('landing');
  const [selectedProvider, setSelectedProvider] = useState<ServiceProvider | null>(null);
  const [lastBooking, setLastBooking] = useState<{provider: ServiceProvider, service: string} | null>(null);
  
  const [allProviders, setAllProviders] = useState<ServiceProvider[]>(mockServiceProviders);
  const [currentProviderId, setCurrentProviderId] = useState<string | null>(null);

  const handleRoleSelect = (role: UserRole) => {
    setUserRole(role);
    if (role === UserRole.Customer) {
      setView('search');
    } else {
      setView('onboarding');
    }
  };

  const handleGoHome = () => {
    setUserRole(null);
    setView('landing');
    setSelectedProvider(null);
    setLastBooking(null);
    setCurrentProviderId(null);
  };

  const handleProviderOnboardingComplete = (newProviderData: Omit<ServiceProvider, 'id'>) => {
    const newProvider: ServiceProvider = {
        ...newProviderData,
        id: `provider_${Date.now()}`
    };
    setAllProviders(prev => [...prev, newProvider]);
    setCurrentProviderId(newProvider.id);
    setView('dashboard');
  };

  const handleToggleOnlineStatus = (providerId: string, isOnline: boolean) => {
    setAllProviders(prev => prev.map(p => p.id === providerId ? { ...p, isOnline } : p));
  };

  const handleManageProfile = () => {
    setView('profileManagement');
  };

  const handleProfileUpdate = (updatedProviderData: ServiceProvider) => {
    setAllProviders(prev => prev.map(p => p.id === updatedProviderData.id ? updatedProviderData : p));
    setView('dashboard');
  };

  const handleSearch = useCallback((_service: string, _location: string) => {
    setView('listing');
  }, []);

  const handleViewProfile = (provider: ServiceProvider) => {
    setSelectedProvider(provider);
    setView('profile');
  };
  
  const handleBook = (provider: ServiceProvider) => {
    setSelectedProvider(provider);
    setView('booking');
  };

  const handleBookingConfirmed = (provider: ServiceProvider, service: string) => {
    setLastBooking({ provider, service });
    setTimeout(() => {
        setView('rating');
    }, 3000);
  };

  const handleRatingSubmitted = () => {
    setLastBooking(null);
    setView('search');
  };

  const renderContent = () => {
    if (userRole === UserRole.Customer) {
      switch (view) {
        case 'search':
          return <SearchScreen onSearch={handleSearch} onGoHome={handleGoHome} />;
        case 'listing':
          return <ListingScreen providers={allProviders} onViewProfile={handleViewProfile} onBook={handleBook} onBack={() => setView('search')} onGoHome={handleGoHome} />;
        case 'profile':
          return selectedProvider && <ProfileScreen provider={selectedProvider} onBook={handleBook} onBack={() => setView('listing')} />;
        case 'booking':
          return selectedProvider && <BookingScreen provider={selectedProvider} onBookingConfirmed={handleBookingConfirmed} onBack={() => setView('profile')} />;
        case 'rating':
          return lastBooking && <RatingScreen booking={lastBooking} onRatingSubmitted={handleRatingSubmitted} />;
        default:
          return <SearchScreen onSearch={handleSearch} onGoHome={handleGoHome} />;
      }
    } else if (userRole === UserRole.Provider) {
      const currentProvider = allProviders.find(p => p.id === currentProviderId);
      switch (view) {
        case 'onboarding':
          return <OnboardingScreen onOnboardingComplete={handleProviderOnboardingComplete} />;
        case 'dashboard':
          return currentProvider && <DashboardScreen provider={currentProvider} onGoHome={handleGoHome} onToggleOnline={handleToggleOnlineStatus} onManageProfile={handleManageProfile} />;
        case 'profileManagement':
          return currentProvider && <ProfileManagementScreen provider={currentProvider} onUpdateProfile={handleProfileUpdate} onBack={() => setView('dashboard')} />;
        default:
          return <OnboardingScreen onOnboardingComplete={handleProviderOnboardingComplete} />;
      }
    } else {
      return <LandingScreen onRoleSelect={handleRoleSelect} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      <div className="max-w-md mx-auto bg-white shadow-lg min-h-screen">
        {renderContent()}
      </div>
    </div>
  );
};

export default App;
