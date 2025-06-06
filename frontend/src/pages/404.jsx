// 404.jsx
// write a 404 page with a navbar and a button to go back to the home page and show a message that the page is not found and the navbar should be responsive and the button should be styled with css and the page should be styled with css and the button should be centered in the middle of the page and the message should be centered in the middle of the page and the navbar should be at the top of the page and the button should be at the bottom of the page and the message should be at the top of the page with animation and the button should have a hover effect and the message should have a fade in effect and the navbar should have a hover effect and the button should have a click effect and the message should have a click effect and the navbar should have a click effect and the button should have a focus effect and the message should have a focus effect and the navbar should have a focus effect and the button should have a blur effect and the message should have a blur effect and the navbar should have a blur effect and the button should have a transition effect and the message should have a transition effect and the navbar should have a transition effect and the button should have a transform effect and the message should have a transform effect and the navbar should have a transform effect and the button should have a scale effect and the message should have a scale effect and the navbar should have a scale effect and the button should have a rotate effect and the message should have a rotate effect and the navbar should have a rotate effect and the button should have a skew effect and the message should have a skew effect and the navbar should have a skew effect and the button should have a translate effect and the message should have a translate effect and the navbar should have a translate effect and the button should have a translate3d effect and the message should have a translate3d effect and the navbar should have a translate3d effect and the button should have a translateZ effect and the message should have a translateZ effect and the navbar should have a translateZ effect and the button should have a translateY effect and the message should have a translateY effect and the navbar should have a translateY effect and the button should have a translateX effect and the message should have a translateX effect and the navbar should have a translateX effect 
// and the button should have a translate3d effect and the message should have a translate3d effect and the navbar should have a translate3d effect and the button should have a translateZ effect and the message should have a translateZ effect and the navbar should have a translateZ effect and the button should have a translateY effect and the message should have a translateY effect and the navbar should have a translateY effect and the button should have a translateX effect and the message should have a translateX effect and the navbar should have a translateX effect
// 
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from './navbar';
import '../styles/404.css';

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className='not-found'>
            <div className='not-found-content'>
                <h1>404</h1>
                <p>Page Not Found</p>
                <button onClick={() => navigate('/home')}>Go to Home</button>
            </div>
        </div>
    );
}
export { NotFound };