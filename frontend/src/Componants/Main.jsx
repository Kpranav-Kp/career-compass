import React, { useState } from 'react';
import Nav from './Nav';
import { skillsService } from '../services/api';

const Main = () => {
  const [role, setRole] = useState('');
  const [file, setFile] = useState(null);
  const [skills, setSkills] = useState([]);
  const [recommendedSkills, setRecommendedSkills] = useState([]);
  const [details, setDetails] = useState({}); // { skill: {roadmap, projects, market} }
  const [isLoading, setIsLoading] = useState(false);
  const [isRecLoading, setIsRecLoading] = useState(false);
  const [extractionIssue, setExtractionIssue] = useState(null);
  const [roadmapAggregate, setRoadmapAggregate] = useState(null);
  const [marketAggregate, setMarketAggregate] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const data = await skillsService.extractSkills(file, role);
      console.log('extractSkills response:', data);
        setExtractionIssue(data && data.extraction_issue ? data.extraction_issue : null);
      if (data && data.extracted_skills) {
        setSkills(data.extracted_skills);
      } else if (data && data.recommended_skills) {
        // If API returns only recommended_skills, show that too
        setSkills(data.recommended_skills);
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

  const handleRecommend = async () => {
    if (!skills || skills.length === 0) return;
    setIsRecLoading(true);
    try {
      const res = await skillsService.recommendSkills(skills, role);
      if (res && res.recommended_skills) {
        setRecommendedSkills(res.recommended_skills);
      } else {
        setRecommendedSkills([]);
      }
    } catch (e) {
      console.error('Recommend skills failed', e);
      setRecommendedSkills([]);
    } finally {
      setIsRecLoading(false);
    }
  };

  const fetchDetails = async (skill) => {
    // avoid refetch
    if (details[skill]) return;
    try {
      const roadmap = await skillsService.getSkillRoadmap(skill);
      const projects = await skillsService.getSkillProjects ? await skillsService.getSkillProjects(skill) : null;
      const market = await skillsService.getMarketAnalysis(skill);
      setDetails(prev => ({ ...prev, [skill]: { roadmap, projects, market } }));
    } catch (e) {
      console.error('Failed to fetch details', e);
    }
  };

  const fetchAggregateRoadmap = async () => {
    if (!skills || skills.length === 0) return;
    try {
      const normalized = skills.map(s => String(s).toLowerCase());
      const res = await skillsService.getRoadmapForSkills(normalized);
      setRoadmapAggregate(res);
    } catch (e) {
      console.error('Failed to fetch aggregate roadmap', e);
      setRoadmapAggregate(null);
    }
  };

  const fetchAggregateMarket = async () => {
    if (!skills || skills.length === 0) return;
    try {
      const normalized = skills.map(s => String(s).toLowerCase());
      const res = await skillsService.getMarketForSkills(normalized);
      setMarketAggregate(res);
    } catch (e) {
      console.error('Failed to fetch aggregate market', e);
      setMarketAggregate(null);
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
                {extractionIssue === 'bad_read' && (
                  <p>We couldn't read your resume. Try uploading a different PDF or ensure the file isn't a scanned image.</p>
                )}
                {extractionIssue === 'input_too_long' && (
                  <p>Your resume appears very large. Try trimming long sections or uploading a shorter version.</p>
                )}
                {extractionIssue === 'model_failed_to_extract' && (
                  <p>Resume parsed but the model couldn't extract skills. Try re-uploading or try again later.</p>
                )}
                {extractionIssue === 'no_skills_found' && (
                  <p>No skills were detected in your resume. Consider adding a short skills summary to your resume.</p>
                )}
                {!extractionIssue && (
                  <p>Submit your resume to see extracted skills</p>
                )}
              </div>
            ) : (
              <>
                <div className='flex items-center gap-4 mb-4'>
                  <button
                    className='py-2 px-4 bg-[#00C853] rounded-lg text-white'
                    onClick={handleRecommend}
                    disabled={isRecLoading}
                  >
                    {isRecLoading ? 'Recommending...' : 'Recommend Skills'}
                  </button>
                  <button
                    className='py-2 px-4 bg-[#4285F4] rounded-lg text-white'
                    onClick={fetchAggregateRoadmap}
                    disabled={isLoading || skills.length === 0}
                  >
                    View Roadmap
                  </button>
                  <button
                    className='py-2 px-4 bg-[#FF9800] rounded-lg text-white'
                    onClick={fetchAggregateMarket}
                    disabled={isLoading || skills.length === 0}
                  >
                    View Market Insights
                  </button>
                </div>
                <div className='grid grid-cols-2 gap-4'>
                  {skills.map((skill, index) => (
                    <div
                      key={index}
                      className='bg-black/30 border border-[#0089ED]/20 rounded-xl p-4'
                    >
                      <div className='flex justify-between items-start'>
                        <p className='text-white font-medium'>{skill}</p>
                        <div className='flex gap-2'>
                          <button className='text-sm px-2 py-1 bg-[#4285F4] rounded' onClick={() => fetchDetails(skill)}>Details</button>
                        </div>
                      </div>
                      {details[skill] && (
                        <div className='mt-3 text-sm text-white/90'>
                          <pre className='whitespace-pre-wrap'>{JSON.stringify(details[skill], null, 2)}</pre>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
            {recommendedSkills.length > 0 && (
              <div className='mt-6'>
                <h3 className='text-white mb-2'>Recommended Skills</h3>
                <div className='grid grid-cols-2 gap-4'>
                  {recommendedSkills.map((r, i) => (
                    <div key={i} className='bg-black/20 border border-[#00C853]/30 rounded-xl p-3 text-white'>
                      {r}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {roadmapAggregate && (
              <div className='mt-6'>
                <h3 className='text-white mb-2'>Aggregate Roadmap</h3>
                <div className='text-sm text-white/90'><pre className='whitespace-pre-wrap'>{JSON.stringify(roadmapAggregate, null, 2)}</pre></div>
              </div>
            )}
            {marketAggregate && (
              <div className='mt-6'>
                <h3 className='text-white mb-2'>Market Insights</h3>
                <div className='text-sm text-white/90'><pre className='whitespace-pre-wrap'>{JSON.stringify(marketAggregate, null, 2)}</pre></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;