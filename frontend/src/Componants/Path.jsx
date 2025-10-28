import React, { useEffect, useState } from 'react';
import Nav from './Nav';
import { useGeneratedSkills } from '../context/GeneratedSkillsContext';
import { skillsService } from '../services/api';

const Path = () => {
  const { generatedSkills, extractedSkills } = useGeneratedSkills();
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(false);
  const [roadmapMap, setRoadmapMap] = useState({});
  const [loadingSkill, setLoadingSkill] = useState(null);
  const [openLevels, setOpenLevels] = useState({});
  const [showPaid, setShowPaid] = useState(false);

  // Batch roadmap fetch is heavy; we don't auto-run it. Leave roadmap null and fetch on demand (per-skill below).

  // only show generated skills on this page (per your request)
  const skillsToShow = (generatedSkills || []);

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

  const exportAsTxt = (skillName, roadmapObj) => {
    const lines = [];
    lines.push(`Roadmap for: ${skillName}\n`);
    try {
      if (roadmapObj.prerequisites) {
        lines.push('Prerequisites:');
        lines.push(Array.isArray(roadmapObj.prerequisites) ? roadmapObj.prerequisites.join(', ') : String(roadmapObj.prerequisites));
        lines.push('\n');
      }
      if (roadmapObj.learning_path || roadmapObj.levels) {
        lines.push('Learning Path:');
        const stages = roadmapObj.learning_path || roadmapObj.levels || [];
        stages.forEach((s, i) => {
          const title = s.title || s.level || `Stage ${i+1}`;
          lines.push(`${i+1}. ${title}`);
          if (s.description) lines.push(`   ${s.description}`);
          if (s.timeframe) lines.push(`   Estimated time: ${s.timeframe}`);
          if (s.projects && s.projects.length) lines.push(`   Projects: ${s.projects.join('; ')}`);
        });
        lines.push('\n');
      }
      if (roadmapObj.estimated_timeline) {
        lines.push(`Estimated timeline: ${roadmapObj.estimated_timeline}`);
      }
    } catch (e) {
      lines.push(JSON.stringify(roadmapObj, null, 2));
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

  return (
    <div className='min-h-[calc(100vh-80px)] p-8 pt-20'>
      <Nav type="main" />
      <div className='p-8'>
        <h2 className='text-white text-2xl mb-4'>Learning Path</h2>
        <div className='space-y-6'>
          <div className='flex items-center justify-between'>
            <div />
            <div className='flex items-center gap-3'>
              <label className='text-white/80 text-sm flex items-center gap-2'>
                <input type='checkbox' checked={showPaid} onChange={e => setShowPaid(e.target.checked)} className='accent-[#0089ED]' />
                Include paid course suggestions
              </label>
            </div>
          </div>

          {skillsToShow.map((skill, idx) => {
            const data = roadmapMap[skill];
            const isLoading = loadingSkill === skill;
            const levels = data && (data.levels || data.learning_path) || [];
            const prereqs = data && (data.prerequisites || data.prereq) || [];
            const openForSkill = openLevels[skill] || {};

            const toggleLevel = (skillName, levelIdx) => {
              setOpenLevels(prev => ({
                ...prev,
                [skillName]: { ...(prev[skillName] || {}), [levelIdx]: !(prev[skillName] || {})[levelIdx] }
              }));
            };

            const paidSuggestionsFor = (projTitle) => {
              // Simple placeholder suggestions — link text only. In future, this could call a paid-courses API.
              const base = projTitle ? projTitle.split(':')[0] : skill;
              return [
                `Coursera: ${base} - specialization`,
                `Udemy: ${base} - hands-on`,
                `Pluralsight: ${base} - path`
              ];
            };

            return (
              <div key={idx} className='bg-black/20 border border-[#0089ED]/10 rounded-lg p-4'>
                <div className='flex items-center justify-between'>
                  <h3 className='text-white text-lg mb-2'>{skill}</h3>
                  <div className='flex items-center gap-3'>
                    <button onClick={() => generateForSkill(skill)} disabled={isLoading} className='py-1 px-3 bg-[#0089ED] rounded text-white text-sm'>
                      {isLoading ? 'Generating...' : 'Generate Roadmap'}
                    </button>
                    {data && (
                      <button onClick={() => exportAsTxt(skill, data)} className='py-1 px-3 bg-[#00C853] rounded text-white text-sm'>Export</button>
                    )}
                  </div>
                </div>

                {isLoading && <div className='text-white/70'>Generating roadmap...</div>}

                {!isLoading && data && (
                  <div className='mt-3'>
                    {prereqs && prereqs.length > 0 ? (
                      <div className='text-sm text-white/70 mb-4'><strong>Prerequisites:</strong> {prereqs.join(', ')}</div>
                    ) : null}

                    {levels && levels.length > 0 ? (
                      <div className='space-y-3'>
                        {levels.map((lvl, i) => {
                          const lvlTitle = lvl.level || lvl.title || `Stage ${i+1}`;
                          const isOpen = openForSkill[i];
                          const projects = lvl.projects || lvl.project_ideas || lvl.projects_list || [];

                          return (
                            <div key={i} className='bg-black/10 rounded'>
                              <button onClick={() => toggleLevel(skill, i)} className='w-full text-left p-3 flex items-center justify-between'>
                                <div>
                                  <div className='text-white/90 font-semibold'>{lvlTitle}</div>
                                  {lvl.timeframe && <div className='text-white/70 text-sm'>{lvl.timeframe}</div>}
                                </div>
                                <div className='text-white/70'>{isOpen ? '▾' : '▸'}</div>
                              </button>
                              {isOpen && (
                                <div className='p-3 border-t border-white/5'>
                                  {lvl.description && <div className='text-sm text-white/70 mb-2'>{lvl.description}</div>}

                                  {projects && projects.length > 0 ? (
                                    <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                                      {projects.map((proj, j) => {
                                        const title = typeof proj === 'string' ? proj : (proj.title || proj.name || `Project ${j+1}`);
                                        const desc = typeof proj === 'string' ? '' : (proj.description || proj.desc || '');
                                        const resources = typeof proj === 'string' ? [] : (proj.resources || proj.links || []);

                                        return (
                                          <div key={j} className='bg-black/20 border border-[#666]/10 rounded-lg p-3'>
                                            <div className='text-white font-medium mb-1'>{title}</div>
                                            {desc && <div className='text-sm text-white/70 mb-2'>{desc}</div>}
                                            {resources && resources.length > 0 ? (
                                              <div className='text-sm text-white/70 mb-2'>Free resources:
                                                <ul className='list-disc list-inside ml-4'>
                                                  {resources.map((r, k) => <li key={k}><a className='text-[#0089ED]' href={r} target='_blank' rel='noreferrer'>{r}</a></li>)}
                                                </ul>
                                              </div>
                                            ) : (
                                              <div className='text-sm text-white/70 mb-2'>Free resources: Suggested (search YouTube / free docs)</div>
                                            )}

                                            {showPaid ? (
                                              <div className='text-sm text-white/80 mt-2'>
                                                <strong>Paid course suggestions:</strong>
                                                <ul className='list-disc list-inside ml-4'>
                                                  {paidSuggestionsFor(title).map((ps, pk) => <li key={pk} className='text-[#FFB74D]'>{ps}</li>)}
                                                </ul>
                                              </div>
                                            ) : (
                                              <div className='text-sm text-white/70 mt-2'>Prefer paid course recommendations? Toggle "Include paid course suggestions" above.</div>
                                            )}
                                          </div>
                                        );
                                      })}
                                    </div>
                                  ) : (
                                    <div className='text-sm text-white/70'>No projects listed for this stage.</div>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className='text-sm text-white/80'>No staged learning path provided. You can still generate the roadmap for this skill.</div>
                    )}
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
