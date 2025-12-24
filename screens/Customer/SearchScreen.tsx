
import React, { useState, useEffect } from 'react';
import { MapPinIcon } from '../../components/icons';

interface SearchScreenProps {
  onSearch: (service: string, location: string) => void;
  onGoHome: () => void;
}

const SearchScreen: React.FC<SearchScreenProps> = ({ onSearch, onGoHome }) => {
  const [service, setService] = useState('');
  const [location, setLocation] = useState('');
  const [isLocating, setIsLocating] = useState(false);

  const popularServices = ["Plumber", "Electrician", "AC Repair", "Carpenter"];
  
  const handleAutoDetectLocation = () => {
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
        (position) => {
            setLocation(`Lat: ${position.coords.latitude.toFixed(2)}, Lon: ${position.coords.longitude.toFixed(2)}`);
            setIsLocating(false);
        },
        () => {
            // Handle error or permission denial
            setLocation("Could not get location");
            setIsLocating(false);
        }
    );
  };

  const handleSearchClick = () => {
    if (service.trim() && location.trim()) {
        onSearch(service, location);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col p-6 relative">
        <button onClick={onGoHome} className="absolute top-6 right-6 text-sm font-semibold text-blue-600 hover:underline z-10">
            Change Role
        </button>
        <h1 className="text-3xl font-bold text-gray-800 mt-8">What service do you need?</h1>
        <p className="text-gray-500 mt-2">Book reliable professionals at a tap.</p>

        <div className="mt-8 space-y-4">
            <input
                type="text"
                value={service}
                onChange={(e) => setService(e.target.value)}
                placeholder="e.g., Plumber, Electrician"
                className="w-full p-4 border-2 border-gray-200 rounded-lg text-lg focus:outline-none focus:border-blue-500"
            />
            <div className="relative">
                <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Your location"
                    className="w-full p-4 border-2 border-gray-200 rounded-lg text-lg focus:outline-none focus:border-blue-500"
                />
                <button 
                    onClick={handleAutoDetectLocation}
                    disabled={isLocating}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-500 font-semibold text-sm flex items-center"
                >
                    <MapPinIcon className="w-5 h-5 mr-1"/>
                    {isLocating ? 'Locating...' : 'Auto-detect'}
                </button>
            </div>
        </div>

        <div className="mt-6">
            <h2 className="font-semibold text-gray-600">Popular Services</h2>
            <div className="flex flex-wrap gap-2 mt-2">
                {popularServices.map(s => (
                    <button key={s} onClick={() => setService(s)} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                        {s}
                    </button>
                ))}
            </div>
        </div>

        <div className="mt-auto">
            <button
                onClick={handleSearchClick}
                disabled={!service.trim() || !location.trim()}
                className="w-full bg-blue-500 text-white font-bold py-4 px-4 rounded-lg shadow-lg hover:bg-blue-600 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
                Search
            </button>
        </div>
    </div>
  );
};

export default SearchScreen;
