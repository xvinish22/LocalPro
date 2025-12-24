
import React from 'react';
import { StarIcon } from '../../components/icons';
import { ServiceProvider } from '../../types';

interface DashboardScreenProps {
  provider: ServiceProvider;
  onGoHome: () => void;
  onToggleOnline: (providerId: string, isOnline: boolean) => void;
  onManageProfile: () => void;
}

const DashboardScreen: React.FC<DashboardScreenProps> = ({ provider, onGoHome, onToggleOnline, onManageProfile }) => {
    const isNewProvider = provider.jobsCompleted === 0;

    const handleToggle = () => {
        const wantsToGoOnline = !provider.isOnline;
        // MVP REQUIREMENT: Check for profile completeness before allowing a provider to go online.
        if (wantsToGoOnline) {
            if (!provider.pricePerHour || provider.pricePerHour <= 0) {
                alert("Please set your price per hour before going online. You can do this in 'Manage Profile'.");
                return;
            }
            if (!provider.experienceYears || provider.experienceYears <= 0) {
                alert("Please add your years of experience before going online. You can do this in 'Manage Profile'.");
                return;
            }
            if (!provider.location) {
                alert("Location is missing. Please complete your profile.");
                return;
            }
        }
        onToggleOnline(provider.id, wantsToGoOnline);
    };

    const StatCard: React.FC<{title: string, value: string | number, colorClass: string}> = ({title, value, colorClass}) => (
        <div className="bg-white p-4 rounded-xl shadow-sm border">
            <p className="text-sm text-gray-500">{title}</p>
            <p className={`text-2xl font-bold ${colorClass}`}>{value}</p>
        </div>
    );
    
    // MVP REQUIREMENT: The dashboard UI renders immediately without checking for admin approval.
    // The "Waiting for admin approval" banner has been removed.
    return (
        <div className="bg-gray-50 min-h-screen">
            <header className="bg-blue-600 p-4 text-white">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Dashboard</h1>
                    <div className="flex items-center">
                        <span className={`mr-2 font-semibold text-sm ${provider.isOnline ? 'text-green-300' : 'text-red-300'}`}>{provider.isOnline ? 'Online' : 'Offline'}</span>
                        <button onClick={handleToggle} className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${provider.isOnline ? 'bg-green-400' : 'bg-gray-400'}`}>
                            <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${provider.isOnline ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                    </div>
                </div>
            </header>
            
            <main className="p-4 space-y-4 pb-32">
                 {isNewProvider && (
                    <div className="bg-blue-50 border border-blue-200 text-blue-800 p-3 rounded-lg text-center">
                        <p className="font-semibold">Welcome! You are a New Provider.</p>
                        <p className="text-sm">Complete jobs to start getting ratings and earnings.</p>
                    </div>
                 )}
                <div className="grid grid-cols-2 gap-4">
                    <StatCard title="Today's Earnings" value={`₹${0}`} colorClass="text-green-600" />
                    <StatCard title="Total Bookings" value={provider.jobsCompleted} colorClass="text-blue-600" />
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border flex justify-between items-center">
                     <div>
                        <p className="text-sm text-gray-500">Your Rating</p>
                        <div className="flex items-center">
                            <StarIcon className="w-6 h-6 text-yellow-400 mr-1"/>
                            <p className="text-2xl font-bold text-gray-800">{provider.rating.toFixed(1)}</p>
                        </div>
                     </div>
                     <button className="text-blue-600 font-semibold text-sm">View Reviews</button>
                </div>
                
                <div>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Today's Bookings</h2>
                    <div className="space-y-3 text-center text-gray-500 bg-white p-8 rounded-lg border">
                       <p>You have no bookings for today.</p>
                    </div>
                </div>
            </main>

            <footer className="p-4 fixed bottom-0 w-full max-w-md mx-auto bg-gray-50/80 backdrop-blur-sm border-t border-gray-200">
                 <div className="space-y-2">
                    <button onClick={onManageProfile} className="w-full bg-white text-blue-600 border-2 border-blue-600 font-bold py-3 rounded-lg shadow-md hover:bg-blue-50">Manage Profile</button>
                    <button onClick={onGoHome} className="w-full text-gray-600 font-semibold py-2 rounded-lg hover:bg-gray-100 transition-colors">
                        Change Role
                    </button>
                 </div>
            </footer>
        </div>
    );
};

export default DashboardScreen;
