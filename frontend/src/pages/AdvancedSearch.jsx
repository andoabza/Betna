// AdvancedSearch.jsx - Search & Filter Component
import { useState } from 'react';
import { useDebounce } from 'use-debounce';
import axios from 'axios';
import { HouseCard } from './HouseCard';

const AdvancedSearch = () => {
  const [filters, setFilters] = useState({
    search: '',
    minPrice: '',
    maxPrice: '',
    rooms: '',
    type: '',
    sort: 'newest'
  });
  
  const [debouncedSearch] = useDebounce(filters.search, 500);
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleMin  = (e) =>{
    setFilters(prev => ({ ...prev, minPrice: e.target.value.replace(/\D/g, "")}))
  }
  const handleMax  = (e) =>{
    setFilters(prev => ({ ...prev, maxPrice: e.target.value.replace(/\D/g, "")}))
  }
  
  //useEffect(() => {
    const fetchHouses = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams({
          query: debouncedSearch,
          minPrice: filters.minPrice,
          maxPrice: filters.maxPrice,
          rooms: filters.rooms,
          type: filters.type,
          sort: filters.sort
        });
        
        const { data } = await axios.get(`/api/houses?${params}`);
        if (data.houses) {
          setResults(data.houses);
        } else {
            setResults([]);
            }

      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    //fetchHouses();
  //}, [debouncedSearch, filters]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <input
              type="text"
              value={filters.search}
              onChange={fetchHouses}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="Address or keywords..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
            <div className="flex gap-2">
              <input
                type="string"
                placeholder="Min"
                className="w-1/2 p-2 border rounded-md"
                value={filters.minPrice}
                onChange={handleMin}
                maxLength={6}
              />
              <input
                type="string"
                placeholder="Max"
                className="w-1/2 p-2 border rounded-md"
                value={filters.maxPrice}
                onChange={handleMax}
                maxLength={6}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rooms</label>
            <select
              value={filters.rooms}
              onChange={(e) => setFilters(prev => ({ ...prev, rooms: e.target.value }))}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Any</option>
              {[1, 2, 3, 4, 5, 6].map(num => (
                <option key={num} value={num}>{num}+</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
            <select
              value={filters.type}
              onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
              className="w-full p-2 border rounded-md"
            >
              <option value="">All Types</option>
              <option value="house">House</option>
              <option value="apartment">Apartment</option>
              <option value="villa">Villa</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
            <select
              value={filters.sort}
              onChange={(e) => setFilters(prev => ({ ...prev, sort: e.target.value }))}
              className="w-full p-2 border rounded-md"
            >
              <option value="newest">Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array(6).fill().map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
              <div className="h-48 bg-gray-200" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 w-2/3 rounded"></div>
                <div className="h-4 bg-gray-200 w-1/3 rounded"></div>
                <div className="h-4 bg-gray-200 w-1/2 rounded"></div>
              </div>
            </div>
          ))
        ) : (
          results.map(house => (
            <HouseCard key={house.id} house={house} />
          ))
        )}
      </div>

      {!isLoading && results.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No properties found matching your criteria
        </div>
      )}
    </div>
  );
};
export { AdvancedSearch };
