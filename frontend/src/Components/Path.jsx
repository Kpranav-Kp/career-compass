import React, { useEffect, useState } from 'react';
import Nav from './Nav';
import { useGeneratedSkills } from '../context/GeneratedSkillsContext';
import { skillsService } from '../services/api';

const Path = () => {
  const { generatedSkills, extractedSkills } = useGeneratedSkills();
  const [roadmapMap, setRoadmapMap] = useState({});
  const [loadingSkill, setLoadingSkill] = useState(null);
  const [openLevels, setOpenLevels] = useState({});
  const [showPaid, setShowPaid] = useState(false);
  const [sessionKey, setSessionKey] = useState(null);

  useEffect(() => {
    const key = sessionStorage.getItem('roadmapSessionKey');
    if (key) {
      setSessionKey(key);
      const cached = sessionStorage.getItem('roadmapData');
      if (cached) {
        try {
          setRoadmapMap(JSON.parse(cached));
        } catch (e) {
          console.error('Failed to parse cached roadmap data', e);
        }
      }
    } else {
      const newKey = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('roadmapSessionKey', newKey);
      setSessionKey(newKey);
    }
  }, []);

  useEffect(() => {
    if (sessionKey && Object.keys(roadmapMap).length > 0) {
      sessionStorage.setItem('roadmapData', JSON.stringify(roadmapMap));
    }
  }, [roadmapMap, sessionKey]);

  useEffect(() => {
    if (!sessionKey || !generatedSkills || generatedSkills.length === 0) return;
    const cachedSkills = sessionStorage.getItem('cachedSkills');
    const currentSkills = JSON.stringify(generatedSkills);
    if (cachedSkills && cachedSkills !== currentSkills) {
      const newKey = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('roadmapSessionKey', newKey);
      sessionStorage.removeItem('roadmapData');
      sessionStorage.setItem('cachedSkills', currentSkills);
      setSessionKey(newKey);
      setRoadmapMap({});
      setOpenLevels({});
    } else if (!cachedSkills) {
      sessionStorage.setItem('cachedSkills', currentSkills);
    }
  }, [generatedSkills, sessionKey]);

  const skillsToShow = generatedSkills || [];

  if (!skillsToShow || skillsToShow.length === 0) {
    return (
      <div className='min-h-[calc(100vh-80px)] p-8 pt-20'>
        <Nav type="main" />
        <div className='p-8 text-white'>No generated skills available. Generate skills first from the Skills page.</div>
      </div>
    );
  }

  const generateForSkill = async (skill) => {
    if (!skill) return;
    if (roadmapMap[skill]) {
      console.log('Roadmap already exists for', skill);
      return;
    }
    if (loadingSkill === skill) return;

    setLoadingSkill(skill);
    try {
      const res = await skillsService.getSkillRoadmap(skill.toLowerCase());
      setRoadmapMap(prev => ({ ...prev, [skill]: res || null }));
    } catch (e) {
      console.error('Failed to generate roadmap for skill', e);
      setRoadmapMap(prev => ({ ...prev, [skill]: null }));
    } finally {
      setLoadingSkill(null);
    }
  };

  const exportAsTxt = (skillName, roadmapData) => {
    const lines = [`Roadmap for: ${skillName}\n`];
    try {
      if (roadmapData.market_relevance) {
        lines.push(`Market Relevance: ${roadmapData.market_relevance}\n`);
      }
      if (roadmapData.prerequisites?.length) {
        lines.push('Prerequisites:');
        roadmapData.prerequisites.forEach(p => lines.push(`  - ${p}`));
        lines.push('');
      }
      if (roadmapData.levels?.length) {
        lines.push('Learning Path:\n');
        roadmapData.levels.forEach((lvl, i) => {
          lines.push(`${i+1}. ${lvl.level || `Level ${i+1}`}`);
          if (lvl.description) lines.push(`   ${lvl.description}`);
          if (lvl.timeframe) lines.push(`   Timeframe: ${lvl.timeframe}`);
          if (lvl.projects?.length) {
            lines.push('   Projects:');
            lvl.projects.forEach(p => lines.push(`     - ${p}`));
          }
          if (lvl.resources?.length) {
            lines.push('   Resources:');
            lvl.resources.forEach(r => lines.push(`     - ${r}`));
          }
          lines.push('');
        });
      }
    } catch (e) {
      lines.push(JSON.stringify(roadmapData, null, 2));
    }

    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${skillName.replace(/\s+/g, '_')}_roadmap.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const toggleLevel = (skillName, levelIdx) => {
    setOpenLevels(prev => ({
      ...prev,
      [skillName]: { ...(prev[skillName] || {}), [levelIdx]: !(prev[skillName] || {})[levelIdx] }
    }));
  };

  return (
    <div className='min-h-[calc(100vh-80px)] p-8 pt-20'>
      <Nav type="main" />
      <div className='p-8'>
        <h2 className='text-white text-2xl mb-4'>Learning Path</h2>
        <div className='space-y-6'>
          <div className='flex items-center justify-end'>
            <label className='text-white/80 text-sm flex items-center gap-2'>
              <input type='checkbox' checked={showPaid} onChange={e => setShowPaid(e.target.checked)} className='accent-[#0089ED]' />
              Include paid course suggestions
            </label>
          </div>

          {skillsToShow.map((skill, idx) => {
            const data = roadmapMap[skill];
            const isLoading = loadingSkill === skill;
            const roadmapWrapper = data?.roadmap || {};
            const skillKey = Object.keys(roadmapWrapper).find(k => k.toLowerCase() === skill.toLowerCase());
            const roadmapData = skillKey ? roadmapWrapper[skillKey] : null;
            
            const levels = roadmapData?.levels || [];
            const prereqs = roadmapData?.prerequisites || [];
            const marketRelevance = roadmapData?.market_relevance || '';
            const openForSkill = openLevels[skill] || {};

            return (
              <div key={idx} className='bg-black/20 border border-[#0089ED]/10 rounded-lg p-4'>
                <div className='flex items-center justify-between mb-3'>
                  <h3 className='text-white text-lg'>{skill}</h3>
                  <div className='flex items-center gap-3'>
                    <button 
                      onClick={() => generateForSkill(skill)} 
                      disabled={isLoading || !!data} 
                      className='py-1 px-3 bg-[#0089ED] rounded text-white text-sm disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                      {isLoading ? 'Generating...' : data ? 'Generated' : 'Generate Roadmap'}
                    </button>
                    {data && roadmapData && (
                      <button onClick={() => exportAsTxt(skill, roadmapData)} className='py-1 px-3 bg-[#00C853] rounded text-white text-sm'>
                        Export
                      </button>
                    )}
                  </div>
                </div>

                {isLoading && <div className='text-white/70 py-2'>Generating roadmap...</div>}

                {!isLoading && data && roadmapData && (
                  <div className='mt-3 space-y-3'>
                    {marketRelevance && (
                      <div className='text-sm text-white/70 bg-blue-500/10 border border-blue-500/30 p-3 rounded'>
                        <strong className='text-white/90'>Market Relevance:</strong>
                        <div className='mt-1'>{marketRelevance}</div>
                      </div>
                    )}

                    {prereqs.length > 0 && (
                      <div className='text-sm text-white/70 bg-black/10 p-3 rounded'>
                        <strong className='text-white/90'>Prerequisites:</strong>
                        <ul className='list-disc list-inside ml-2 mt-1'>
                          {prereqs.map((prereq, i) => <li key={i}>{prereq}</li>)}
                        </ul>
                      </div>
                    )}

                    {levels.length > 0 ? (
                      <div className='space-y-2'>
                        {levels.map((lvl, i) => {
                          const lvlTitle = lvl.level || `Level ${i+1}`;
                          const isOpen = openForSkill[i];
                          const projects = lvl.projects || [];
                          const resources = lvl.resources || [];

                          return (
                            <div key={i} className='bg-black/10 rounded border border-white/5'>
                              <button 
                                onClick={() => toggleLevel(skill, i)} 
                                className='w-full text-left p-4 flex items-center justify-between hover:bg-black/20 transition-colors'
                              >
                                <div className='flex-1'>
                                  <div className='text-white/90 font-semibold text-base'>{lvlTitle}</div>
                                  {lvl.timeframe && (
                                    <div className='text-white/60 text-sm mt-1'>⏱️ {lvl.timeframe}</div>
                                  )}
                                </div>
                                <div className='text-white/70 text-xl'>{isOpen ? '▾' : '▸'}</div>
                              </button>
                              
                              {isOpen && (
                                <div className='p-4 border-t border-white/5'>
                                  {lvl.description && (
                                    <div className='text-sm text-white/70 mb-4 leading-relaxed'>
                                      {lvl.description}
                                    </div>
                                  )}

                                  {projects.length > 0 && (
                                    <div className='mb-4'>
                                      <h4 className='text-white/90 font-semibold mb-2'>Projects:</h4>
                                      <ul className='list-disc list-inside ml-2 space-y-1'>
                                        {projects.map((proj, j) => (
                                          <li key={j} className='text-sm text-white/70'>{proj}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}

                                  {resources.length > 0 && (
                                    <div className='mb-4'>
                                      <h4 className='text-white/90 font-semibold mb-2'>Free Resources:</h4>
                                      <ul className='list-disc list-inside ml-2 space-y-1'>
                                        {resources.map((res, k) => (
                                          <li key={k} className='text-sm text-[#0089ED]'>{res}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}

                                  {showPaid && (
                                    <div className='pt-3 border-t border-white/10'>
                                      <h4 className='text-[#FFB74D] font-semibold mb-2'>Paid Course Suggestions:</h4>
                                      <ul className='list-disc list-inside ml-2 space-y-1'>
                                        <li className='text-sm text-white/70'>Coursera: {skill} specialization</li>
                                        <li className='text-sm text-white/70'>Udemy: {skill} hands-on course</li>
                                        <li className='text-sm text-white/70'>Pluralsight: {skill} learning path</li>
                                      </ul>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className='text-sm text-white/70 bg-black/10 p-4 rounded'>
                        No structured learning path available.
                      </div>
                    )}
                  </div>
                )}

                {!isLoading && !data && (
                  <div className='text-sm text-white/60 py-2'>
                    Click "Generate Roadmap" to create a personalized learning path for this skill.
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Path;