
import React from 'react';
import { UserRole } from '../types';
import { signInWithGoogle } from '../firebase';

interface LandingScreenProps {
  onRoleSelect?: (role: UserRole) => void;
  isSelectingRole?: boolean;
}

const RoleSelection: React.FC<{ onRoleSelect: (role: UserRole) => void }> = ({ onRoleSelect }) => (
  <div className="w-full mt-12 space-y-4">
    <h2 className="text-xl font-bold text-center mb-4">Complete your setup</h2>
    <button
      onClick={() => onRoleSelect(UserRole.Customer)}
      className="w-full bg-blue-500 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:bg-blue-600 transition-all transform hover:scale-105"
    >
      Continue as Customer
    </button>
    <button
      onClick={() => onRoleSelect(UserRole.Provider)}
      className="w-full bg-white text-blue-500 border-2 border-blue-500 font-bold py-3 px-4 rounded-lg hover:bg-blue-50 transition-all transform hover:scale-105"
    >
      Continue as Service Provider
    </button>
  </div>
);

const GoogleSignInButton = () => (
    <button
      onClick={signInWithGoogle}
      className="w-full flex items-center justify-center bg-white border border-gray-300 text-gray-700 font-bold py-3 px-4 rounded-lg shadow-sm hover:bg-gray-50 transition-all transform hover:scale-105"
    >
      <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google logo" className="w-6 h-6 mr-3" />
      Sign in with Google
    </button>
);

const LandingScreen: React.FC<LandingScreenProps> = ({ onRoleSelect, isSelectingRole }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white p-8">
      <div className="text-center">
        <svg
          className="w-20 h-20 text-blue-500 mx-auto mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          ></path>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          ></path>
        </svg>
        <h1 className="text-2xl font-bold text-gray-800">LocalPro</h1>
        <p className="mt-2 text-lg text-gray-600">
          Find trusted local professionals near you
        </p>
      </div>

      <div className="w-full mt-12">
        {isSelectingRole && onRoleSelect ? (
            <RoleSelection onRoleSelect={onRoleSelect} />
        ) : (
            <GoogleSignInButton />
        )}
      </div>
    </div>
  );
};

export default LandingScreen;
