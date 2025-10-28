import React, { useEffect, useState } from 'react';
import Nav from './Nav';
import { useGeneratedSkills } from '../context/GeneratedSkillsContext';
import { skillsService } from '../services/api';

const Path = () => {
  const { generatedSkills } = useGeneratedSkills();
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      if (!generatedSkills || generatedSkills.length === 0) return;
      setLoading(true);
      try {
        const res = await skillsService.getRoadmapForSkills(generatedSkills.map(s => String(s).toLowerCase()));
        setRoadmap(res);
      } catch (e) {
        console.error('Failed to load roadmap', e);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [generatedSkills]);

  if (!generatedSkills || generatedSkills.length === 0) {
    return (
      <div className='min-h-[calc(100vh-80px)] p-8 pt-20'>
        <Nav type="main" />
        <div className='p-8 text-white'>No generated skills available. Generate skills first from the Skills page.</div>
      </div>
    );
  }

  return (
    <div className='min-h-[calc(100vh-80px)] p-8 pt-20'>
      <Nav type="main" />
      <div className='p-8'>
        <h2 className='text-white text-2xl mb-4'>Learning Path</h2>
      {loading && <p className='text-white'>Loading...</p>}
      {!loading && roadmap && (
        <div className='space-y-6'>
          {(() => {
            const block = roadmap.roadmap || roadmap;
            if (!block || Object.keys(block).length === 0) {
              return <p className='text-white/70'>No roadmap details available for the generated skills.</p>;
            }

            return generatedSkills.map((skill, idx) => {
              const key = String(skill).toLowerCase();
              const data = block[key] || block[skill] || {};
              const levels = Array.isArray(data.levels) ? data.levels : (data.learning_path || []);
              const prerequisites = Array.isArray(data.prerequisites) ? data.prerequisites : (data.prereq || []);
              const estimate = data.estimated_timeline || data.time || data.estimate || '';
              const difficulty = data.difficulty_level || data.difficulty || '';

              return (
                <div key={idx} className='bg-black/20 border border-[#0089ED]/10 rounded-lg p-4'>
                  <div className='flex items-center justify-between'>
                    <h3 className='text-white text-lg mb-2'>{skill}</h3>
                    <div className='text-sm text-white/70'>{difficulty || estimate || ''}</div>
                  </div>

                  {prerequisites && prerequisites.length > 0 ? (
                    <div className='mb-2'>
                      <strong className='text-white/80'>Prerequisites:</strong>
                      <div className='text-sm text-white/70'>
                        {prerequisites.join(', ')}
                      </div>
                    </div>
                  ) : (
                    <div className='mb-2 text-sm text-white/70'>No explicit prerequisites provided.</div>
                  )}

                  {levels && levels.length > 0 ? (
                    <div className='grid gap-3'>
                      {levels.map((lvl, i) => (
                        <div key={i} className='bg-black/10 p-3 rounded'>
                          <div className='text-sm text-white/90'><strong>{lvl.level || lvl.title || `Stage ${i+1}`}</strong></div>
                          {lvl.description && <div className='text-sm text-white/70 mt-1'>{lvl.description}</div>}
                          {lvl.resources && lvl.resources.length > 0 && (
                            <div className='text-sm text-white/70 mt-2'>
                              <strong>Resources:</strong>
                              <ul className='list-disc list-inside'>
                                {lvl.resources.map((r, j) => <li key={j}>{r}</li>)}
                              </ul>
                            </div>
                          )}
                          {lvl.projects && lvl.projects.length > 0 && (
                            <div className='text-sm text-white/70 mt-2'>
                              <strong>Projects:</strong>
                              <ul className='list-disc list-inside'>
                                {lvl.projects.map((p, j) => <li key={j}>{p}</li>)}
                              </ul>
                            </div>
                          )}
                          {lvl.timeframe && <div className='text-sm text-white/70 mt-2'>Estimated time: {lvl.timeframe}</div>}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className='text-sm text-white/70'>No staged learning path provided.</div>
                  )}
                </div>
              );
            });
          })()}
        </div>
      )}
      </div>
    </div>
  );
};

export default Path;
