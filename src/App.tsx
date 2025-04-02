import { useState, useCallback, useMemo } from 'react';
import { Check, LogOut, Settings } from 'lucide-react';
// Assuming useAuth hook exists and works as before
// import { useAuth } from './context/AuthContext';

// --- Define the structure for a square footage range option ---
interface SqFtRangeOption {
  id: string; // Unique identifier for the range
  label: string; // Text displayed in the dropdown
  price: number; // Base price for this range
}

// --- Define the available square footage ranges ---
const availableSqFtRanges: SqFtRangeOption[] = [
  { id: 'range-1', label: '1 - 999 sq ft', price: 64 },
  { id: 'range-2', label: '1000 - 1499 sq ft', price: 80 },
  { id: 'range-3', label: '1500 - 1999 sq ft', price: 96 },
  { id: 'range-4', label: '2000 - 2499 sq ft', price: 112 },
  { id: 'range-5', label: '2500 - 2999 sq ft', price: 128 },
  { id: 'range-6', label: '3000 - 3499 sq ft', price: 144 },
  { id: 'range-6', label: '3500 - 3999 sq ft', price: 160 },
  { id: 'range-6', label: '4000 - 4499 sq ft', price: 176 },
  { id: 'range-6', label: '4500 - 4999 sq ft', price: 192 },
  { id: 'range-6', label: '5000 - 5499 sq ft', price: 208 },
  { id: 'range-6', label: '5500 - 5999 sq ft', price: 224 },
];

interface AdditionalService {
  name: string;
  price: number;
  selected: boolean;
}

function App() {
  // Mock logout function if useAuth is not set up for this example
  const logout = () => console.log('Logout clicked');
  // const { logout } = useAuth(); // Use this line if you have the AuthContext

  // --- State Updates ---
  // Removed rawFootage state
  const [bedrooms, setBedrooms] = useState(1);
  const [bathrooms, setBathrooms] = useState(1);
  const [pricing, setPricing] = useState({
    // pricePerSqFt: 0.15, // Removed pricePerSqFt
    pricePerBedroom: 16,
    pricePerBathroom: 16,
  });
  const [sqFtRanges] = useState<SqFtRangeOption[]>(availableSqFtRanges); // State for range options
  const [selectedSqFtRangeId, setSelectedSqFtRangeId] = useState<string>(sqFtRanges[0].id); // Default to the first range ID

  const [additionalServices, setAdditionalServices] = useState<AdditionalService[]>([
    { name: 'Inside Oven', price: 30, selected: false },
    { name: 'Inside Fridge', price: 30, selected: false },
    // Add other services as needed
  ]);
  const [showSettings, setShowSettings] = useState(false);

  const toggleService = useCallback((index: number) => {
    setAdditionalServices(prev => prev.map((service, i) =>
      i === index ? { ...service, selected: !service.selected } : service
    ));
  }, []);

  // --- Calculation Update ---
  const calculateTotal = useMemo(() => {
    // Find the selected range object based on the ID
    const selectedRange = sqFtRanges.find(range => range.id === selectedSqFtRangeId);
    // Get the base price from the selected range, default to 0 if not found (shouldn't happen)
    const footageTotal = selectedRange ? selectedRange.price : 0;

    const bedroomTotal = bedrooms * pricing.pricePerBedroom;
    const bathroomTotal = bathrooms * pricing.pricePerBathroom;
    const servicesTotal = additionalServices.reduce((sum, service) => service.selected ? sum + service.price : sum, 0);

    return footageTotal + bedroomTotal + bathroomTotal + servicesTotal;
    // Update dependencies for useMemo
  }, [selectedSqFtRangeId, bedrooms, bathrooms, pricing, additionalServices, sqFtRanges]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8 relative">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Cleaning Service Calculator</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="text-gray-600 hover:text-gray-900"
              aria-label="Toggle settings"
            >
              <Settings className={`w-6 h-6 transition-transform ${showSettings ? 'rotate-90' : ''}`} />
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
            {/* --- Settings Update: Grid columns might need adjustment --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> {/* Adjusted to md:grid-cols-2 */}
              {Object.keys(pricing).map((key) => (
                <div key={key}>
                  {/* Simple label formatting */}
                  <label className="text-gray-600 text-sm capitalize">
                     {key.replace(/([A-Z])/g, ' $1').replace('price Per', 'Price per').trim()}
                  </label>
                  <input
                    type="number"
                    inputMode="decimal" // Use decimal for prices
                    value={pricing[key as keyof typeof pricing]}
                    onChange={(e) => setPricing(prev => ({
                      ...prev,
                      [key]: Math.max(0, parseFloat(e.target.value) || 0)
                    }))}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- UI Update: Replaced Input with Select Dropdown --- */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Select Area Range</h2>
          <select
            value={selectedSqFtRangeId}
            onChange={(e) => setSelectedSqFtRangeId(e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2 bg-white" // Added bg-white
            aria-label="Select square footage range"
          >
            {sqFtRanges.map((range) => (
              <option key={range.id} value={range.id}>
                {range.label} - ${range.price}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-6">
          {['Bedrooms', 'Bathrooms'].map((label, idx) => (
            <div key={label} className="bg-gray-50 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">{label}</h2>
              <input
                type="number"
                inputMode="numeric"
                min="0" // Prevent negative numbers directly in input
                value={idx === 0 ? bedrooms : bathrooms}
                onChange={(e) => {
                    const val = parseInt(e.target.value) || 0;
                    if (idx === 0) {
                        setBedrooms(Math.max(0, val));
                    } else {
                        setBathrooms(Math.max(0, val));
                    }
                 }}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                aria-label={`${label} input`}
              />
            </div>
          ))}
        </div>

        <div className="bg-gray-50 rounded-xl p-6 mt-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Additional Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {additionalServices.map((service, index) => (
              <div
                 key={service.name}
                 className={`flex items-center justify-between p-4 rounded-lg cursor-pointer transition-colors ${service.selected ? 'bg-indigo-50 border-2 border-indigo-200' : 'bg-white hover:bg-gray-50 border border-gray-200'}`} // Added hover and border for non-selected
                 onClick={() => toggleService(index)}
                 role="button"
                 aria-pressed={service.selected}
                 tabIndex={0} // Make it focusable
                 onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && toggleService(index)} // Keyboard accessibility
               >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center border-2 transition-colors ${service.selected ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300'}`}>
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
            <div className="text-3xl font-bold">${calculateTotal.toFixed(2)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;