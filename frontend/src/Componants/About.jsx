import React from 'react';
import Nav from './Nav';

const About = () => {
  return (
    <div className='min-h-screen bg-gradient-to-br from-black to-gray-900'>
      <Nav type="landing" />
      <div className='w-full min-h-[calc(100vh-80px)] p-8'>
        <div className='max-w-4xl mx-auto bg-black/40 backdrop-blur-sm border border-[#0089ED] rounded-3xl p-8'>
          <h2 className='text-3xl font-bold text-white mb-6'>About Me</h2>
          <div className='space-y-6 text-white/90'>
            <p>
              Hello! I'm passionate about helping students and professionals navigate their career paths effectively.
              With CareerCompass, I aim to bridge the gap between education and industry requirements.
            </p>
            <div className='bg-black/30 rounded-xl p-6 border border-[#0089ED]/20'>
              <h3 className='text-xl font-semibold text-[#0089ED] mb-3'>My Vision</h3>
              <p>
                To create a platform that empowers individuals to make informed career decisions through
                data-driven insights and personalized guidance.
              </p>
            </div>
            <div className='bg-black/30 rounded-xl p-6 border border-[#0089ED]/20'>
              <h3 className='text-xl font-semibold text-[#0089ED] mb-3'>Background</h3>
              <p>
                With experience in software development and a deep understanding of the tech industry's demands,
                I've created CareerCompass to help others succeed in their professional journeys.
              </p>
            </div>
            {/* Add more sections as needed */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;