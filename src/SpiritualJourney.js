import React, { useState } from 'react';
import { Calendar, Clock, User, Upload, Star } from 'lucide-react';
import circle from './circle.png'; 
import { useNavigate } from 'react-router-dom'; 

const SpiritualJourney = () => {
   const navigate = useNavigate();
  const [formData, setFormData] = useState({
    gender: 'Male',
    name: '',
    dateOfBirth: '24/03/2003',
    timeOfBirth: 'HH:MM',
    timeFormat: 'AM'
  });
  const [profileImage, setProfileImage] = useState(null);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };
      const handleSubmit = (e) => {
    e.preventDefault();
    console.log("check")

    // Add your login logic here (optional)

    // Navigate to /profile
    navigate('/onhome');
  };

  return (
    <div className="min-vh-100 d-flex align-items-center" style={{ 
      background: '#000000',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated Stars */}
      <div className="position-absolute w-100 h-100" style={{ zIndex: 0 }}>
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="position-absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: '2px',
              height: '2px',
              background: '#ffffff',
              borderRadius: '50%',
              animation: `twinkle ${2 + Math.random() * 3}s infinite`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Large Decorative Stars */}
      <Star className="position-absolute text-white opacity-25" size={24} style={{ top: '10%', left: '5%', transform: 'rotate(15deg)' }} />
      <Star className="position-absolute text-white opacity-25" size={32} style={{ top: '20%', right: '8%', transform: 'rotate(-20deg)' }} />
      <Star className="position-absolute text-white opacity-25" size={20} style={{ bottom: '15%', left: '10%', transform: 'rotate(45deg)' }} />
      <Star className="position-absolute text-white opacity-25" size={28} style={{ bottom: '70%', right: '15%', transform: 'rotate(-30deg)' }} />

      <div className="container-fluid" style={{ zIndex: 1 }}>
        <div className="row min-vh-100 align-items-center">
          {/* Left Side - Zodiac Wheel */}
          <div className="col-12 col-lg-7 d-flex align-items-center justify-content-center p-4">
            <div className="text-center position-relative">
              {/* Zodiac Wheel */}
              <div
                className="position-relative mx-auto"
                style={{
                  width: '750px',
                  height: '750px',
                  maxWidth: '90vw',
                  maxHeight: '90vw',
                  overflow: 'hidden',
                  borderRadius: '50%',
                //   border: '2px solid #00bfff'
                }}
              >
                <img
                  src={circle}
                  alt="Zodiac Wheel"
                  className="img-fluid w-100 h-100 object-fit-cover"
                  style={{
                    borderRadius: '50%' // Ensures the image is circular
                  }}
                />
              </div>

              {/* Centered Text Over Wheel */}
              <div
                className="position-absolute top-50 start-50 translate-middle text-center"
                style={{ width: '80%' }}
              >
                <div className="mb-2">
                  <span className="text-white-50 small">ETERNAL AI</span>
                </div>
                <h1
                  className="display-6 fw-bold mb-3"
                  style={{
                    background: 'linear-gradient(135deg, rgba(161, 222, 47, 1), rgba(0, 163, 255, 1))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                >
                  Begin Your Spiritual<br />Journey
                </h1>
                <p className="text-white-50 small px-3">
                  Lorem ipsum dolor sit amet consectetur. Arcu a sit commodo tempor nulla blandit.<br />
                  Posuere vel netus consectetur phasellus fermentum.
                </p>
              </div>
            </div>
          </div>

          {/* Right Side - Profile Form */}
          <div className="col-12 col-lg-5 p-4">
            <div className="mx-auto" style={{ maxWidth: '400px' }}>
              <div className="text-center mb-4">
                <h2 className="text-white h4 mb-2">Your gateway to cosmic discovery</h2>
                <p className="text-white-50 small mb-4">Upload your profile</p>
                {/* Profile Image Upload */}
                <div className="position-relative d-inline-block mb-4">
                  <div
                    className="rounded-circle bg-secondary d-flex align-items-center justify-content-center position-relative overflow-hidden"
                    style={{ width: '100px', height: '100px' }}
                  >
                    {profileImage ? (
                      <img
                        src={profileImage}
                        alt="Profile"
                        className="w-100 h-100 object-fit-cover"
                      />
                    ) : (
                      <User size={40} className="text-white-50" />
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="position-absolute top-0 start-0 w-100 h-100 opacity-0"
                    style={{ cursor: 'pointer' }}
                  />
                  <div
                    className="position-absolute bottom-0 end-0 bg-primary rounded-circle d-flex align-items-center justify-content-center"
                    style={{ width: '32px', height: '32px' }}
                  >
                    <Upload size={16} className="text-white" />
                  </div>
                </div>
              </div>
              {/* Form */}
              <div>
                {/* Gender Selection */}
                <div className="mb-4">
                  <label className="form-label text-white mb-3">Gender</label>
                  <div className="row g-2">
                    {[
                      { value: 'Male', icon: '♂', label: 'Male' },
                      { value: 'Female', icon: '♀', label: 'Female' },
                      { value: 'Other', icon: '⚧', label: 'Other' }
                    ].map((option) => (
                      <div key={option.value} className="col-4">
                        <button
                          type="button"
                          className={`btn w-100 py-3 border ${
                            formData.gender === option.value
                              ? 'border-primary bg-primary bg-opacity-10 text-primary'
                              : 'border-secondary bg-dark text-white-50'
                          }`}
                          onClick={() => handleInputChange('gender', option.value)}
                        >
                          <div className="d-flex flex-column align-items-center">
                            <span style={{ fontSize: '20px' }}>{option.icon}</span>
                            <small className="mt-1">{option.label}</small>
                          </div>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Name Input */}
                <div className="mb-4">
                  <label className="form-label text-white">Your Name</label>
                  <input
                    type="text"
                    className="form-control bg-dark border-secondary text-white"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    style={{ padding: '12px 16px' }}
                  />
                </div>
                {/* Date of Birth */}
                <div className="mb-4">
                  <label className="form-label text-white">Date of Birth</label>
                  <div className="position-relative">
                    <input
                      type="text"
                      className="form-control bg-dark border-secondary text-white"
                      placeholder="DD/MM/YYYY"
                      value={formData.dateOfBirth}
                      onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                      style={{ padding: '12px 16px', paddingRight: '40px' }}
                    />
                    <Calendar
                      size={20}
                      className="position-absolute top-50 end-0 translate-middle-y me-3 text-white-50"
                    />
                  </div>
                </div>
                {/* Time of Birth */}
                <div className="mb-4">
                  <label className="form-label text-white">Time of Birth</label>
                  <div className="row g-2">
                    <div className="col-8">
                      <div className="position-relative">
                        <input
                          type="text"
                          className="form-control bg-dark border-secondary text-white-50"
                          placeholder="HH:MM"
                          value={formData.timeOfBirth}
                          onChange={(e) => handleInputChange('timeOfBirth', e.target.value)}
                          style={{ padding: '12px 16px', paddingRight: '40px' }}
                        />
                        <Clock
                          size={20}
                          className="position-absolute top-50 end-0 translate-middle-y me-3 text-white-50"
                        />
                      </div>
                    </div>
                    <div className="col-4">
                      <div className="btn-group w-100" role="group">
                        <button
                          type="button"
                          className={`btn ${
                            formData.timeFormat === 'AM'
                              ? 'btn-primary'
                              : 'btn-outline-secondary text-white-50'
                          }`}
                          onClick={() => handleInputChange('timeFormat', 'AM')}
                        >
                          AM
                        </button>
                        <button
                          type="button"
                          className={`btn ${
                            formData.timeFormat === 'PM'
                              ? 'btn-primary'
                              : 'btn-outline-secondary text-white-50'
                          }`}
                          onClick={() => handleInputChange('timeFormat', 'PM')}
                        >
                          PM
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Submit Button */}
                <button
                  type="submit"
                  className="btn w-100 py-3 fw-semibold"
                  style={{
                   background: 'linear-gradient(135deg, rgba(161, 222, 47, 1), rgba(0, 163, 255, 1))',
                    border: 'none',
                    color: 'white'
                  }}
                  onClick={handleSubmit}

                >
                  Create Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        .form-control:focus {
          background-color: #212529 !important;
          border-color: #0d6efd !important;
          box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25) !important;
          color: white !important;
        }
        .form-control::placeholder {
          color: rgba(255, 255, 255, 0.5) !important;
        }
        .btn:focus {
          box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25) !important;
        }
        @media (max-width: 991.98px) {
          .display-6 {
            font-size: 1.75rem !important;
          }
        }
        @media (max-width: 575.98px) {
          .display-6 {
            font-size: 1.5rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default SpiritualJourney;