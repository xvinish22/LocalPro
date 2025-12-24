
import React, { useState, useEffect, useCallback } from 'react';
import { User } from 'firebase/auth';
import { UserRole, ServiceProvider, UserProfile } from './types';
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
import { onAuthStateChangedListener, signOutUser } from './firebase';

// --- Profile Management Screen Component ---
interface ProfileManagementScreenProps {
  provider: ServiceProvider;
  onUpdateProfile: (provider: ServiceProvider) => void;
  onBack: () => void;
}
const ProfileManagementScreen: React.FC<ProfileManagementScreenProps> = ({ provider, onUpdateProfile, onBack }) => {
  const [price, setPrice] = useState(provider.pricePerHour);
  const [experience, setExperience] = useState(provider.experienceYears);
  const handleSave = () => {
    onUpdateProfile({ ...provider, pricePerHour: price, experienceYears: experience });
  };
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="p-4 bg-white border-b sticky top-0 z-10 flex items-center">
        <button onClick={onBack} className="p-2 -ml-2 mr-2"><ArrowLeftIcon className="w-6 h-6 text-gray-600" /></button>
        <h1 className="text-xl font-bold text-gray-800">Manage Profile</h1>
      </header>
      <main className="flex-grow p-5 space-y-6">
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Price per hour (₹)</label>
          <input type="number" id="price" value={price} onChange={e => setPrice(parseInt(e.target.value) || 0)} className="w-full p-3 border rounded-lg" />
        </div>
        <div>
          <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">Years of experience</label>
          <input type="number" id="experience" value={experience} onChange={e => setExperience(parseInt(e.target.value) || 0)} className="w-full p-3 border rounded-lg" />
        </div>
      </main>
      <footer className="p-4 border-t bg-white sticky bottom-0">
        <button onClick={handleSave} className="w-full bg-blue-500 text-white font-bold py-3 rounded-lg">Save Changes</button>
      </footer>
    </div>
  );
};

// --- Main App Component ---
const App: React.FC = () => {
  // Auth state
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // App state
  const [view, setView] = useState('landing');
  const [selectedProvider, setSelectedProvider] = useState<ServiceProvider | null>(null);
  const [lastBooking, setLastBooking] = useState<{provider: ServiceProvider, service: string} | null>(null);
  
  // Data state (simulating a database)
  const [userProfiles, setUserProfiles] = useState<UserProfile[]>([]);
  const [allProviders, setAllProviders] = useState<ServiceProvider[]>(mockServiceProviders);

  // Session management effect
  useEffect(() => {
    const unsubscribe = onAuthStateChangedListener((user) => {
      setIsLoading(true);
      if (user) {
        setAuthUser(user);
        // Find existing profile in our "database"
        const existingProfile = userProfiles.find(p => p.uid === user.uid);
        if (existingProfile) {
          setUserProfile(existingProfile);
          setView(existingProfile.role === UserRole.Customer ? 'search' : 'dashboard');
        } else {
          // New user, wait for role selection
          setUserProfile(null);
          setView('roleSelection');
        }
      } else {
        setAuthUser(null);
        setUserProfile(null);
        setView('landing');
      }
      setIsLoading(false);
    });
    return unsubscribe;
  }, [userProfiles]);

  const handleSignOut = async () => {
    await signOutUser();
  };

  const handleRoleSelect = (role: UserRole) => {
    if (!authUser) return;
    const newProfile: UserProfile = {
      uid: authUser.uid,
      role,
      email: authUser.email!,
      name: authUser.displayName!,
      photoURL: authUser.photoURL || undefined,
    };
    setUserProfiles(prev => [...prev, newProfile]);
    setUserProfile(newProfile);
    setView(role === UserRole.Customer ? 'search' : 'onboarding');
  };
  
  const handleProviderOnboardingComplete = (newProviderData: Omit<ServiceProvider, 'uid'>) => {
    if (!userProfile || userProfile.role !== UserRole.Provider) return;
    const newProvider: ServiceProvider = {
        ...newProviderData,
        uid: userProfile.uid,
        name: userProfile.name, // Use name from Google profile
        profilePhoto: userProfile.photoURL || 'https://picsum.photos/id/1084/200/200',
    };
    setAllProviders(prev => [...prev, newProvider]);
    setView('dashboard');
  };

  const handleToggleOnlineStatus = (providerId: string, isOnline: boolean) => {
    setAllProviders(prev => prev.map(p => p.uid === providerId ? { ...p, isOnline } : p));
  };
  
  const handleProfileUpdate = (updatedProviderData: ServiceProvider) => {
    setAllProviders(prev => prev.map(p => p.uid === updatedProviderData.uid ? updatedProviderData : p));
    setView('dashboard');
  };
  
  const handleGoHome = () => {
    setView(userProfile?.role === UserRole.Customer ? 'search' : 'dashboard');
    setSelectedProvider(null);
    setLastBooking(null);
  }

  // Customer flow handlers
  const handleSearch = useCallback(() => setView('listing'), []);
  const handleViewProfile = (provider: ServiceProvider) => { setSelectedProvider(provider); setView('profile'); };
  const handleBook = (provider: ServiceProvider) => { setSelectedProvider(provider); setView('booking'); };
  const handleBookingConfirmed = (provider: ServiceProvider, service: string) => {
    setLastBooking({ provider, service });
    setTimeout(() => setView('rating'), 3000);
  };
  const handleRatingSubmitted = () => { setLastBooking(null); setView('search'); };

  const renderContent = () => {
    if (isLoading) {
      return <div className="flex justify-center items-center h-screen"><div>Loading...</div></div>;
    }

    if (!authUser) {
      return <LandingScreen />;
    }
    
    if (!userProfile) {
      return <LandingScreen onRoleSelect={handleRoleSelect} isSelectingRole />;
    }

    if (userProfile.role === UserRole.Customer) {
      switch (view) {
        case 'search': return <SearchScreen onSearch={handleSearch} onSignOut={handleSignOut} />;
        case 'listing': return <ListingScreen providers={allProviders} onViewProfile={handleViewProfile} onBook={handleBook} onBack={() => setView('search')} />;
        case 'profile': return selectedProvider && <ProfileScreen provider={selectedProvider} onBook={handleBook} onBack={() => setView('listing')} />;
        case 'booking': return selectedProvider && <BookingScreen provider={selectedProvider} onBookingConfirmed={handleBookingConfirmed} onBack={() => setView('profile')} />;
        case 'rating': return lastBooking && <RatingScreen booking={lastBooking} onRatingSubmitted={handleRatingSubmitted} />;
        default: return <SearchScreen onSearch={handleSearch} onSignOut={handleSignOut} />;
      }
    } 
    
    if (userProfile.role === UserRole.Provider) {
      const currentProvider = allProviders.find(p => p.uid === userProfile.uid);
      switch (view) {
        case 'onboarding': return <OnboardingScreen onOnboardingComplete={handleProviderOnboardingComplete} />;
        case 'dashboard': return currentProvider ? <DashboardScreen provider={currentProvider} onSignOut={handleSignOut} onToggleOnline={handleToggleOnlineStatus} onManageProfile={() => setView('profileManagement')} /> : <OnboardingScreen onOnboardingComplete={handleProviderOnboardingComplete} />;
        case 'profileManagement': return currentProvider && <ProfileManagementScreen provider={currentProvider} onUpdateProfile={handleProfileUpdate} onBack={() => setView('dashboard')} />;
        default: return <OnboardingScreen onOnboardingComplete={handleProviderOnboardingComplete} />;
      }
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
