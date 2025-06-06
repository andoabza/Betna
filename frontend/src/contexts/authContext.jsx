import { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useUser } from './userContext.jsx';
import axios from 'axios';
import { registerUser, loginUser, listHouse } from '../auth/authenticator.js';
import { useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { setUser } = useUser();
  const navigate = useNavigate();
  const [error, setError] = useState('');
 


  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
          navigate('/login');
          toast.error('Session expired. Please login again.');
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [navigate, setUser]);



  const handleAuthSuccess = (data) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data));
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    setUser(data);
    navigate('/');
    toast.success(`Welcome ${data.name}!`);
  };

const handleAuthResponse = (response) => {
  try{
    if (response.success === true){
      handleAuthSuccess(response.data);
    }
    handleAuthError(response.message);
  }
  catch (error) {
    handleAuthError(error)
    console.log(error);
    toast.error('An error occurred while processing your request.');
  }
  };

  const handleAuthError = (error) => {
    setError(error)
    toast.error(error);
  };

  const register = async (formData) => {
    setError('');
    try {
      const response = await registerUser(formData);
      handleAuthResponse(response);
    } catch (error) {
      handleAuthError(error);
    }
  };

  const login = async (formData) => {
    setError('');
    try {
      const response = await loginUser(formData);
      if (response.success === true) {
        handleAuthResponse(response);
      }
      handleAuthError(response.message);
    } catch (error) {
      handleAuthError(error);
    }
  };

  const list = async (formData) => {
    setError('');
    try {
      const response = await listHouse(formData);
      if (response.success === true) {
        toast.success('House listed successfully!');
        handleAuthResponse(response);
      }
      console.log(response.message);
      handleAuthError(response.message);
    } catch (error) {
      console.log(error);
      handleAuthError(error);
    }
  };


  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    navigate('/auth/user/login');
    toast.success('Logged out successfully');
  };


  return (
    <AuthContext.Provider value={{ register, login, logout, list, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
