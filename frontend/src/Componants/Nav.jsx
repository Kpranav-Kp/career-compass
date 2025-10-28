import React from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../services/api';

const Nav = ({ type = 'landing' }) => {
  const handleContribute = () => {
    window.open('https://github.com/Kpranav-Kp/career-compass', '_blank');
  };

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className='w-full bg-black/50 backdrop-blur-sm fixed top-0 z-50'>
      <div className='max-w-7xl mx-auto w-full flex items-center p-4 justify-between'>
        {type === 'landing' ? (
          <Link to="/" className='text-2xl font-semibold text-white hover:text-[#0089ED]'>CareerCompass</Link>
        ) : (
          <div className='text-2xl font-semibold text-white'>CareerCompass</div>
        )}
        <div className='flex gap-6'>
        {type === 'landing' ? (
          <>
            <button onClick={() => scrollToSection('about-me')} className='text-white hover:text-[#0089ED]'>About</button>
            <button onClick={handleContribute} className='text-white hover:text-[#0089ED]'>Contribute</button>
          </>
        ) : (
          <>
            <Link to="/skills" className='text-white hover:text-[#0089ED]'>Skills</Link>
            <Link to="/path" className='text-white hover:text-[#0089ED]'>Path</Link>
            <Link to="/jobs" className='text-white hover:text-[#0089ED]'>Jobs</Link>
            <button onClick={() => authService.logout()} className='text-white hover:text-[#0089ED]'>Logout</button>
          </>
        )}
        </div>
      </div>
    </div>
  )
}

export default Nav