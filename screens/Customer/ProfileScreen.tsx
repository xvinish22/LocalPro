
import React from 'react';
import { ServiceProvider } from '../../types';
import { VerifiedIcon, StarIcon, CheckCircleIcon, ArrowLeftIcon } from '../../components/icons';
import StarRating from '../../components/StarRating';

interface ProfileScreenProps {
  provider: ServiceProvider;
  onBook: (provider: ServiceProvider) => void;
  onBack: () => void;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ provider, onBook, onBack }) => {
  const isBookable = provider.isOnline;

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <header className="absolute top-0 left-0 p-4 z-10">
        <button onClick={onBack} className="bg-white/70 backdrop-blur-sm rounded-full p-2">
          <ArrowLeftIcon className="w-6 h-6 text-gray-800" />
        </button>
      </header>
      <main className="flex-grow overflow-y-auto">
        <div className="relative">
          <img src={provider.profilePhoto} alt={provider.name} className="w-full h-64 object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        </div>
        
        <div className="p-5 -mt-16 bg-white rounded-t-2xl relative z-0">
          <div className="flex items-center">
            <h1 className="text-3xl font-bold text-gray-900">{provider.name}</h1>
            {provider.isVerified && <VerifiedIcon className="w-7 h-7 text-blue-500 ml-2" />}
          </div>
          <p className="text-gray-600 mt-1">{provider.services.join(', ')}</p>

          <div className="flex items-center text-md text-gray-600 my-4">
            <StarIcon className="w-5 h-5 text-yellow-400 mr-1" />
            <span className="font-bold text-gray-800">{provider.rating.toFixed(1)}</span>
            <span className="mx-2">·</span>
            <span>{provider.jobsCompleted} jobs completed</span>
            <span className="mx-2">·</span>
            <span>{provider.experienceYears} years exp.</span>
          </div>

          <div className="my-6">
            <h2 className="text-xl font-bold mb-3">Trust Indicators</h2>
            <div className="bg-gray-100 p-3 rounded-lg text-center">
                <p className="text-sm text-gray-600">Verification will be added in future updates</p>
            </div>
          </div>
          
          {provider.workGallery.length > 0 && (
            <div className="my-6">
              <h2 className="text-xl font-bold mb-3">Work Gallery</h2>
              <div className="grid grid-cols-2 gap-3">
                {provider.workGallery.map((img, index) => (
                  <img key={index} src={img} alt={`work sample ${index+1}`} className="rounded-lg object-cover w-full h-32" />
                ))}
              </div>
            </div>
          )}

          <div className="my-6">
             <h2 className="text-xl font-bold mb-3">Reviews ({provider.reviews.length})</h2>
             <div className="space-y-4">
              {provider.reviews.map(review => (
                <div key={review.id} className="border-b pb-4">
                  <div className="flex items-center mb-2">
                    <img src={review.authorImage} alt={review.authorName} className="w-10 h-10 rounded-full mr-3" />
                    <div>
                      <p className="font-semibold">{review.authorName}</p>
                      <StarRating rating={review.rating} size="h-4 w-4" />
                    </div>
                    <p className="text-xs text-gray-400 ml-auto">{review.date}</p>
                  </div>
                  <p className="text-gray-700 text-sm">{review.comment}</p>
                </div>
              ))}
             </div>
          </div>
        </div>
      </main>
      <footer className="p-4 border-t bg-white sticky bottom-0">
        <button 
          onClick={() => isBookable && onBook(provider)} 
          disabled={!isBookable}
          className="w-full bg-blue-500 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:bg-blue-600 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isBookable ? `Book Service (₹${provider.pricePerHour}/hr)` : 'Provider is Offline'}
        </button>
      </footer>
    </div>
  );
};

export default ProfileScreen;