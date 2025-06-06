import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { toast } from 'react-toastify';
import { Skeleton } from './Skeleton';
import { Pagination } from './Pagination';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { FiArrowLeft, FiArrowRight, FiSearch, FiPlusCircle, FiFilter, FiX, FiSliders, FiBookmark, FiHome, FiMapPin, FiType } from 'react-icons/fi';

const Home = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [houses, setHouses] = useState([]);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        keyword: '',
        minPrice: 0,
        maxPrice: 1000000,
        rooms: 0,
        houseType: 'all',
        sort: 'newest'
    });

    // Carousel settings with conditional arrows
    const getSliderSettings = (imagesCount) => ({
        dots: imagesCount > 1,
        arrows: imagesCount > 1,
        infinite: imagesCount > 1,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        nextArrow: imagesCount > 1 ? <NextArrow /> : null,
        prevArrow: imagesCount > 1 ? <PrevArrow /> : null,
        appendDots: dots => (
            <div className="custom-dots">
                <ul>{dots}</ul>
            </div>
        )
    });

    function NextArrow(props) {
        const { onClick } = props;
        return (
            <div className="slick-arrow next-arrow" onClick={onClick}>
                <FiArrowRight />
            </div>
        );
    }

    function PrevArrow(props) {
        const { onClick } = props;
        return (
            <div className="slick-arrow prev-arrow" onClick={onClick}>
                <FiArrowLeft />
            </div>
        );
    }

    const handlePriceChange = (e, field) => {
        const value = e.target.value.replace(/\D/g, "");
        setFilters(prev => ({ ...prev, [field]: value }));
    };

    useEffect(() => {
        const fetchHouses = async () => {
            try {
                const response = await api.get('/houses');
                
                if (response.data.success) {
                    setHouses(response.data.data);
                    setTotalPages(response.data.data.totalPages);
                    setError(null);
                    toast.dismiss();
                    console.log(response.data.data);
                }
            } catch (error) {
                setError(error.response?.data?.message || 'Failed to load properties');
                toast.error(error.response?.data?.message || 'Failed to load properties');
            } finally {
                setLoading(false);
            }
        };

        fetchHouses();
    }, []);

    const handleSearch = async (e) => {
        e.preventDefault();
        setCurrentPage(1);
        setHouses([]);
        setLoading(true);
        
        try {
            const response = await api.get('/houses/search', { params: filters });
            
            if (response.data.success) {
                setHouses(response.data.data);
                setTotalPages(response.data.totalPages || 1);
                setError(null);
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Search failed');
            } finally {
                setLoading(false);
            }
    };
    const showFilter = () =>{
       showFilters ? setShowFilters(false) : setShowFilters(true);
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-6">
            {/* Mobile Filter Button */}
            <button 
                className="opacity-85 fixed bottom-2 right-6 z-50 flex items-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-full shadow-lg max-w-20"
                onClick={showFilter}
            >
                 {showFilters ? (<span><FiX className='inline' size={20} />Filters</span>
                    ) : (<span><FiFilter className='inline' size={20} />Filters</span>)}
            </button>

            <button 
                        className={`${showFilters ? 'hidden' : ''} fixed bottom-20 opacity-85 right-6 z-50 flex items-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-full shadow-lg`}
                        onClick={() => navigate("/auth/house/new/list")}
                    >
                        <FiPlusCircle className="text-xl" />
                        <span>Add Property</span>
                    </button>
            {/* Filter Sidebar */}
            <div className={`fixed inset-0 z-40 transform ${showFilters ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:transform-none md:w-full md:mr-8 md:block`}>
                <div className="inset-0 bg-black bg-opacity-40 md:hidden" onClick={() => setShowFilters(false)}></div>
                
                <div className="relative top-12 w-4/5 max-w-sm h-full bg-white p-6 shadow-xl overflow-y-auto md:w-full md:shadow-none md:overflow-visible">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-xl font-bold">Filters</h3>
                        <button 
                            className=" text-gray-500 hover:text-gray-700"
                            onClick={() => setShowFilters(false)}
                        >
                            <FiX size={24} />
                        </button>
                    </div>
                    
                    <form onSubmit={handleSearch} className="space-y-2">
                        {/* Search Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FiSearch className="text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Location, type, keywords..."
                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={filters.keyword}
                                    onChange={(e) => setFilters(prev => ({ ...prev, keyword: e.target.value }))}
                                />
                            </div>
                        </div>

                        {/* Price Range */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Price Range (ETB)</label>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Min"
                                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={filters.minPrice}
                                        onChange={(e) => handlePriceChange(e, 'minPrice')}
                                        maxLength={6}
                                    />
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Max"
                                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={filters.maxPrice}
                                        onChange={(e) => handlePriceChange(e, 'maxPrice')}
                                        maxLength={6}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Rooms */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Rooms</label>
                            <select
                                value={filters.rooms}
                                onChange={(e) => setFilters(prev => ({ ...prev, rooms: e.target.value }))}
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="all">Any</option>
                                {[1, 2, 3, 4, 5, 6].map(num => (
                                    <option key={num} value={num}>{num}+</option>
                                ))}
                            </select>
                        </div>

                        {/* Property Type */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                            <select
                                value={filters.houseType}
                                onChange={(e) => setFilters(prev => ({ ...prev, houseType: e.target.value }))}
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="all">All Types</option>
                                <option value="house">House</option>
                                <option value="apartment">Apartment</option>
                                <option value="villa">Villa</option>
                            </select>
                        </div>

                        {/* Sort */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                            <select
                                value={filters.sort}
                                onChange={(e) => setFilters(prev => ({ ...prev, sort: e.target.value }))}
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="newest">Newest</option>
                                <option value="priceAsc">Price: Low to High</option>
                                <option value="priceDesc">Price: High to Low</option>
                            </select>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-4">
                            <button
                                type="submit"
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition duration-200 flex items-center justify-center"
                                disabled={loading}
                            >
                                <FiSearch className="mr-2" />
                                Apply Filters
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Main Content */}
            <div className="md:flex md:gap-8">
                {/* Search and Action Bar - Desktop */}
                <div className="flex-1">
                    {/* Search Bar - Mobile */}
                    <form onSubmit={handleSearch} className="mb-6 md:w-3xl">
                        <div className="relative mx-auto">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FiSearch className="text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search properties..."
                                className={`${showFilters ? 'hidden' : ''} w-full pl-10 pr-24 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                value={filters.keyword}
                                onChange={(e) => setFilters(prev => ({ ...prev, keyword: e.target.value }))}
                            />
                            <button 
                                type="submit"
                                className={`${showFilters ? 'hidden' : 'absolute'} inset-y-0 right-0 max-w-24 text-white bg-blue-600 rounded-r-lg flex items-center`}
                                disabled={loading}
                            >
                                <FiSearch className="mr-2" />
                                Search
                            </button>
                        </div>
                    </form>

                    {/* Property Grid */}
                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
                            <div className="flex justify-between items-center">
                                <p className="text-red-700">{error}</p>
                                <button 
                                    className="text-red-700 underline"
                                    onClick={() => window.location.reload()}
                                >
                                    Try Again
                                </button>
                            </div>
                        </div>
                    )}

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {Array(6).fill().map((_, i) => <Skeleton key={i} />)}
                        </div>
                    ) : houses ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {houses.map((house) => (
                                <div key={house._id} className="bg-white rounded-xl shadow-md overflow-hidden transition-transform duration-300 hover:shadow-xl hover:-translate-y-1">
                                    <div className="p-4">
                                        <h3 className="text-xl font-bold flex items-center">
                                            <FiBookmark className="text-blue-600 mr-2" />
                                            {house.title}
                                        </h3>
                                    </div>
                                    
                                    <div className="relative h-64">
                                        <Slider {...getSliderSettings(house.image.length)} className="property-carousel">
                                        {house.image.map((img, index) => (
                                            <div key={index} className="carousel-slide h-64">
                                                <img height={100}
                                                    src={img?.url?.secure_url || '../public/images/placeholder-image.jpg'}
                                                    alt={`House ${index + 1}`}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => e.target.src = '/../public/images/placeholder-image.jpg'}
                                                />
                                            </div>
                                        ))}
                                    </Slider>
                                        <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 px-3 py-1 rounded-full text-blue-800 font-bold">
                                            ETB {house.price?.toLocaleString()}/month
                                        </div>
                                    </div>

                                    <div className="p-10">
                                        <div className="grid grid-cols-3 gap-2 mb-4 text-sm text-gray-600">
                                            <div className="flex items-center">
                                                <FiType className="mr-1 text-blue-600" />
                                                {house.houseType}
                                            </div>
                                            <div className="flex items-center">
                                                <FiHome className="mr-1 text-blue-600" />
                                                {house.numberOfRooms} Rooms
                                            </div>
                                            <div className="flex items-center col-span-3 md:col-span-1">
                                                <FiMapPin className="mr-1 text-blue-600" />
                                                <span className="truncate">{house.address}</span>
                                            </div>
                                        </div>
                                        
                                        <button
                                            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition duration-200"
                                            onClick={() => navigate(`/house/${house.slug}`)}
                                        >
                                            View Details
                                            <FiArrowRight className="ml-2 inline" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="text-2xl text-gray-500 mb-4">No properties found</div>
                        </div>
                    )}

                    {/* Pagination */}
                    {!loading && totalPages > 1 && (
                        <div className="mt-8">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={setCurrentPage}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export { Home };