import { useState } from 'react';
import { useAuth } from '../contexts/authContext';
import { Link } from 'react-router-dom';

const Login = () => {
  const { login, error } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Invalid email format';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      try{
        await login(formData);
      } catch (err) {
        setFormErrors(prev => ({ ...prev, login: err.message }));
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Welcome Back! 👋</h2>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="input-label">
              <span>📧 Email</span>
              <input
              autoComplete=''
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className={`form-input ${formErrors.email ? 'input-error' : ''}`}
                placeholder="john@example.com"
              />
            </label>
            {formErrors.email && <span className="error-text">{formErrors.email}</span>}
          </div>

          <div className="form-group">
            <label className="input-label">
              <span>🔒 Password</span>
              <div className="password-input">
                <input
                autoComplete=''
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className={`form-input ${formErrors.password ? 'input-error' : ''}`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '🗨️' : '👁️'}
                </button>
              </div>
            </label>
            {formErrors.password && <span className="error-text">{formErrors.password}</span>}
          </div>

          {error && (
            <div className="form-error">
              {typeof error === 'object' ? error.message : error}
            </div>
          )}
          <button 
            type="submit" 
            className="auth-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Logging in...' : 'Sign In'}
          </button>
        </form>

        <div className="auth-options">
          <p className="auth-switch">
            Don't have an account? 
            <Link to="/register" className="auth-link">Register here</Link>
          </p>
          <Link to="/forgot-password" className="auth-link">Forgot password?</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;