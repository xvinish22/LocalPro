
import React, { useState, useMemo, useEffect } from 'react';
import { ServiceCategory, ServiceProvider } from '../../types';
import { MapPinIcon } from '../../components/icons';
import { validatePuneLocation } from '../../utils/puneLocation';

interface OnboardingScreenProps {
  onOnboardingComplete: (newProviderData: Omit<ServiceProvider, 'id'>) => void;
}

type OnboardingData = {
  phone: string;
  name: string;
  service: ServiceCategory;
  location: { latitude: number; longitude: number; areaName: string } | null;
  price: number;
  experience: number;
};

// Step 1: Profile Details Component
const Step1_Profile: React.FC<{
  data: OnboardingData;
  handleDataChange: (field: keyof OnboardingData, value: any) => void;
}> = ({ data, handleDataChange }) => (
  <div>
    <h2 className="text-2xl font-bold mb-1">Tell us about yourself</h2>
    <p className="text-gray-500 mb-6">This information will be on your public profile.</p>
    <div className="space-y-4">
        <input type="text" placeholder="Full Name" value={data.name} onChange={e => handleDataChange('name', e.target.value)} className="w-full p-3 border rounded-lg" />
        <div>
            {/* MVP REQUIREMENT: Phone number is a simple input field without OTP verification. */}
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone number</label>
             <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">+91</span>
                <input type="tel" id="phone" placeholder="10-digit number" value={data.phone} onChange={(e) => handleDataChange('phone', e.target.value.replace(/\D/g, ''))} className="w-full p-3 border rounded-r-lg" maxLength={10} />
            </div>
        </div>
        <select value={data.service} onChange={e => handleDataChange('service', e.target.value as ServiceCategory)} className="w-full p-3 border rounded-lg">
            {Object.values(ServiceCategory).map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
        <div>
            <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">Years of experience</label>
            <input type="number" id="experience" placeholder="e.g., 5" value={data.experience || ''} onChange={e => handleDataChange('experience', parseInt(e.target.value) || 0)} className="w-full p-3 border rounded-lg" />
        </div>
    </div>
  </div>
);

// Step 2: Location Component
const Step2_Location: React.FC<{
  location: OnboardingData['location'];
  handleGetLocation: () => void;
  isLocating: boolean;
  manualAddress: string;
  setManualAddress: (value: string) => void;
  handleManualLocation: () => void;
}> = ({ location, handleGetLocation, isLocating, manualAddress, setManualAddress, handleManualLocation }) => (
  <div>
    <h2 className="text-2xl font-bold mb-1">Set your service location</h2>
    <p className="text-gray-500 mb-6">We are currently live in select Pune areas.</p>
    {location ? (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 font-semibold text-center">
             <p>✓ Service Area Set:</p>
            <p className="font-bold text-lg">{location.areaName}</p>
        </div>
    ) : (
      <div className="space-y-4">
        <button onClick={handleGetLocation} disabled={isLocating} className="w-full flex items-center justify-center p-3 bg-blue-500 text-white font-bold rounded-lg disabled:bg-gray-300">
            <MapPinIcon className="w-5 h-5 mr-2"/>
            {isLocating ? 'Fetching Location...' : 'Use Current Location'}
        </button>

        <div className="flex items-center text-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink mx-4 text-gray-500">OR</span>
            <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <div>
            <label htmlFor="manual-address" className="block text-sm font-medium text-gray-700 mb-1">Enter local landmark manually</label>
            <input 
              type="text" 
              id="manual-address" 
              placeholder="e.g., Katraj Dairy" 
              value={manualAddress}
              onChange={(e) => setManualAddress(e.target.value)}
              className="w-full p-3 border rounded-lg" 
            />
            <button onClick={handleManualLocation} className="w-full mt-2 p-3 bg-gray-600 text-white font-bold rounded-lg hover:bg-gray-700">
                Set Location from Address
            </button>
        </div>
      </div>
    )}
  </div>
);

// Step 3: Pricing Component
const Step3_Pricing: React.FC<{
  price: number;
  handleDataChange: (field: keyof OnboardingData, value: any) => void;
}> = ({ price, handleDataChange }) => (
  <div>
    <h2 className="text-2xl font-bold mb-1">Set your price</h2>
    <p className="text-gray-500 mb-6">How much do you charge per hour?</p>
    <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Price per hour</label>
    <div className="flex items-center gap-2 p-3 border border-gray-300 rounded-lg focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
      <span className="text-gray-500 font-semibold">₹</span>
      <input
        type="text"
        inputMode="numeric"
        id="price"
        value={price ? price : ''}
        onChange={e => handleDataChange('price', parseInt(e.target.value) || 0)}
        placeholder="Enter price"
        className="w-full text-lg outline-none bg-transparent"
      />
      <span className="text-gray-500">/ hour</span>
    </div>
  </div>
);

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onOnboardingComplete }) => {
  const [step, setStep] = useState(1);
  const [isLocating, setIsLocating] = useState(false);
  const [manualAddress, setManualAddress] = useState('');

  const [data, setData] = useState<OnboardingData>({
    phone: '', name: '', service: ServiceCategory.Plumber,
    location: null, price: 0, experience: 0,
  });
  const totalSteps = 3;

  const isStepComplete = useMemo(() => {
    switch(step) {
      case 1: return data.name.trim().length > 2 && data.phone.length === 10 && data.experience > 0;
      case 2: return !!data.location;
      case 3: return data.price > 0;
      default: return false;
    }
  }, [step, data]);

  const nextStep = () => setStep(s => Math.min(s + 1, totalSteps));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));
  const handleDataChange = (field: keyof OnboardingData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
  };
  
  const processLocation = (latitude: number, longitude: number, areaName: string) => {
    const validation = validatePuneLocation(latitude, longitude);
    if (validation.isAllowed) {
        handleDataChange('location', { latitude, longitude, areaName: validation.areaName! });
    } else {
        alert("Service currently available in Katraj, Kondhwa & Bibwewadi only.");
    }
  };

  const handleGetLocation = () => {
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        processLocation(position.coords.latitude, position.coords.longitude, "Current Location");
        setIsLocating(false);
      },
      () => {
        alert("Could not get location. Please enable location services.");
        setIsLocating(false);
      }
    );
  };
  
  const handleManualLocation = () => {
    if (!manualAddress.trim()) {
      alert("Please enter an address or landmark.");
      return;
    }
    // Mocking geocoding for demo. In a real app, use Google Places API.
    const lowerCaseAddress = manualAddress.toLowerCase();
    let coords = { lat: 0, lng: 0 };
    if (lowerCaseAddress.includes('katraj')) coords = { lat: 18.4591, lng: 73.8512 };
    else if (lowerCaseAddress.includes('kondhwa')) coords = { lat: 18.4776, lng: 73.8915 };
    else if (lowerCaseAddress.includes('bibwewadi')) coords = { lat: 18.4784, lng: 73.8631 };
    else {
        alert("Could not find this location in our service area. Please try a landmark in Katraj, Kondhwa, or Bibwewadi.");
        return;
    }
    processLocation(coords.lat, coords.lng, manualAddress);
  };

  const handleSubmit = () => {
    if (!isStepComplete) return;
    const finalData: Omit<ServiceProvider, 'id'> = {
        name: data.name, profilePhoto: 'https://picsum.photos/id/1084/200/200', isVerified: false, 
        isApproved: true, // MVP REQUIREMENT: Auto-approve all new providers immediately.
        isOnline: false, rating: 0,
        jobsCompleted: 0, services: [data.service], pricePerHour: data.price, location: data.location!, availability: 'Today',
        experienceYears: data.experience, workGallery: [], 
        verifications: { phone: true, police: false }, // MVP REQUIREMENT: Phone is considered 'verified' on input, no OTP.
        reviews: [],
    };
    onOnboardingComplete(finalData);
  };
  
  const renderCurrentStep = () => {
    switch (step) {
      case 1:
        return <Step1_Profile data={data} handleDataChange={handleDataChange} />;
      case 2:
        return <Step2_Location location={data.location} handleGetLocation={handleGetLocation} isLocating={isLocating} manualAddress={manualAddress} setManualAddress={setManualAddress} handleManualLocation={handleManualLocation}/>;
      case 3:
        return <Step3_Pricing price={data.price} handleDataChange={handleDataChange} />;
      default: return null;
    }
  };

  return (
    <div className="p-6 flex flex-col min-h-screen bg-white">
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div className="bg-blue-600 h-2 rounded-full transition-all duration-500" style={{ width: `${(step / totalSteps) * 100}%` }}></div>
        </div>
        <div className="flex-grow py-4 overflow-y-auto">{renderCurrentStep()}</div>
        <div className="flex gap-4 pt-4">
            {step > 1 && <button onClick={prevStep} className="w-full bg-gray-200 text-gray-700 font-bold py-3 rounded-lg">Back</button>}
            {step < totalSteps ? 
                <button onClick={nextStep} disabled={!isStepComplete} className="w-full bg-blue-500 text-white font-bold py-3 rounded-lg disabled:bg-gray-300">Next</button>
                :
                <button onClick={handleSubmit} disabled={!isStepComplete} className="w-full bg-green-500 text-white font-bold py-3 rounded-lg disabled:bg-gray-300">Finish Onboarding</button>
            }
        </div>
    </div>
  );
};

export default OnboardingScreen;
