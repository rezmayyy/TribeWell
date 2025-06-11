import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { UserProvider } from './contexts/UserContext';

import AppNavbar from './components/navigationBar';

import TestPage from './pages/testPage'
import Login from './pages/loginPage';
import HomePage from './pages/homePage';
import ProfilePage from './pages/profilePage';


function App() {
  return (
    <div className="App">
      <UserProvider>
        <Router>
          <AppNavbar />
          <Routes>
            <Route path="/test" element={<TestPage/>}></Route>
            <Route path="/login" element={<Login/>}></Route>
            <Route path="/home" element={<HomePage/>}></Route>
            <Route path="/profile/:userId" element={<ProfilePage />} />
          </Routes>
        </Router>
      </UserProvider>
    </div>
  );
}

export default App;
