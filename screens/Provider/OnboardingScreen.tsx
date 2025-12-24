
import React, { useState, useMemo, useEffect } from 'react';
import { ServiceCategory, ServiceProvider } from '../../types';
import { MapPinIcon } from '../../components/icons';
import { validatePuneLocation } from '../../utils/puneLocation';

interface OnboardingScreenProps {
  onOnboardingComplete: (newProviderData: Omit<ServiceProvider, 'uid' | 'name' | 'profilePhoto'>) => void;
}

type OnboardingData = {
  phone: string;
  service: ServiceCategory;
  location: { latitude: number; longitude: number; areaName: string } | null;
  price: number;
  experience: number;
};

// Step 1: Profile Details Component
const Step1_Profile: React.FC<{
  data: Partial<OnboardingData>;
  handleDataChange: (field: keyof OnboardingData, value: any) => void;
}> = ({ data, handleDataChange }) => (
  <div>
    <h2 className="text-2xl font-bold mb-1">Your Profile Details</h2>
    <p className="text-gray-500 mb-6">This information will be on your public profile.</p>
    <div className="space-y-4">
        <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone number</label>
             <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">+91</span>
                <input type="tel" id="phone" placeholder="10-digit number" value={data.phone || ''} onChange={(e) => handleDataChange('phone', e.target.value.replace(/\D/g, ''))} className="w-full p-3 border rounded-r-lg" maxLength={10} />
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
}> = ({ location, handleGetLocation, isLocating }) => (
  <div>
    <h2 className="text-2xl font-bold mb-1">Set your service location</h2>
    <p className="text-gray-500 mb-6">We are currently live in select Pune areas.</p>
    {location ? (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 font-semibold text-center">
            <p>✓ Service Area Set: <span className="font-bold text-lg">{location.areaName}</span></p>
        </div>
    ) : (
        <button onClick={handleGetLocation} disabled={isLocating} className="w-full flex items-center justify-center p-3 bg-blue-500 text-white font-bold rounded-lg disabled:bg-gray-300">
            <MapPinIcon className="w-5 h-5 mr-2"/>
            {isLocating ? 'Fetching Location...' : 'Use Current Location'}
        </button>
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
    <div className="flex items-center gap-2 p-3 border border-gray-300 rounded-lg">
      <span className="text-gray-500 font-semibold">₹</span>
      <input type="number" id="price" value={price || ''} onChange={e => handleDataChange('price', parseInt(e.target.value) || 0)} placeholder="Enter price" className="w-full text-lg outline-none bg-transparent"/>
      <span className="text-gray-500">/ hour</span>
    </div>
  </div>
);

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onOnboardingComplete }) => {
  const [step, setStep] = useState(1);
  const [isLocating, setIsLocating] = useState(false);
  const [data, setData] = useState<Partial<OnboardingData>>({ service: ServiceCategory.Plumber });
  const totalSteps = 3;

  const isStepComplete = useMemo(() => {
    switch(step) {
      case 1: return (data.phone?.length === 10) && (data.experience ?? 0) > 0;
      case 2: return !!data.location;
      case 3: return (data.price ?? 0) > 0;
      default: return false;
    }
  }, [step, data]);

  const handleDataChange = (field: keyof OnboardingData, value: any) => setData(prev => ({ ...prev, [field]: value }));
  
  const handleGetLocation = () => {
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const validation = validatePuneLocation(latitude, longitude);
        if (validation.isAllowed) {
          handleDataChange('location', { latitude, longitude, areaName: validation.areaName! });
        } else {
          alert("Service currently available in Katraj, Kondhwa & Bibwewadi only.");
        }
        setIsLocating(false);
      },
      () => { alert("Could not get location."); setIsLocating(false); }
    );
  };
  
  const handleSubmit = () => {
    if (!isStepComplete) return;
    const finalData = {
        isVerified: false, 
        isApproved: true,
        isOnline: false,
        rating: 0,
        jobsCompleted: 0,
        services: [data.service!],
        pricePerHour: data.price!,
        location: data.location!,
        availability: 'Today',
        experienceYears: data.experience!,
        workGallery: [], 
        verifications: { phone: true, police: false },
        reviews: [],
    };
    onOnboardingComplete(finalData as any);
  };
  
  const renderCurrentStep = () => {
    switch (step) {
      case 1: return <Step1_Profile data={data} handleDataChange={handleDataChange} />;
      case 2: return <Step2_Location location={data.location} handleGetLocation={handleGetLocation} isLocating={isLocating} />;
      case 3: return <Step3_Pricing price={data.price || 0} handleDataChange={handleDataChange} />;
    }
  };

  return (
    <div className="p-6 flex flex-col min-h-screen bg-white">
      <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
        <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${(step / totalSteps) * 100}%` }}></div>
      </div>
      <div className="flex-grow py-4">{renderCurrentStep()}</div>
      <div className="flex gap-4 pt-4">
        {step > 1 && <button onClick={() => setStep(s => s - 1)} className="w-full bg-gray-200 py-3 rounded-lg">Back</button>}
        {step < totalSteps ? 
            <button onClick={() => setStep(s => s + 1)} disabled={!isStepComplete} className="w-full bg-blue-500 text-white font-bold py-3 rounded-lg disabled:bg-gray-300">Next</button>
            :
            <button onClick={handleSubmit} disabled={!isStepComplete} className="w-full bg-green-500 text-white font-bold py-3 rounded-lg disabled:bg-gray-300">Finish Onboarding</button>
        }
      </div>
    </div>
  );
};

export default OnboardingScreen;
