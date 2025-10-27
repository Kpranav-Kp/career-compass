import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Lander from './Componants/Lander';
import Login from './Componants/Login';
import Signup from './Componants/Signup';
import Main from './Componants/Main';
import About from './Componants/About';

const App = () => {
  // lightweight auth check using token in localStorage
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <Router>
      <div className='min-h-screen w-full font-poppins bg-gradient-to-br from-black to-gray-900'>
        <Routes>
          <Route path="/" element={<Lander />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Signup />} />
          <Route path="/about" element={<About />} />
          
          {/* Protected Routes */}
          <Route 
            path="/main" 
            element={isAuthenticated ? <Main /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/skills" 
            element={isAuthenticated ? <Main /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/path" 
            element={isAuthenticated ? <div>Path Page Coming Soon</div> : <Navigate to="/login" />} 
          />
          <Route 
            path="/jobs" 
            element={isAuthenticated ? <div>Jobs Page Coming Soon</div> : <Navigate to="/login" />} 
          />
        </Routes>
      </div>
    </Router>
  )
}

export default App