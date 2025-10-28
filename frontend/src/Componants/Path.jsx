import React, { useEffect, useState } from 'react';
import Nav from './Nav';
import { useGeneratedSkills } from '../context/GeneratedSkillsContext';
import { skillsService } from '../services/api';

const Path = () => {
  const { generatedSkills, extractedSkills } = useGeneratedSkills();
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState('');
  const [singleRoadmap, setSingleRoadmap] = useState(null);
  const [singleLoading, setSingleLoading] = useState(false);

  // Batch roadmap fetch is heavy; we don't auto-run it. Leave roadmap null and fetch on demand (per-skill below).

  // combined skills: prefer generated (recommended) then extracted
  const combinedSkills = Array.from(new Set([...(generatedSkills || []), ...(extractedSkills || [])]));

  if (!combinedSkills || combinedSkills.length === 0) {
    return (
      <div className='min-h-[calc(100vh-80px)] p-8 pt-20'>
        <Nav type="main" />
        <div className='p-8 text-white'>No generated skills available. Generate skills first from the Skills page.</div>
      </div>
    );
  }
  const generateForSkill = async (skill) => {
    if (!skill) return;
    setSingleLoading(true);
    try {
      const res = await skillsService.getSkillRoadmap(skill.toLowerCase());
      setSingleRoadmap(res || null);
    } catch (e) {
      console.error('Failed to generate roadmap for skill', e);
      setSingleRoadmap(null);
    } finally {
      setSingleLoading(false);
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
        <div className='mb-6'>
          <label className='text-white mb-2 block'>Pick a skill to generate roadmap for</label>
          <div className='flex gap-3'>
            <select value={selectedSkill} onChange={e => setSelectedSkill(e.target.value)} className='p-3 rounded bg-black/50 text-white border border-[#4285F4]'>
              <option value=''>-- select a skill --</option>
              {combinedSkills.map((s, i) => <option key={i} value={s}>{s}</option>)}
            </select>
            <button onClick={() => generateForSkill(selectedSkill)} disabled={!selectedSkill || singleLoading} className='py-2 px-4 bg-[#0089ED] rounded text-white'>
              {singleLoading ? 'Generating...' : 'Generate Roadmap'}
            </button>
            {singleRoadmap && !singleLoading && (
              <button onClick={() => exportAsTxt(selectedSkill, singleRoadmap)} className='py-2 px-4 bg-[#00C853] rounded text-white'>Export as .txt</button>
            )}
          </div>
        </div>

        {singleLoading && <p className='text-white'>Generating roadmap for {selectedSkill}...</p>}
        {singleRoadmap && (
          <div className='space-y-6'>
            <div className='bg-black/20 border border-[#0089ED]/10 rounded-lg p-4'>
              <h3 className='text-white text-lg mb-2'>{selectedSkill}</h3>
              <pre className='text-sm text-white/80 whitespace-pre-wrap'>{JSON.stringify(singleRoadmap, null, 2)}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Path;
