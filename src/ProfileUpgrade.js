import React, { useState } from 'react';
import { X, Check, Star, Search, Bell, Moon, HelpCircle, Settings, MessageSquare, History, User } from 'lucide-react';

const ProfileUpgrade = () => {
  const [activeTab, setActiveTab] = useState('Your Plan');

  const plans = [
    {
      name: 'Free',
      price: 'USD $0/month',
      image: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      features: [
        'Limited access to Multiple Personalities (3 personalities)',
        'Basic Dynamic Suggestions',
        'Multi-platform integration (limited to 1 device)',
        'Multilingual Support (2 languages)'
      ],
      buttonText: 'Your Current Plan',
      buttonClass: 'btn-outline-secondary',
      disabled: true
    },
    {
      name: 'Plus',
      price: 'USD $20/month',
      image: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      badge: 'Best Selling',
      features: [
        'Access to Multiple Personalities (10 personalities)',
        'Real-time Web References (unlimited queries)',
        'Multi-platform integration (up to 5 devices)',
        'Multilingual Support (10 languages)'
      ],
      buttonText: 'Upgrade to Team',
      buttonClass: 'btn-primary',
      disabled: false
    },
    {
      name: 'Team',
      price: 'USD $240/month (per user)',
      image: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
      features: [
        'Advanced Generated Images (limited to 100 images/month for the team)',
        'Multilingual Support (15 languages)',
        'Advanced Feedback Mechanism',
        'Collaborative conversation features for team projects'
      ],
      buttonText: 'Upgrade to Team',
      buttonClass: 'btn-success',
      disabled: false
    }
  ];

  return (
    <div className="min-vh-100" style={{ backgroundColor: '#1a1a1a', color: '#ffffff' }}>
      {/* Sidebar */}
      <div className="d-flex">
        <div className="sidebar position-fixed start-0 top-0 h-100 d-none d-lg-block" style={{ width: '250px', backgroundColor: '#2a2a2a', zIndex: 1000 }}>
          <div className="p-4">
            <h4 className="text-success mb-4">Eternal AI</h4>
            
            <nav className="nav flex-column">
              <a className="nav-link text-light d-flex align-items-center mb-3 active">
                <MessageSquare size={20} className="me-3 text-success" />
                Chat UI
              </a>
              <a className="nav-link text-muted d-flex align-items-center mb-3">
                <History size={20} className="me-3" />
                My History
              </a>
              <a className="nav-link text-muted d-flex align-items-center mb-3">
                <Settings size={20} className="me-3" />
                Settings
              </a>
            </nav>
          </div>

          {/* Upgrade Card */}
          <div className="position-absolute bottom-0 start-0 w-100 p-4">
            <div className="card text-center" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none' }}>
              <div className="card-body">
                <Star className="text-warning mb-2" size={24} />
                <h6 className="text-white mb-2">Upgrade to Pro</h6>
                <p className="text-white-50 small mb-3">Unlock powerful features with our pro upgrade today!</p>
                <button className="btn btn-light btn-sm">
                  Upgrade now <span className="ms-1">→</span>
                </button>
              </div>
            </div>
            
            <div className="d-flex align-items-center mt-3 text-muted">
              <User size={20} className="me-2" />
              <span className="small">Adela Parkson</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-grow-1" style={{ marginLeft: '250px' }}>
          {/* Header */}
          <header className="d-flex justify-content-between align-items-center p-4 border-bottom" style={{ borderColor: '#333' }}>
            <div></div>
            <div className="d-flex align-items-center">
              <div className="position-relative me-3">
                <Search size={20} className="text-muted" />
                <input 
                  type="text" 
                  placeholder="Search" 
                  className="form-control bg-dark text-light border-0 ps-5"
                  style={{ width: '200px' }}
                />
              </div>
              <Bell size={20} className="text-muted me-3" />
              <Moon size={20} className="text-muted me-3" />
              <HelpCircle size={20} className="text-muted me-3" />
              <div className="rounded-circle bg-secondary" style={{ width: '32px', height: '32px' }}></div>
            </div>
          </header>

          {/* Content Area */}
          <div className="container-fluid p-4">
            {/* Tabs */}
            <ul className="nav nav-tabs border-0 mb-4">
              {['Profile Settings', 'Preferences', 'Your Plan'].map((tab) => (
                <li className="nav-item" key={tab}>
                  <button
                    className={`nav-link ${activeTab === tab ? 'active text-white border-bottom border-primary' : 'text-muted'} bg-transparent border-0`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab}
                  </button>
                </li>
              ))}
            </ul>

            {/* Pricing Modal */}
            <div className="row justify-content-center">
              <div className="col-12 col-xl-10">
                <div className="card bg-dark border-secondary">
                  <div className="card-header bg-transparent border-secondary d-flex justify-content-between align-items-center">
                    <h4 className="mb-0 text-white">Upgrade Your Plan</h4>
                    <button className="btn btn-link text-muted p-0">
                      <X size={24} />
                    </button>
                  </div>
                  
                  <div className="card-body p-4">
                    <div className="row g-4">
                      {plans.map((plan, index) => (
                        <div key={index} className="col-12 col-md-6 col-lg-4">
                          <div className="card h-100 bg-secondary border-0 position-relative">
                            {plan.badge && (
                              <div className="position-absolute top-0 end-0 m-3">
                                <span className="badge bg-warning text-dark px-3 py-2 rounded-pill">
                                  {plan.badge}
                                </span>
                              </div>
                            )}
                            
                            <div className="card-body p-4">
                              {/* Plan Image */}
                              <div 
                                className="rounded-3 mb-4"
                                style={{
                                  height: '120px',
                                  background: plan.image,
                                  backgroundSize: 'cover',
                                  backgroundPosition: 'center'
                                }}
                              ></div>
                              
                              {/* Plan Details */}
                              <h5 className="text-white mb-2">{plan.name}</h5>
                              <p className="text-muted mb-4">{plan.price}</p>
                              
                              {/* Features */}
                              <ul className="list-unstyled">
                                {plan.features.map((feature, featureIndex) => (
                                  <li key={featureIndex} className="d-flex align-items-start mb-3">
                                    <Check size={16} className="text-success me-2 mt-1 flex-shrink-0" />
                                    <span className="text-light small">{feature}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            
                            <div className="card-footer bg-transparent border-0 p-4 pt-0">
                              <button 
                                className={`btn ${plan.buttonClass} w-100`}
                                disabled={plan.disabled}
                              >
                                {plan.buttonText}
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Toggle (hidden by default, would need JavaScript to show/hide) */}
      <div className="d-lg-none position-fixed top-0 start-0 p-3" style={{ zIndex: 1050 }}>
        <button className="btn btn-outline-light">
          <Settings size={20} />
        </button>
      </div>

      {/* Bootstrap CSS */}
      <style jsx>{`
        .nav-tabs .nav-link.active {
          background-color: transparent !important;
          border-bottom: 2px solid #0d6efd !important;
          border-top: none !important;
          border-left: none !important;
          border-right: none !important;
        }
        
        .nav-tabs {
          border-bottom: 1px solid #333 !important;
        }
        
        .sidebar {
          background: linear-gradient(180deg, #2a2a2a 0%, #1a1a1a 100%);
        }
        
        @media (max-width: 991.98px) {
          .flex-grow-1 {
            margin-left: 0 !important;
          }
        }
        
        .btn-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
        }
        
        .btn-success {
          background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
          border: none;
        }
        
        .card {
          transition: transform 0.2s ease-in-out;
        }
        
        .card:hover {
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
};

export default ProfileUpgrade;