import React, { useState } from 'react';
import Nav from './Nav';
import { skillsService } from '../services/api';

const Main = () => {
  const [role, setRole] = useState('');
  const [file, setFile] = useState(null);
  const [skills, setSkills] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const data = await skillsService.extractSkills(file, role);
      if (data && data.extracted_skills) {
        setSkills(data.extracted_skills);
      } else if (data && data.data && data.data.extracted_skills) {
        // fallback if API nested differently
        setSkills(data.data.extracted_skills);
      } else {
        setSkills([]);
      }
    } catch (err) {
      console.error('Error extracting skills', err);
      setSkills([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-black to-gray-900'>
      <Nav type="main" />
      <div className='w-full min-h-[calc(100vh-80px)] p-8'>
        <div className='max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Input Card */}
          <div className='bg-black/40 backdrop-blur-sm border border-[#0089ED] rounded-3xl p-8'>
            <h2 className='text-2xl font-semibold text-white mb-6'>Extract Your Skills</h2>
            <form onSubmit={handleSubmit} className='space-y-6'>
              <div className='space-y-2'>
                <label htmlFor="role" className='text-white'>Desired Role</label>
                <input
                  type="text"
                  id="role"
                  className='w-full p-3 rounded-xl border border-[#4285F4] bg-black/50 text-white placeholder-gray-400'
                  placeholder='e.g. Frontend Developer'
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                />
              </div>
              <div className='space-y-2'>
                <label htmlFor="resume" className='text-white'>Upload Resume</label>
                <input
                  type="file"
                  id="resume"
                  className='w-full p-3 rounded-xl border border-[#4285F4] bg-black/50 text-white file:bg-[#0089ED] file:border-0 file:rounded-lg file:px-4 file:py-2 file:text-white file:mr-4 file:cursor-pointer'
                  onChange={(e) => setFile(e.target.files[0])}
                  accept=".pdf,.doc,.docx"
                />
              </div>
              <button
                type="submit"
                className='w-full py-3 rounded-xl bg-[#0089ED] text-white font-semibold hover:bg-[#0089ED]/90 disabled:opacity-50'
                disabled={isLoading || !role || !file}
              >
                {isLoading ? 'Analyzing...' : 'Extract Skills'}
              </button>
            </form>
          </div>

          {/* Skills Card */}
          <div className='bg-black/40 backdrop-blur-sm border border-[#0089ED] rounded-3xl p-8'>
            <h2 className='text-2xl font-semibold text-white mb-6'>Your Skills</h2>
            {skills.length === 0 ? (
              <div className='text-center text-white/60 py-12'>
                <p>Submit your resume to see extracted skills</p>
              </div>
            ) : (
              <div className='grid grid-cols-2 gap-4'>
                {skills.map((skill, index) => (
                  <div
                    key={index}
                    className='bg-black/30 border border-[#0089ED]/20 rounded-xl p-4'
                  >
                    <p className='text-white'>{skill}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;