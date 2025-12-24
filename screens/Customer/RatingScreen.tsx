
import React, { useState } from 'react';
import { ServiceProvider } from '../../types';
import StarRating from '../../components/StarRating';

interface RatingScreenProps {
  booking: {
    provider: ServiceProvider;
    service: string;
  };
  onRatingSubmitted: () => void;
}

const RatingScreen: React.FC<RatingScreenProps> = ({ booking, onRatingSubmitted }) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm text-center animate-fade-in-up">
        <h2 className="text-2xl font-bold text-gray-800">Job Completed!</h2>
        <p className="text-gray-500 mt-1">How was your service with</p>
        <p className="font-semibold text-lg mt-1">{booking.provider.name}?</p>
        
        <div className="my-6 flex justify-center">
            <StarRating rating={rating} onRatingChange={setRating} size="h-10 w-10" />
        </div>

        <textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          rows={3}
          placeholder="Share your experience (optional)"
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
        ></textarea>
        
        {/* Optional: Upload job photo */}
        <div className="mt-4 text-left">
            <label htmlFor="job-photo" className="text-sm font-medium text-gray-700">Upload job photo (optional)</label>
            <input type="file" id="job-photo" className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
        </div>

        <button
            onClick={onRatingSubmitted}
            disabled={rating === 0}
            className="w-full bg-blue-500 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:bg-blue-600 transition-all mt-6 disabled:bg-gray-300"
        >
            Submit Review
        </button>

         <button
            onClick={onRatingSubmitted}
            className="w-full text-gray-500 font-semibold py-2 px-4 rounded-lg hover:bg-gray-100 transition-all mt-2"
        >
            Skip
        </button>
      </div>
      <style>{`
        @keyframes fade-in-up {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
            animation: fade-in-up 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default RatingScreen;
