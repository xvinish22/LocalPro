
import React from 'react';
import { ServiceProvider } from '../types';
import { StarIcon, VerifiedIcon } from './icons';

interface ServiceCardProps {
  provider: ServiceProvider;
  onViewProfile: (provider: ServiceProvider) => void;
  onBook: (provider: ServiceProvider) => void;
  isFar?: boolean;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ provider, onViewProfile, onBook, isFar }) => {
  const isBookable = provider.isOnline;

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 mb-4 ${!isBookable ? 'opacity-60' : ''}`}>
      <div className="p-4">
        <div className="flex items-start">
          <img
            src={provider.profilePhoto}
            alt={provider.name}
            className="w-16 h-16 rounded-full object-cover mr-4 border-2 border-gray-100"
          />
          <div className="flex-grow">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <h3 className="text-lg font-bold text-gray-800">{provider.name}</h3>
                {provider.isVerified && <VerifiedIcon className="w-5 h-5 text-blue-500 ml-2" />}
              </div>
              <p className="text-lg font-bold text-blue-600">₹{provider.pricePerHour}/hr</p>
            </div>
            <div className="flex items-center text-sm text-gray-500 mt-1">
              <StarIcon className="w-4 h-4 text-yellow-400 mr-1" />
              <span className="font-semibold text-gray-700">{provider.rating.toFixed(1)}</span>
              <span className="mx-2">·</span>
              <span>{provider.jobsCompleted} jobs</span>
            </div>
             <p className="text-sm text-gray-600 mt-2 bg-blue-50 text-blue-700 font-medium py-1 px-2 rounded-full inline-block">
                {provider.services.join(', ')}
             </p>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center text-sm text-gray-600">
            {isFar ? (
                <div className="w-full text-center text-orange-600 font-semibold">
                    Nearby area ({provider.distanceKm} km)
                </div>
            ) : (
                <>
                    <div>
                        <span className="font-semibold">{provider.distanceKm} km away</span>
                    </div>
                    <div className={`font-semibold px-2 py-0.5 rounded-full ${provider.availability === 'Today' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        Available: {provider.availability}
                    </div>
                </>
            )}
        </div>
      </div>
       <div className="grid grid-cols-2 gap-px bg-gray-100">
            <button
                onClick={() => onViewProfile(provider)}
                className="w-full bg-white text-center py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
                View Profile
            </button>
            <button
                onClick={() => isBookable && onBook(provider)}
                disabled={!isBookable}
                className="w-full bg-blue-500 text-white text-center py-3 text-sm font-semibold hover:bg-blue-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
                {isBookable ? 'Book' : 'Offline'}
            </button>
        </div>
    </div>
  );
};

export default ServiceCard;