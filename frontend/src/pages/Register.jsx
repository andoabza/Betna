import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/authContext';
import { Link } from 'react-router-dom';
import '../styles/Register.css';

const Register = () => {
  const { register, error } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    password: ''
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [confirmStrength, setConfirmStrength] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Password strength calculator
  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^A-Za-z0-9]/)) strength++;
    return strength;

  };

  // Real-time validation
  const validateForm = () => {
    const errors = {};
    const phoneRegex = /^[0-9]{10}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.name.trim()) errors.name = 'Name is required';
    else if (formData.name.length < 5) errors.name = 'Name must be at least 2 characters';
    
    if (!formData.email) errors.email = 'Email is required';
    else if (!emailRegex.test(formData.email)) errors.email = 'Invalid email format';
    
    if (!formData.phoneNumber) errors.phoneNumber = 'Phone number is required';
    else if (!phoneRegex.test(formData.phoneNumber)) errors.phoneNumber = 'Invalid phone number (10 digits required)';
    else if (!formData.phoneNumber.startsWith('09') && !formData.phoneNumber.startsWith('07')) errors.phoneNumber = 'Phone number must start with 09 or 07';

    if (!formData.password) errors.password = 'Password is required';
    else if (passwordStrength < 3) errors.password = 'Password too weak';
    
    if (formData.password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePhoneInput = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    setFormData(prev => ({ ...prev, phoneNumber: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      await register(formData);
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    setPasswordStrength(calculatePasswordStrength(formData.password));
    setConfirmStrength(calculatePasswordStrength(confirmPassword));

  }, [formData.password, confirmPassword]);

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Create Your Account</h2>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="input-label">
              <span>👤 Full Name</span>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className={`form-input ${formErrors.name ? 'input-error' : ''}`}
                placeholder="John Doe"
              />
            </label>
            {formErrors.name && <span className="error-text">{formErrors.name}</span>}
          </div>

          <div className="form-group">
            <label className="input-label">
              <span>📧 Email</span>
              <input
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
              <span>📱 Phone Number</span>
              <input
                type="tel"
                value={formData.phoneNumber}
                onChange={handlePhoneInput}
                className={`form-input ${formErrors.phoneNumber ? 'input-error' : ''}`}
                placeholder="0912345678"
                maxLength="10"
              />
            </label>
            {formErrors.phoneNumber && <span className="error-text">{formErrors.phoneNumber}</span>}
          </div>

          <div className="form-group">
            <label className="input-label">
              <span>🔒 Password</span>
              <div className="password-input">
                <input
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
            <div className="password-strength">
              <div className={`strength-bar strength-${passwordStrength}`} />
              <span className="strength-text">
                {['Weak', 'Fair', 'Good', 'Strong'][passwordStrength - 1] || ''}
              </span>
            </div>
            {formErrors.password && <span className="error-text">{formErrors.password}</span>}
          </div>

          <div className="form-group">
            <label className="input-label">
              <span>🔒 Confirm Password</span>
              <div className="password-input">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value )}
                  className={`form-input ${confirmPassword ? 'input-error' : ''}`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? '🗨️' : '👁️'}
                </button>
              </div>
            </label>
            <div className="password-strength">
              <div className={`strength-bar strength-${confirmStrength}`} />
              <span className="strength-text">
                {['Weak', 'Fair', 'Good', 'Strong'][confirmStrength - 1] || ''}
              </span>
            </div>
            {formErrors.confirmPassword && <span className="error-text">{formErrors.confirmPassword}</span>}
          </div>

          {error && <div className="form-error">{error}</div>}

          <button 
            type="submit" 
            className="auth-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Registering...' : 'Create Account'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? 
          <Link to="/login" className="auth-link">Log in here</Link>
        </p>
      </div>
    </div>
  );
};

export { Register };