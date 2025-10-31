import React from 'react';
import { Link } from 'react-router-dom';
import Nav from './Nav';

const Lander = () => {
  const handleContribute = () => {
    window.open('https://github.com/Kpranav-Kp/career-compass', '_blank');
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-black to-gray-900'>
      <Nav type="landing" />
      
      {/* Hero Section with Get Started Card */}
      <section className='min-h-screen flex items-center justify-center p-8'>
        <div className='w-[90%] max-w-7xl flex flex-col lg:flex-row items-center justify-between gap-12'>
          <div className='lg:w-1/2 flex flex-col justify-center gap-8'>
            <h1 className='text-5xl font-bold text-white leading-tight'>
              Navigate Your Career Journey with Confidence
            </h1>
            <p className='text-lg text-white/90'>
              As an undergraduate, choosing and preparing for a career path can be overwhelming. 
              CareerCompass is here to guide you through this journey with smart, data-driven insights.
            </p>
          </div>
          <div className='lg:w-1/2 flex items-center justify-center'>
            <div className='w-full max-w-md p-8 rounded-3xl bg-black/40 backdrop-blur-sm border border-[#0089ED] text-white'>
              <h3 className='text-2xl font-semibold mb-3'>Begin Your Career Journey</h3>
              <p className='text-sm text-white/80 mb-6'>Create an account to unlock personalized career guidance and start building your professional future.</p>
              <div className='flex gap-3'>
                <Link to="/login" className='w-1/2 py-3 rounded-xl bg-transparent border border-[#4285F4] text-white text-center hover:bg-[#4285F4]/10'>Login</Link>
                <Link to="/register" className='w-1/2 py-3 rounded-xl bg-[#0089ED] text-white text-center hover:bg-[#0089ED]/90'>Register</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What is CareerCompass Section */}
      <section className='min-h-screen bg-black/30 py-20 px-8' id="about">
        <div className='max-w-7xl mx-auto'>
          <h2 className='text-4xl font-bold text-white mb-12'>What is CareerCompass?</h2>
          <div className='text-lg text-white/90 space-y-6'>
            <p>
              CareerCompass is your personal career navigation system, designed specifically for undergraduate students 
              who are looking to bridge the gap between academic knowledge and industry requirements.
            </p>
            <p>
              We understand that stepping into the professional world can be daunting. That's why we've created 
              a platform that not only helps you identify your career path but also guides you through every step 
              of your professional development journey.
            </p>
          </div>
        </div>
      </section>

      {/* How It Helps Section */}
      <section className='min-h-screen py-20 px-8'>
        <div className='max-w-7xl mx-auto'>
          <h2 className='text-4xl font-bold text-white mb-12'>How CareerCompass Helps You</h2>
          
          {/* Industry Relevancy */}
          <div className='mb-16'>
            <h3 className='text-2xl font-semibold text-[#0089ED] mb-6'>Industry-Relevant Skills</h3>
            <div className='text-lg text-white/90 space-y-4'>
              <p>
                Stay ahead in the job market with our AI-powered skill analysis system. We help you:
              </p>
              <ul className='list-disc pl-6 space-y-2'>
                <li>Identify the most in-demand skills for your chosen career path</li>
                <li>Compare your current skillset with industry requirements</li>
                <li>Get personalized recommendations for skill development</li>
                <li>Track your progress and validate your expertise</li>
              </ul>
            </div>
          </div>

          {/* Career Roadmap */}
          <div className='mb-16'>
            <h3 className='text-2xl font-semibold text-[#0089ED] mb-6'>Personalized Career Roadmap</h3>
            <div className='text-lg text-white/90 space-y-4'>
              <p>
                Your journey to success needs a clear path. Our roadmap feature provides:
              </p>
              <ul className='list-disc pl-6 space-y-2'>
                <li>Customized learning paths based on your career goals</li>
                <li>Milestone tracking and progress visualization</li>
                <li>Resource recommendations for each stage</li>
                <li>Timeline estimates and goal setting tools</li>
              </ul>
            </div>
          </div>

          {/* Project Ideas */}
          <div className='mb-16'>
            <h3 className='text-2xl font-semibold text-[#0089ED] mb-6'>Smart Project Generator</h3>
            <div className='text-lg text-white/90 space-y-4'>
              <p>
                Build a compelling portfolio with our project ideas generator:
              </p>
              <ul className='list-disc pl-6 space-y-2'>
                <li>AI-generated project suggestions based on your skill level</li>
                <li>Industry-aligned project requirements</li>
                <li>Technical scope and implementation guidelines</li>
                <li>Portfolio integration recommendations</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* About Me Section */}
      <section className='min-h-screen bg-black/30 py-20 px-8' id="about-me">
        <div className='max-w-7xl mx-auto'>
          <h2 className='text-4xl font-bold text-white mb-12'>About Me</h2>
          <div className='text-lg text-white/90 space-y-6'>
            <p>
              Hello! I'm passionate about helping students and professionals navigate their career paths effectively.
              With CareerCompass, I aim to bridge the gap between education and industry requirements.
            </p>
            <div className='space-y-8 mt-8'>
              <div>
                <h3 className='text-2xl font-semibold text-[#0089ED] mb-4'>My Vision</h3>
                <p>
                  To create a platform that empowers individuals to make informed career decisions through
                  data-driven insights and personalized guidance.
                </p>
              </div>
              <div>
                <h3 className='text-2xl font-semibold text-[#0089ED] mb-4'>Background</h3>
                <p>
                  With experience in software development and a deep understanding of the tech industry's demands,
                  I've created CareerCompass to help others succeed in their professional journeys.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contribute Section */}
      <section className='min-h-[50vh] py-20 px-8'>
        <div className='max-w-7xl mx-auto text-center'>
          <h2 className='text-4xl font-bold text-white mb-8'>Contribute to CareerCompass</h2>
          <p className='text-lg text-white/90 mb-8 max-w-2xl mx-auto'>
            Want to help make CareerCompass even better? Join our open-source community and contribute to
            helping students worldwide navigate their career paths.
          </p>
          <button
            onClick={handleContribute}
            className='px-8 py-4 bg-[#0089ED] text-white rounded-xl font-semibold hover:bg-[#0089ED]/90 transition-colors'
          >
            Contribute on GitHub
          </button>
        </div>
      </section>
    </div>
  );
}

export default Lander
