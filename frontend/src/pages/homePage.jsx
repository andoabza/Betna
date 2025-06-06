import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { toast } from 'react-toastify';
import '../styles/home.css';
import { Skeleton } from './Skeleton';
import { Pagination } from './Pagination';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { FiArrowLeft, FiArrowRight, FiSearch, FiPlusCircle, FiFilter, FiX, FiSliders, FiAnchor, FiHome, FiBookmark, FiMapPin, FiActivity, FiType } from 'react-icons/fi';

const Home = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [houses, setHouses] = useState([]);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        search: '',
        minPrice: '0',
        maxPrice: '0',
        rooms: 'all',
        type: 'all',
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

    

    const handleMin  = (e) =>{
    setFilters(prev => ({ ...prev, minPrice: e.target.value.replace(/\D/g, "")}))
    }
    const handleMax  = (e) =>{
    setFilters(prev => ({ ...prev, maxPrice: e.target.value.replace(/\D/g, "")}))
  }


    useEffect(() => {
        const fetchHouses = async () => {
            try {
                const response = await api.get('/houses');
                
                if (response.data.success) {
                    setHouses(response.data.data);
                    setTotalPages(response.data.data.totalPages);
                    setError(null);
                    toast.dismiss();
                }
            } catch (error) {
                setError(error.response?.data?.message || 'Failed to load properties');
                toast.error(error.response?.data?.message || 'Failed to load properties');
            } finally {
                setLoading(false);
            }
        };

        fetchHouses();
    }, [filters]);

    const handleSearch = async (e) => {
        setCurrentPage(1);
        e.preventDefault();
        try {
                const response = await api.get('/search',
                    {
                    params: filters
                }
            );
                
                if (response.data.success) {
                    setHouses(response.data.data);
                    setTotalPages(response.data.data.totalPages);
                    setError(null);
                    toast.dismiss();
                }
            } catch (error) {
                setError(error.response?.data?.message || 'Failed to load properties');
                toast.error(error.response?.data?.message || 'Failed to load properties');
            } finally {
                setLoading(false);
            }
    }
    return (
        <div className="home-container">
            {/* Mobile Filter Toggle */}

            {/* Filter Sidebar */}
            <div className={`filter-sidebar ${showFilters ? 'active' : ''}`}>
                <div className="sidebar-header">
                    <h3>Filters</h3>
                    <button 
                        className="close-filters"
                        onClick={() => setShowFilters(false)}
                    >
                        <FiX />
                    </button>
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

            {/* Main Content */}
            <div className="main-content">
                {/* Search and Action Bar */}
                <div className="action-bar flex justify-center gap-2">
                    <form className="search-box">
                        <FiSearch className="search-icon" />
                        <input
                            className='p-10'
                            type="text"
                            placeholder="Search by location, type, or keywords..."
                            value={filters.search}
                            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                        />
                        <button className='absolute p-4 top-4 max-w-3 bg-black' type='submit' disabled={loading} onSubmit={handleSearch}>
                            <FiSearch className="search-icon" />
                        </button>
                        
                    </form>
                        <button className="bg-none filter-btn p-1" onClick={() => setShowFilters(!showFilters)}>
                <FiSliders className='inline' /> Filters
            </button>

                    <button onClick={() => navigate("/auth/house/new/list")}>
                            <FiPlusCircle className='inline text-white'/> Add Property
                    </button>
                </div>

                {/* Property Grid */}
                {error && (
                    <div className="error-banner">
                        <p className='border-none'>{error}</p>
                        <button className='w-40 p-2' onClick={() => window.location.reload()}>Try Again</button>
                    </div>
                )}

                <div className="properties-grid">
                    {loading ? (
                        Array(6).fill().map((_, i) => <Skeleton key={i} />)
                    ) : houses.length > 0 ? (
                        houses.map((house) => (
                            <article key={house._id} className="property-card">
                                <div className='m-2 p-2 font-bold'>
                                    <h2 className='text-2xl'><FiBookmark className='inline'/> {house.title}</h2>

                                </div>
                                <div className="card-media">
                                    <Slider {...getSliderSettings(house.image.length)} className="property-carousel">
                                        {house.image.map((img, index) => (
                                            <div key={index} className="carousel-slide h-full">
                                                <img height={100}
                                                    src={img?.url?.secure_url || '../public/images/placeholder-image.jpg'}
                                                    alt={`House ${index + 1}`}
                                                    onError={(e) => e.target.src = '/../public/images/placeholder-image.jpg'}
                                                />
                                            </div>
                                        ))}
                                    </Slider>
                                    <span className="price-tag">ETB {house.price?.toLocaleString()}/month</span>
                                </div>

                                <div className="card-content">
                                    <div className="property-meta">
                                        <span><FiType className='inline'/> {house.houseType}</span>
                                        <span><FiHome className='inline'/> {house.numberOfRooms} Rooms</span>
                                        <span><FiMapPin className='inline'/> {house.address}</span>
                                    </div>
                                    <button
                                        className="cta-button"
                                        onClick={() => navigate(`/house/${house.slug}`)}
                                    >
                                        View Details <FiArrowRight />
                                    </button>
                                </div>
                            </article>
                        ))
                    ) : (
                        <div>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {!loading && totalPages > 1 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                )}
            </div>
        </div>
    );
}

export { Home };