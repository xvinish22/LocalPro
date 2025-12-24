
import React, { useState } from 'react';
import { ServiceProvider } from '../../types';
import { ArrowLeftIcon } from '../../components/icons';

interface BookingScreenProps {
  provider: ServiceProvider;
  onBookingConfirmed: (provider: ServiceProvider, service: string) => void;
  onBack: () => void;
}

const BookingScreen: React.FC<BookingScreenProps> = ({ provider, onBookingConfirmed, onBack }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = useState('10:00');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash');

  const handleConfirmBooking = () => {
    if (address.trim()) {
        onBookingConfirmed(provider, provider.services[0]);
    } else {
        alert("Please enter your address.");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <header className="p-4 bg-white border-b sticky top-0 z-10">
        <div className="flex items-center">
            <button onClick={onBack} className="p-2 -ml-2 mr-2">
                <ArrowLeftIcon className="w-6 h-6 text-gray-600"/>
            </button>
            <h1 className="text-xl font-bold text-gray-800">Book Service</h1>
        </div>
      </header>

      <main className="flex-grow p-5 overflow-y-auto">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center">
                <img src={provider.profilePhoto} alt={provider.name} className="w-12 h-12 rounded-full mr-4"/>
                <div>
                    <h2 className="font-bold text-lg">{provider.name}</h2>
                    <p className="text-gray-600">{provider.services.join(', ')}</p>
                </div>
            </div>
        </div>

        <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3">Schedule</h3>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
                    <input type="date" id="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2" />
                </div>
                <div>
                    <label htmlFor="time" className="block text-sm font-medium text-gray-700">Time</label>
                    <input type="time" id="time" value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"/>
                </div>
            </div>
        </div>

        <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3">Address</h3>
            <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={3}
                placeholder="Enter your full address"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
            />
        </div>

        <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3">Payment Method</h3>
            <div className="space-y-2">
                {['Cash', 'UPI'].map(method => (
                    <button key={method} onClick={() => setPaymentMethod(method)} className={`w-full text-left p-3 border rounded-lg flex items-center transition-colors ${paymentMethod === method ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}>
                        <div className={`w-4 h-4 rounded-full border-2 mr-3 ${paymentMethod === method ? 'bg-blue-500 border-blue-500' : 'border-gray-400'}`}></div>
                        {method}
                    </button>
                ))}
            </div>
        </div>
        
        <div className="mt-6 bg-white p-4 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-2">Price Breakdown</h3>
            <div className="flex justify-between text-gray-600">
                <p>Service Fee (per hour)</p>
                <p>₹{provider.pricePerHour}</p>
            </div>
            <div className="flex justify-between text-gray-600 mt-1">
                <p>Platform Fee</p>
                <p>₹50</p>
            </div>
            <div className="border-t my-2"></div>
            <div className="flex justify-between font-bold text-gray-800 text-lg">
                <p>Total (estimated for 1hr)</p>
                <p>₹{provider.pricePerHour + 50}</p>
            </div>
        </div>
      </main>

       <footer className="p-4 border-t bg-white sticky bottom-0">
        <button onClick={handleConfirmBooking} className="w-full bg-blue-500 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:bg-blue-600 transition-all">
          Confirm Booking
        </button>
      </footer>
    </div>
  );
};

export default BookingScreen;
