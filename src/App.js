import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { UserProvider } from './contexts/UserContext';

import AppNavbar from './components/navigationBar';

import TestPage from './pages/testPage'
import Login from './pages/loginPage';
import HomePage from './pages/homePage';
import ProfilePage from './pages/profilePage';
import LandingPage from './pages/landingPage/landingPage';
import EventsPage from './pages/EventsPage/EventsPage';


function App() {
  return (
    <div className="App">
      <UserProvider>
        <Router>
          <AppNavbar />
          <Routes>
            <Route path="/" element={<LandingPage/>}></Route>
            <Route path="/login" element={<Login/>}></Route>
            <Route path="/home" element={<HomePage/>}></Route>
            <Route path="/profile/:userId" element={<ProfilePage />} />
            <Route path="/events" element={<EventsPage />} />

            <Route path="/test" element={<TestPage/>}></Route>
          </Routes>
        </Router>
      </UserProvider>
    </div>
  );
}

export default App;
