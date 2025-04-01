import { useState, useCallback } from 'react';
import { Check, LogOut, Settings } from 'lucide-react';
import { useAuth } from './context/AuthContext';

interface AdditionalService {
  name: string;
  price: number;
  selected: boolean;
}

function App() {
  const { logout } = useAuth();
  const [rawFootage, setRawFootage] = useState(500);
  const [bedrooms, setBedrooms] = useState(1);
  const [bathrooms, setBathrooms] = useState(1);
  const [pricePerSqFt, setPricePerSqFt] = useState(0.15);
  const [pricePerBedroom, setPricePerBedroom] = useState(16);
  const [pricePerBathroom, setPricePerBathroom] = useState(16);
  const [additionalServices, setAdditionalServices] = useState<AdditionalService[]>([
    { name: 'Inside Oven', price: 30, selected: false },
    { name: 'Inside Fridge', price: 30, selected: false },
  ]);
  const [showSettings, setShowSettings] = useState(false);

  const toggleService = useCallback((index: number) => {
    setAdditionalServices(prev => prev.map((service, i) => 
      i === index ? { ...service, selected: !service.selected } : service
    ));
  }, []);

  const calculateTotal = useCallback(() => {
    const footageTotal = rawFootage * pricePerSqFt;
    const bedroomTotal = bedrooms * pricePerBedroom;
    const bathroomTotal = bathrooms * pricePerBathroom;
    const servicesTotal = additionalServices
      .filter(service => service.selected)
      .reduce((sum, service) => sum + service.price, 0);
    return footageTotal + bedroomTotal + bathroomTotal + servicesTotal;
  }, [additionalServices, rawFootage, bedrooms, bathrooms, pricePerSqFt, pricePerBedroom, pricePerBathroom]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8 relative">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Cleaning Service Calculator</h1>
          <div className="flex items-center gap-4">
            <button onClick={() => setShowSettings(!showSettings)} className="text-gray-600 hover:text-gray-900">
              <Settings className="w-6 h-6" />
            </button>
            <button onClick={logout} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>

        {showSettings && (
          <div className="bg-gray-100 rounded-xl p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-gray-600 text-sm">Price per Sq Ft</label>
                <input
                  type="number"
                  value={pricePerSqFt}
                  onChange={(e) => setPricePerSqFt(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
              <div>
                <label className="text-gray-600 text-sm">Price per Bedroom</label>
                <input
                  type="number"
                  value={pricePerBedroom}
                  onChange={(e) => setPricePerBedroom(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
              <div>
                <label className="text-gray-600 text-sm">Price per Bathroom</label>
                <input
                  type="number"
                  value={pricePerBathroom}
                  onChange={(e) => setPricePerBathroom(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
            </div>
          </div>
        )}

        <div className="bg-gray-50 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Total Area to Clean</h2>
          <div className="flex gap-4 items-center">
            <input
              type="number"
              value={rawFootage}
              onChange={(e) => setRawFootage(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
            <span className="text-gray-600 whitespace-nowrap">sq ft</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="bg-gray-50 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Bedrooms</h2>
            <input
              type="number"
              value={bedrooms}
              onChange={(e) => setBedrooms(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div className="bg-gray-50 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Bathrooms</h2>
            <input
              type="number"
              value={bathrooms}
              onChange={(e) => setBathrooms(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
        </div>

         {/* Additional Services Section */}
         <div className="bg-gray-50 rounded-xl p-6 mt-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Additional Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {additionalServices.map((service, index) => (
              <div
                key={service.name}
                className={`flex items-center justify-between p-4 rounded-lg cursor-pointer transition-colors ${
                  service.selected ? 'bg-indigo-50 border-2 border-indigo-200' : 'bg-white'
                }`}
                onClick={() => toggleService(index)}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                    service.selected ? 'bg-indigo-600' : 'border-2 border-gray-300'
                  }`}>
                    {service.selected && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <span className="font-medium text-gray-700">{service.name}</span>
                </div>
                <span className="text-gray-600">${service.price}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-indigo-600 text-white rounded-xl p-6 mt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Total Estimate</h2>
            <div className="text-3xl font-bold">${calculateTotal().toFixed(2)}</div>
          </div>
          <p className="mt-2 text-indigo-200 text-sm">
            Base rate: ${pricePerSqFt.toFixed(2)}/sq ft
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
