import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import circle from './circle.png'; 
import { useNavigate } from 'react-router-dom';
import Google from './Google.png';

const SignupPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    showPassword: false,
  });
  const [error, setError] = useState('');

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const togglePasswordVisibility = () => {
    setFormData((prev) => ({
      ...prev,
      showPassword: !prev.showPassword,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setError('');
    navigate('/onboard2');
  };

  return (
    <div
      className="min-vh-100 d-flex align-items-center position-relative overflow-hidden"
      style={{ backgroundColor: '#000' }}
    >
      <div className="position-absolute w-100 h-100" style={{ zIndex: 0 }}>
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="position-absolute rounded-circle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${2 + Math.random() * 2}px`,
              height: `${2 + Math.random() * 2}px`,
              background: '#fff',
              animation: `twinkle ${2 + Math.random() * 4}s infinite`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {[{ t: '8%', l: '5%' }, { t: '15%', r: '10%' }, { b: '20%', l: '8%' }, { b: '15%', r: '12%' }, { t: '40%', r: '5%' }, { b: '60%', l: '3%' }].map((pos, idx) => (
        <div
          key={idx}
          className="position-absolute opacity-25"
          style={{
            top: pos.t || 'auto',
            bottom: pos.b || 'auto',
            left: pos.l || 'auto',
            right: pos.r || 'auto',
            transform: `rotate(${Math.floor(Math.random() * 90)}deg)`,
            fontSize: `${20 + Math.random() * 16}px`,
            color: '#fff'
          }}
        >
          ★
        </div>
      ))}

      <div className="container-fluid" style={{ zIndex: 1 }}>
        <div className="row min-vh-100 align-items-center">
          <div className="col-12 col-lg-7 d-flex align-items-center justify-content-center p-4">
            <div className="text-center position-relative">
              <div
                className="position-relative mx-auto rounded-circle overflow-hidden"
                style={{
                  width: '750px',
                  height: '750px',
                  maxWidth: '90vw',
                  maxHeight: '90vw',
                }}
              >
                <img
                  src={circle}
                  alt="Zodiac Wheel"
                  className="img-fluid w-100 h-100 object-fit-cover"
                />
              </div>

              <div
                className="position-absolute top-50 start-50 translate-middle text-white text-center"
                style={{ width: '80%' }}
              >
                <span className="d-block small text-white-50 mb-2">ETERNAL AI</span>
                <h1
                  className="display-5 fw-bold mb-4"
                  style={{
                    background: 'linear-gradient(135deg, rgba(161, 222, 47, 1), rgba(0, 163, 255, 1))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  Discover Your Cosmic Path
                </h1>
                <p className="small text-white-50 px-2 mb-4">
                  Connect with Eternal AI and explore your spiritual journey through the stars.
                </p>
                <button
                  className="btn px-4 py-2 fw-semibold"
                  style={{
                    background: 'linear-gradient(135deg, rgba(161, 222, 47, 1), rgba(0, 163, 255, 1))',
                    border: 'none',
                    color: 'white',
                    borderRadius: '8px',
                  }}
                >
                  Start Demo
                </button>
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-5 p-4">
            <div className="mx-auto" style={{ maxWidth: '400px' }}>
              <div className="text-center mb-4">
                <h2 className="text-white h3 mb-2">Welcome Back</h2>
                <p className="text-white-50 h5 fw-normal">Sign Up Now</p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="form-label text-white-50 small">Email address/Phone Number</label>
                  <input
                    type="email"
                    className="form-control bg-dark border-secondary text-white"
                    placeholder="john@gmail.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    style={{ backgroundColor: '#2a2a2a', borderColor: '#404040' }}
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label text-white-50 small">Password</label>
                  <div className="position-relative">
                    <input
                      type={formData.showPassword ? 'text' : 'password'}
                      className="form-control bg-dark border-secondary text-white"
                      placeholder="Enter password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      style={{ backgroundColor: '#2a2a2a', borderColor: '#404040' }}
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="position-absolute top-50 end-0 translate-middle-y btn btn-link text-white-50 p-0 me-3"
                      style={{ background: 'none', border: 'none' }}
                    >
                      {formData.showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label text-white-50 small">Rewrite Password</label>
                  <div className="position-relative">
                    <input
                      type={formData.showPassword ? 'text' : 'password'}
                      className="form-control bg-dark border-secondary text-white"
                      placeholder="Re-enter password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      style={{ backgroundColor: '#2a2a2a', borderColor: '#404040' }}
                      required
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="position-absolute top-50 end-0 translate-middle-y btn btn-link text-white-50 p-0 me-3"
                      style={{ background: 'none', border: 'none' }}
                    >
                      {formData.showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {error && (
                    <div className="text-danger small mt-1">
                      {error}
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="btn w-100 py-3 fw-semibold mb-4"
                  style={{
                    background: 'linear-gradient(135deg, rgba(161, 222, 47, 1), rgba(0, 163, 255, 1))',
                    border: 'none',
                    color: 'white',
                    borderRadius: '8px',
                  }}
                >
                  Sign UP
                </button>
              </form>

              <div className="position-relative text-center my-4">
                <hr className="text-white-50" />
                <span
                  className="position-absolute top-50 start-50 translate-middle bg-dark px-3"
                  style={{ color: '#ccc' }}
                >
                  Or
                </span>
              </div>

              <div className="row g-2 mb-4">
                <div className="col-6">
                  <button className="btn w-100 py-3 d-flex align-items-center justify-content-center bg-dark border-secondary text-white rounded-3">
                    <img src={Google} alt="Google Logo" style={{ width: '30px', height: '30px' }} />
                    <span className="ms-2 small">Google</span>
                  </button>
                </div>
                <div className="col-6">
                  <button className="btn w-100 py-3 bg-dark border-secondary text-white rounded-3">
                    Continue as Guest
                  </button>
                </div>
              </div>

              <div className="text-center">
                <span className="text-white-50 small">Already have an account </span>
                <a href="/login" className="text-white small text-decoration-none">Log-in</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }

        .form-control:focus {
          background-color: #2a2a2a;
          border-color: #0d6efd;
          box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.15);
          color: white;
        }

        .form-control::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }

        .btn:hover {
          transform: translateY(-1px);
          transition: transform 0.2s ease-in-out;
        }

        @media (max-width: 991.98px) {
          .display-5 {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default SignupPage;
