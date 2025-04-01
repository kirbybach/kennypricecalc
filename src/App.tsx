import { useState, useCallback } from 'react';
import { Calculator, Hop as Mop, Plus, Minus, Check, SwitchCamera, LogOut } from 'lucide-react';
import { useAuth } from './context/AuthContext';

interface Room {
  id: string;
  type: string;
  size: number;
}

interface AdditionalService {
  name: string;
  price: number;
  selected: boolean;
}

function App() {
  const { logout } = useAuth();
  const [isRawFootage, setIsRawFootage] = useState(true);
  const [rawFootage, setRawFootage] = useState(500);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [additionalServices, setAdditionalServices] = useState<AdditionalService[]>([
    { name: 'Deep Cleaning', price: 50, selected: false },
    { name: 'Window Cleaning', price: 30, selected: false },
    { name: 'Carpet Shampooing', price: 40, selected: false },
    { name: 'Disinfection Service', price: 35, selected: false },
  ]);

  const baseRatePerSqFt = 0.15;

  const addRoom = useCallback(() => {
    setRooms(prev => [...prev, {
      id: crypto.randomUUID(),
      type: 'bedroom',
      size: 150
    }]);
  }, []);

  const removeRoom = useCallback((id: string) => {
    setRooms(prev => prev.filter(room => room.id !== id));
  }, []);

  const updateRoom = useCallback((id: string, field: keyof Room, value: string | number) => {
    setRooms(prev => prev.map(room => 
      room.id === id ? { ...room, [field]: value } : room
    ));
  }, []);

  const toggleService = useCallback((index: number) => {
    setAdditionalServices(prev => prev.map((service, i) => 
      i === index ? { ...service, selected: !service.selected } : service
    ));
  }, []);

  const calculateTotal = useCallback(() => {
    const footageTotal = isRawFootage 
      ? rawFootage * baseRatePerSqFt
      : rooms.reduce((sum, room) => sum + (room.size * baseRatePerSqFt), 0);
    
    const servicesTotal = additionalServices
      .filter(service => service.selected)
      .reduce((sum, service) => sum + service.price, 0);
    
    return footageTotal + servicesTotal;
  }, [rooms, additionalServices, baseRatePerSqFt, isRawFootage, rawFootage]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Mop className="w-8 h-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-800">Cleaning Service Calculator</h1>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>

        <div className="space-y-8">
          {/* Calculation Mode Toggle */}
          <div className="flex items-center justify-between bg-gray-50 rounded-xl p-6">
            <div className="flex items-center gap-3">
              <SwitchCamera className="w-6 h-6 text-indigo-600" />
              <h2 className="text-xl font-semibold text-gray-700">Calculation Mode</h2>
            </div>
            <button
              onClick={() => setIsRawFootage(!isRawFootage)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                isRawFootage 
                  ? 'bg-white text-gray-700 border border-gray-300'
                  : 'bg-white text-gray-700 border border-gray-300'
              }`}
            >
              {isRawFootage ? 'Raw Square Footage' : 'Room-based'}
            </button>
          </div>

          {/* Square Footage Input */}
          {isRawFootage ? (
            <div className="bg-gray-50 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Total Area to Clean</h2>
              <div className="flex gap-4 items-center">
                <input
                  type="number"
                  value={rawFootage}
                  onChange={(e) => setRawFootage(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  placeholder="Square footage"
                />
                <span className="text-gray-600 whitespace-nowrap">sq ft</span>
              </div>
            </div>
          ) : (
            /* Rooms Section */
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-700">Rooms to Clean</h2>
                <button
                  onClick={addRoom}
                  className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Room
                </button>
              </div>

              <div className="space-y-4">
                {rooms.map(room => (
                  <div key={room.id} className="flex gap-4 items-center bg-white p-4 rounded-lg shadow-sm">
                    <select
                      value={room.type}
                      onChange={(e) => updateRoom(room.id, 'type', e.target.value)}
                      className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    >
                      <option value="bedroom">Bedroom</option>
                      <option value="bathroom">Bathroom</option>
                      <option value="kitchen">Kitchen</option>
                      <option value="living">Living Room</option>
                    </select>
                    <input
                      type="number"
                      value={room.size}
                      onChange={(e) => updateRoom(room.id, 'size', parseInt(e.target.value))}
                      className="w-32 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      placeholder="Size (sq ft)"
                    />
                    <button
                      onClick={() => removeRoom(room.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {rooms.length === 0 && (
                  <p className="text-gray-500 text-center py-4">Add rooms to calculate cleaning cost</p>
                )}
              </div>
            </div>
          )}

          {/* Additional Services Section */}
          <div className="bg-gray-50 rounded-xl p-6">
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

          {/* Total Section */}
          <div className="bg-indigo-600 text-white rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Calculator className="w-6 h-6" />
                <h2 className="text-xl font-semibold">Total Estimate</h2>
              </div>
              <div className="text-3xl font-bold">${calculateTotal().toFixed(2)}</div>
            </div>
            <p className="mt-2 text-indigo-200 text-sm">
              Base rate: ${baseRatePerSqFt.toFixed(2)}/sq ft
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;