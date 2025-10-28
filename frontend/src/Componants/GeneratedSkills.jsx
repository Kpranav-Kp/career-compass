import React, { useEffect, useRef } from 'react';
import { useGeneratedSkills } from '../context/GeneratedSkillsContext';
import { useNavigate } from 'react-router-dom';

const GeneratedSkills = ({ onScrollIntoView }) => {
  const { generatedSkills, extractedSkills } = useGeneratedSkills();
  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Scroll into view when either extracted or generated skills are present
    const hasAny = (generatedSkills && generatedSkills.length) || (extractedSkills && extractedSkills.length);
    if (hasAny && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [generatedSkills, extractedSkills]);

  const hasGenerated = generatedSkills && generatedSkills.length;
  const hasExtracted = extractedSkills && extractedSkills.length;
  if (!hasGenerated && !hasExtracted) return null;

  return (
    <div ref={ref} className='mt-8 bg-black/30 border border-[#0089ED]/20 rounded-3xl p-6'>
      <h3 className='text-white text-xl mb-3'>Skills</h3>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div>
          <h4 className='text-white/90 mb-2'>Extracted</h4>
          {hasExtracted ? (
            <div className='grid grid-cols-2 gap-3'>
              {extractedSkills.map((g, i) => (
                <div key={`ext-${i}`} className='bg-black/20 border border-[#666]/20 rounded-xl p-3 text-white'>
                  {g}
                </div>
              ))}
            </div>
          ) : (
            <div className='text-white/70'>No extracted skills.</div>
          )}
        </div>

        <div>
          <h4 className='text-white/90 mb-2'>Recommended</h4>
          {hasGenerated ? (
            <div className='grid grid-cols-2 gap-3'>
              {generatedSkills.map((g, i) => (
                <div key={`gen-${i}`} className='bg-black/20 border border-[#00C853]/30 rounded-xl p-3 text-white'>
                  {g}
                </div>
              ))}
            </div>
          ) : (
            <div className='text-white/70'>No recommended skills yet.</div>
          )}
        </div>
      </div>

      <div className='mt-4 flex gap-3'>
        <button onClick={() => navigate('/path')} className='py-2 px-4 bg-[#4285F4] rounded text-white'>View Learning Path</button>
        <button onClick={() => navigate('/jobs')} className='py-2 px-4 bg-[#FF9800] rounded text-white'>View Job Insights</button>
      </div>
    </div>
  );
};

export default GeneratedSkills;
