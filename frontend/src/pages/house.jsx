import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { FiArrowLeft, FiArrowRight, FiHome, FiMapPin, FiMessageSquare, FiMail, FiPhone } from 'react-icons/fi';
import api from '../api/api';
import '../styles/home.css';

const House = () => {
    const { slug } = useParams();
    const [loading, setLoading] = useState(true);
    const [house, setHouse] = useState(null);
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);

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
    if (user) {
        var len = user.phoneNumber.length;
        console.log(len);
    }
    useEffect(() => {
        const fetchHouse = async () => {
            try {
                setLoading(true);
                const response = await api.get(`houses/${slug}`);
                const user = await api.get(`users/${response.data.data.user._id}`);
                setUser(user.data.data)
                setHouse(response.data.data);
                setError(null);
            } catch (err) {
                setError('Failed to load house details. Please try again later.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchHouse();
    }, [slug]);

    if (loading) {
        return (
            <div className="loading-overlay">
                <div className="spinner"></div>
                <p>Loading house details...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <div className="error-card">
                    <h2>⚠️ Something went wrong</h2>
                    <p>{error}</p>
                    <button 
                        className="retry-button"
                        onClick={() => window.location.reload()}
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (!house) return null;

    return (
        <div className="house-detail-container">
            <div className="house-content">
                <section className="gallery-section">
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
                </section>

                <section className="details-section">
                    <div className="price-badge">
                        <span className="price">ETB {house.price.toLocaleString()}</span>
                        <span className="per-month">/month</span>
                    </div>

                    <h1 className="house-title">{house.title}</h1>
                    
                    <div className="meta-grid">
                        <div className="meta-item">
                            <FiHome className="meta-icon" />
                            <div>
                                <span className="meta-label">Type: </span>
                                <span className="meta-value">{house.houseType}</span>
                            </div>
                        </div>
                        <div className="meta-item">
                            <FiHome className="meta-icon" />
                            <div>
                                <span className="meta-label">Rooms: </span>
                                <span className="meta-value">{house.numberOfRooms}</span>
                            </div>
                        </div>
                        <div className="meta-item">
                            <FiMapPin className="meta-icon" />
                            <div>
                                <span className="meta-label">Location: </span>
                                <span className="meta-value">{house.address}</span>
                            </div>
                        </div>
                    </div>

                    <div className="description-card">
                        <h3 className="section-title">Description</h3>
                        <p className="description-text">{house.description}</p>
                    </div>

                    <div className="contact-card">
                        <h3 className="section-title">Contact Owner</h3>
                        <div className="owner-profile">
                            <img 
                                src={house.user?.avatar || '/avatar-placeholder.png'} 
                                alt="Owner" 
                                className="owner-avatar"
                            />
                            <div className="owner-info">
                                <h4 className="owner-name">{user?.name || 'Property Owner'}</h4>
                                {user?.phoneNumber && (
                                    <div className="contact-line">
                                        <FiPhone className="contact-icon inline" />
                                        <span>{user.phoneNumber}</span>
                                    </div>
                                )}
                                {user?.email && (
                                    <div className="contact-line">
                                        <FiMail className="contact-icon inline" />
                                        <span>{user.email}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <button className="message-button">
                            <FiMessageSquare className="button-icon" />
                            {/* phone number starting from 1index to final */}

                            Contact <a href={`tel:+251${user.phoneNumber[1, -1]}`}>{user.phoneNumber}</a>
                        </button>
                    </div>
                </section>
            </div>
        </div>
    );
};
export { House };