import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Lander from './Components/Lander';
import Login from './Components/Login';
import Signup from './Components/Signup';
import Main from './Components/Main';
import About from './Components/About';
import Path from './Components/Path';
import Jobs from './Components/Jobs';
import { useAuth } from './context/AuthContext';
import { GeneratedSkillsProvider } from './context/GeneratedSkillsContext';

const App = () => {
  const { user } = useAuth();
  const isAuthenticated = !!user;

  return (
    <Router>
      <GeneratedSkillsProvider>
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
            element={isAuthenticated ? <Path /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/jobs" 
            element={isAuthenticated ? <Jobs /> : <Navigate to="/login" />} 
          />
        </Routes>
      </div>
      </GeneratedSkillsProvider>
    </Router>
  )
}

export default App