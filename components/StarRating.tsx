
import React from 'react';
import { StarIcon } from './icons';

interface StarRatingProps {
  rating: number;
  totalStars?: number;
  onRatingChange?: (rating: number) => void;
  size?: string;
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  totalStars = 5,
  onRatingChange,
  size = 'h-5 w-5',
}) => {
  return (
    <div className="flex items-center">
      {[...Array(totalStars)].map((_, index) => {
        const starValue = index + 1;
        return (
          <button
            key={index}
            type="button"
            disabled={!onRatingChange}
            onClick={() => onRatingChange && onRatingChange(starValue)}
            className={`cursor-${onRatingChange ? 'pointer' : 'default'}`}
          >
            <StarIcon
              className={`${size} ${
                starValue <= rating ? 'text-yellow-400' : 'text-gray-300'
              }`}
            />
          </button>
        );
      })}
    </div>
  );
};

export default StarRating;
