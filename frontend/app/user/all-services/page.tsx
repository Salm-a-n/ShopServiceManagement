"use client";
import { useEffect, useState } from "react";

type Service = {
  id: number;
  name: string;
  description: string;
  price: number;
  duration_hours: number;
  warranty: string;
};

export default function AllServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [maxPrice, setMaxPrice] = useState<number>(10000);

  const API_URL = "http://127.0.0.1:8000/api/services";

  const SHOP_LOCATION = "Mullikkadu chithara"; 

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch(API_URL, {
          headers: {
            "Accept": "application/json",
          }
        });

        if (!res.ok) {
          const errorText = await res.text(); 
          console.error("Server returned an error:", errorText);
          throw new Error(`Server error: ${res.status}`);
        }

        const data = await res.json();
        setServices(data);
        setFilteredServices(data);
      } catch (err) {
        console.error("Fetch error details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  useEffect(() => {
    const filtered = services.filter((s) => {
      const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            (s.description && s.description.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesPrice = s.price <= maxPrice;
      return matchesSearch && matchesPrice;
    });
    setFilteredServices(filtered);
  }, [searchTerm, maxPrice, services]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <div className="bg-indigo-700 text-white py-16 px-8 text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-black mb-4">Our Professional Services</h1>
        <p className="text-indigo-100 text-lg max-w-2xl mx-auto">
          High-quality solutions tailored to your needs. Browse our active services below.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-6 mb-12 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex-1">
            <label className="block text-sm font-bold text-gray-700 mb-2">Search Services</label>
            <input
              type="text"
              placeholder="e.g. AC Repair, Cleaning..."
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="w-full md:w-64">
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Max Price: <span className="text-indigo-600">${maxPrice}</span>
            </label>
            <input
              type="range"
              min="0"
              max="10000"
              step="100"
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
            />
          </div>
        </div>
        {filteredServices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((service) => (
              <div 
                key={service.id} 
                className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-shadow duration-300 group flex flex-col"
              >
                <div className="p-8 flex-grow">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                      {service.name}
                    </h3>
                    <div className="bg-emerald-50 text-emerald-700 px-4 py-1 rounded-full font-black text-lg">
                      ${service.price}
                    </div>
                  </div>
                  
                  <p className="text-gray-600 leading-relaxed mb-6 line-clamp-3">
                    {service.description || "Expert service provided by our certified professionals."}
                  </p>

                  <div className="space-y-3 mb-8">
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="mr-2 text-indigo-500">⏱</span>
                      Estimated Time: {service.duration_hours} Hours
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="mr-2 text-indigo-500">🛡</span>
                      Warranty: {service.warranty || "Standard Terms Apply"}
                    </div>
                  </div>
                </div>
                <div className="p-8 pt-0 mt-auto">
                  <a 
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SHOP_LOCATION)}`}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full bg-gray-900 text-white py-4 rounded-2xl font-bold hover:bg-blue-600 transition-all shadow-lg hover:shadow-blue-200"
                  >
                    <span className="text-xl">📍</span>
                    Visit Our Shop
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
            <p className="text-gray-400 text-xl font-medium">No services found matching your criteria.</p>
            <button 
              onClick={() => {setSearchTerm(""); setMaxPrice(10000);}}
              className="mt-4 text-indigo-600 font-bold hover:underline"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}