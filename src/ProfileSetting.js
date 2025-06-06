import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const ProfileSetting = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullname: 'John Doe',
    email: 'johndoe@gmail.com',
    password: '••••••••',
    confirmPassword: '••••••••'
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <>
      <style>
        {`
          .settings-container {
            height: 100vh;
            background: #1a1a1a;
            color: #ffffff;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          }
          
          .sidebar {
            background: #2d2d2d;
            border-right: 1px solid #404040;
            height: 100vh;
            overflow-y: auto;
            position: relative;
          }
          
          .sidebar-brand {
            padding: 20px;
            border-bottom: 1px solid #404040;
          }
          
          .sidebar-brand h4 {
            color: #00ff88;
            font-weight: 600;
            margin: 0;
            font-size: 1.5rem;
          }
          
          .sidebar-menu {
            padding: 20px 0;
          }
          
          .sidebar-item {
            padding: 12px 20px;
            cursor: pointer;
            transition: all 0.2s;
            border: none;
            background: none;
            color: #ffffff;
            text-align: left;
            width: 100%;
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 14px;
          }
          
          .sidebar-item:hover {
            background-color: #3d3d3d;
            color: #ffffff;
          }
          
          .sidebar-item.active {
            background-color: #00ff88;
            color: #000000;
            font-weight: 500;
          }
          
          .sidebar-item-icon {
            font-size: 16px;
            width: 20px;
            text-align: center;
          }
          
           .upgrade-card {
            margin: 20px;
            background: linear-gradient(135deg, rgba(161, 222, 47, 1), rgba(0, 163, 255, 1));
            border-radius: 15px;
            padding: 20px;
            text-align: center;
            color: #ffffff;
          }
          
          .upgrade-card h6 {
            font-weight: 600;
            margin-bottom: 10px;
            font-size: 16px;
          }
          
          .upgrade-card p {
            font-size: 12px;
            margin-bottom: 15px;
            opacity: 0.8;
            line-height: 1.4;
          }
          
          .upgrade-btn {
            background: #ffffff;
            color: #000000;
            border: none;
            padding: 8px 20px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 500;
            display: inline-flex;
            align-items: center;
            gap: 5px;
            transition: all 0.2s;
          }
          
          .upgrade-btn:hover {
            background: #f0f0f0;
            transform: translateY(-1px);
          }
          
          .user-profile {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            padding: 20px;
            border-top: 1px solid #404040;
            display: flex;
            align-items: center;
            gap: 10px;
            background: #2d2d2d;
          }
          
          .user-avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: #00ff88;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            color: #000000;
            font-size: 14px;
          }
          
          .user-info {
            flex: 1;
          }
          
          .user-name {
            font-size: 14px;
            font-weight: 500;
            margin: 0;
          }
          
          .settings-btn {
            background: none;
            border: none;
            color: #888888;
            font-size: 16px;
            cursor: pointer;
            padding: 5px;
          }
          
          .main-content {
            height: 100vh;
            display: flex;
            flex-direction: column;
            background: #1a1a1a;
          }
          
          .content-header {
            padding: 20px 30px;
            border-bottom: 1px solid #404040;
            display: flex;
            justify-content: between;
            align-items: center;
          }
          
          .search-bar {
            background: #2d2d2d;
            border: 1px solid #404040;
            border-radius: 20px;
            padding: 8px 15px;
            color: #ffffff;
            width: 300px;
            font-size: 14px;
          }
          
          .search-bar::placeholder {
            color: #888888;
          }
          
          .search-bar:focus {
            outline: none;
            border-color: #00ff88;
          }
          
          .header-icons {
            display: flex;
            gap: 15px;
            align-items: center;
          }
          
          .header-icon {
            width: 35px;
            height: 35px;
            border-radius: 50%;
            background: #2d2d2d;
            border: 1px solid #404040;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.2s;
            font-size: 14px;
          }
          
          .header-icon:hover {
            background: #3d3d3d;
            border-color: #555555;
          }
          
          .content-body {
            flex: 1;
            padding: 30px;
            overflow-y: auto;
          }
          
          .tabs-nav {
            display: flex;
            gap: 40px;
            border-bottom: 1px solid #404040;
            margin-bottom: 40px;
          }
          
          .tab-item {
            padding: 15px 0;
            cursor: pointer;
            font-size: 14px;
            font-weight: 400;
            color: #888888;
            border-bottom: 2px solid transparent;
            transition: all 0.2s;
            background: none;
            border-left: none;
            border-right: none;
            border-top: none;
          }
          
          .tab-item:hover {
            color: #ffffff;
          }
          
          .tab-item.active {
            color: #ffffff;
            border-bottom-color: #00ff88;
            font-weight: 500;
          }
          
          .profile-section {
            max-width: 800px;
          }
          
          .profile-avatar-section {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-bottom: 40px;
          }
          
          .profile-avatar {
            width: 100px;
            height: 100px;
            border-radius: 15px;
            background: #3d3d3d;
            margin-bottom: 15px;
            position: relative;
            overflow: hidden;
          }
          
          .profile-avatar img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
          
          .edit-avatar-btn {
            position: absolute;
            bottom: 5px;
            right: 5px;
            width: 25px;
            height: 25px;
            background: linear-gradient(135deg, rgba(161, 222, 47, 1), rgba(0, 163, 255, 1));
            border: none;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            font-size: 12px;
            color: #000000;
          }
          
          .section-title {
            font-size: 18px;
            font-weight: 500;
            margin-bottom: 25px;
            color: #ffffff;
          }
          
          .form-group {
            margin-bottom: 25px;
          }
          
          .form-label {
            display: block;
            margin-bottom: 8px;
            font-size: 14px;
            color: #ffffff;
            font-weight: 400;
          }
          
          .form-input {
            width: 100%;
            background: #2d2d2d;
            border: 1px solid #404040;
            border-radius: 8px;
            padding: 12px 15px;
            color: #ffffff;
            font-size: 14px;
            transition: all 0.2s;
          }
          
          .form-input:focus {
            outline: none;
            border-color: #00ff88;
            background: #333333;
          }
          
          .form-input::placeholder {
            color: #888888;
          }
          
          .password-input-container {
            position: relative;
          }
          
          .password-toggle {
            position: absolute;
            right: 15px;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            color: #888888;
            cursor: pointer;
            font-size: 16px;
          }
          
          .password-toggle:hover {
            color: #ffffff;
          }
          
          .update-btn {
            background: linear-gradient(135deg, rgba(161, 222, 47, 1), rgba(0, 163, 255, 1));
            border: none;
            color: #ffffff;
            padding: 12px 30px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
          }
          
          .update-btn:hover {
            transform: translateY(-1px);
            box-shadow: 0 5px 15px rgba(0, 255, 136, 0.3);
          }
          
          .mobile-menu-btn {
            display: none;
            background: none;
            border: none;
            color: #ffffff;
            font-size: 18px;
            cursor: pointer;
            padding: 5px;
          }
          
          @media (max-width: 768px) {
            .sidebar {
              position: fixed;
              top: 0;
              left: ${sidebarOpen ? '0' : '-280px'};
              width: 280px;
              z-index: 1000;
              transition: left 0.3s ease;
            }
            
            .mobile-menu-btn {
              display: block;
            }
            
            .search-bar {
              width: 200px;
            }
            
            .content-body {
              padding: 20px;
            }
            
            .tabs-nav {
              gap: 20px;
              overflow-x: auto;
              padding-bottom: 5px;
            }
            
            .form-input {
              font-size: 16px; /* Prevents zoom on iOS */
            }
            
            .sidebar-overlay {
              position: fixed;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: rgba(0, 0, 0, 0.5);
              z-index: 999;
              display: ${sidebarOpen ? 'block' : 'none'};
            }
          }
          
          @media (max-width: 576px) {
            .content-header {
              padding: 15px 20px;
            }
            
            .header-icons {
              gap: 10px;
            }
            
            .search-bar {
              width: 150px;
            }
            
            .profile-avatar {
              width: 80px;
              height: 80px;
            }
            
            .tabs-nav {
              gap: 15px;
            }
            
            .tab-item {
              font-size: 13px;
              padding: 12px 0;
            }
          }
        `}
      </style>

      <div className="settings-container">
        {/* Sidebar Overlay for Mobile */}
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>
        
        <div className="row g-0 h-100">
          {/* Sidebar */}
          <div className="col-md-3 col-lg-2 sidebar">
            <div className="sidebar-brand">
              <h4>Eternal AI</h4>
            </div>
            
            <div className="sidebar-menu">
              <button className="sidebar-item">
                <span className="sidebar-item-icon">🤖</span>
                Chat UI
              </button>
              <button className="sidebar-item">
                <span className="sidebar-item-icon">📝</span>
                My History
              </button>
              <button className="sidebar-item active">
                <span className="sidebar-item-icon">⚙️</span>
                Settings
              </button>
            </div>
            
            <div className="upgrade-card">
              <div className="d-flex align-items-center justify-content-center mb-2">
                <span style={{fontSize: '24px'}}>✨</span>
              </div>
              <h6>Upgrade to Pro</h6>
              <p>Unlock powerful features with our pro upgrade today!</p>
              <button className="upgrade-btn">
                Upgrade now →
              </button>
            </div>
            
            <div className="user-profile">
              <div className="user-avatar">AP</div>
              <div className="user-info">
                <div className="user-name">Adela Parkson</div>
              </div>
              <button className="settings-btn">⚙️</button>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="col-md-9 col-lg-10 main-content">
            {/* Header */}
            <div className="content-header">
              <div className="d-flex align-items-center gap-3">
                <button className="mobile-menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
                  ☰
                </button>
                <input type="text" className="search-bar" placeholder="🔍 Search" />
              </div>
              
              <div className="header-icons">
                <div className="header-icon">🔔</div>
                <div className="header-icon">🌙</div>
                <div className="header-icon">❓</div>
                <div className="user-avatar">AP</div>
              </div>
            </div>
            
            {/* Content Body */}
     <div className="content-body">
      {/* Tabs Navigation */}
      <div className="tabs-nav d-flex justify-content-center gap-3">
        <button
          className={`tab-item ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          Profile Details
        </button>
        <button
          className={`tab-item ${activeTab === 'preferences' ? 'active' : ''}`}
          onClick={() => setActiveTab('preferences')}
        >
          Preferences
        </button>
        <button
          className={`tab-item ${activeTab === 'billing' ? 'active' : ''}`}
          onClick={() => setActiveTab('billing')}
        >
          Plan and Billing
        </button>
      </div>

      {/* Profile Details Content */}
      {activeTab === 'profile' && (
        <div className="profile-section mx-auto text-center">
          {/* Profile Avatar Section */}
          <div className="profile-avatar-section d-flex justify-content-center mb-4">
            <div className="profile-avatar position-relative">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
                alt="Profile"
                className="rounded-circle"
                style={{ width: "100px", height: "100px" }}
              />
              <button className="edit-avatar-btn position-absolute top-0 end-0 bg-primary text-white rounded-circle p-2">
                ✏️
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Personal Information */}
            <div className="section-title">Personal Information</div>

            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <div className="form-label">Your fullname*</div>
                  <input
                    type="text"
                    name="fullname"
                    className="form-input form-control"
                    value={formData.fullname}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <div className="form-label">Your email*</div>
                  <input
                    type="email"
                    name="email"
                    className="form-input form-control"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                  />
                </div>
              </div>
            </div>

            {/* Password Section */}
            <div className="section-title">Password</div>

            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <div className="form-label">Password*</div>
                  <div className="password-input-container">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      className="form-input form-control"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      className="password-toggle btn btn-sm"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? '🙈' : '👁️'}
                    </button>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <div className="form-label">Confirm Password*</div>
                  <div className="password-input-container">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      className="form-input form-control"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      className="password-toggle btn btn-sm"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? '🙈' : '👁️'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Update Button */}
            <div className="mt-4 text-center">
              <button onClick={handleSubmit} className="update-btn btn btn-success px-4 py-2">
                Update
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Preferences Content */}
      {activeTab === 'preferences' && (
        <div className="profile-section mx-auto text-center">
          <div className="section-title">Preferences</div>
          <p style={{ color: '#888888' }}>Preferences content will be displayed here.</p> 
        </div>
      )}

      {/* Billing Content */}
      {activeTab === 'billing' && (
        <div className="profile-section mx-auto text-center">
          <div className="section-title">Plan and Billing</div>
          <p style={{ color: '#888888' }}>Billing and plan information will be displayed here.</p>
        </div>
      )}
    </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileSetting;