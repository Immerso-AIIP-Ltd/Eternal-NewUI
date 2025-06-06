// src/App.js
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route,} from 'react-router-dom';
import Main from './Main';
import Onboards from './Onboards';
import Onboard2 from './Onboarding2'
import OnboardMain from './OnboardMain';
import ChatInterface from './ChatInterface';
import ProfileSetting from './ProfileSetting';
import ProfilePrefernce from './ProfilePreference';
import ProfileUpgrade from './ProfileUpgrade';
import SpiritualJourney from './SpiritualJourney';
import LoginPage from './LoginPage';
import ChatHome from './ChatHome';
import OnboardHomes from './OnboardHome';
import SignupPage from './SignupPage';
import ReportPage from './ReportPage';
function App() {
  return (
  
        <Router>
          <div className="app overflow-fix">
      
              <Routes>
                <Route path="/" element={<Main />} />
                <Route path='/onboard' element={<Onboards />}/>
                <Route path='/onboard2' element={<Onboard2 />}/>
                <Route path='/onboard-main' element={<OnboardMain />}/>
                <Route path='/chat' element={<ChatInterface />}/>
                <Route path='/profile'element={<ProfileSetting />}/>
                {/* <Route path='/preference' element={<ProfilePrefernce />}/> */}
                <Route path="/preferences" element={<ProfileSetting />} />
                {/* <Route path='/price' element={<ProfileUpgrade />}/> */}
                <Route path="/price" element={<ProfileSetting />} />
                <Route path='/journey' element={<SpiritualJourney /> }/>
                <Route path='/login' element={<LoginPage />}/>
                <Route path='/home' element={<ChatHome />}/>
                <Route path='/onhome'element={<OnboardHomes />}/>
                <Route path='/signup'element={<SignupPage />}/>
                <Route path='/report' element={<ReportPage />}/>
                
               
              
              </Routes>
          
          </div>
        </Router>
  
  );
}

export default App;