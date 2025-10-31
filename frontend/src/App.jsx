import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Lander from './Componants/Lander';
import Login from './Componants/Login';
import Signup from './Componants/Signup';
import Main from './Componants/Main';
import About from './Componants/About';
import Path from './Componants/Path';
import Jobs from './Componants/Jobs';
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