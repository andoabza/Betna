// 1. HouseCard Component
import { Link } from 'react-router-dom';
import { MapPinIcon, HomeModernIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';

const HouseCard = ({ house }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <img 
        src={house.image?.url || '/placeholder-house.jpg'} 
        alt={house.title}
        className="w-full h-48 object-cover"
        onError={(e) => {
          e.target.src = '/placeholder-house.jpg';
        }}
      />
      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{house.title}</h3>
        <div className="flex items-center gap-2 mb-2">
          <CurrencyDollarIcon className="w-5 h-5 text-blue-600" />
          <span className="text-gray-600">${house.price?.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-2 mb-2">
          <HomeModernIcon className="w-5 h-5 text-blue-600" />
          <span className="text-gray-600">{house.numberOfRooms} rooms · {house.houseType}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPinIcon className="w-5 h-5 text-blue-600" />
          <span className="text-gray-600 truncate">{house.address}</span>
        </div>
        <Link
          to={`/houses/${house.slug}`}
          className="mt-4 inline-block w-full text-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};
export { HouseCard };