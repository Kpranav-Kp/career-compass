import React, { useEffect, useState } from 'react';
import Nav from './Nav';
import { useGeneratedSkills } from '../context/GeneratedSkillsContext';
import { skillsService } from '../services/api';

const Jobs = () => {
  const { generatedSkills } = useGeneratedSkills();
  const [market, setMarket] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      if (!generatedSkills || generatedSkills.length === 0) return;
      setLoading(true);
      try {
        const res = await skillsService.getMarketForSkills(generatedSkills.map(s => String(s).toLowerCase()));
        setMarket(res);
      } catch (e) {
        console.error('Failed to load market insights', e);
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
        <h2 className='text-white text-2xl mb-4'>Job Market Insights</h2>
      {loading && <p className='text-white'>Loading...</p>}
      {!loading && market && (
        <div className='space-y-6'>
          {(() => {
            const block = market.skills || market;
            if (!block || Object.keys(block).length === 0) {
              return <p className='text-white/70'>No market insights available for the generated skills.</p>;
            }

            return generatedSkills.map((skill, idx) => {
              const key = String(skill).toLowerCase();
              const data = block[key] || block[skill] || {};
              const relevance = (data.relevance_score ?? data.relevance ?? null);
              const trend = data.trend || data.growth || '';
              const industries = Array.isArray(data.industries) ? data.industries : (data.industry_sectors || []);
              const roles = Array.isArray(data.related_roles) ? data.related_roles : (data.roles || []);
              const complementary = Array.isArray(data.complementary_skills) ? data.complementary_skills : (data.complements || []);
              const insights = data.insights || data.future_outlook || data.summary || '';

              const scorePercent = (typeof relevance === 'number' && !isNaN(relevance)) ? Math.max(0, Math.min(100, Math.round(relevance * 10))) : null;

              return (
                <div key={idx} className='bg-black/20 border border-[#0089ED]/10 rounded-lg p-4'>
                  <div className='flex items-center justify-between'>
                    <h3 className='text-white text-lg mb-2'>{skill}</h3>
                    <div className='text-sm text-white/70'>{trend ? `Trend: ${trend}` : ''}</div>
                  </div>

                  <div className='mb-2'>
                    <strong className='text-white/80'>Demand:</strong>
                    <div className='text-sm text-white/70'>
                      {relevance !== null ? (
                        <div className='w-full bg-white/5 rounded h-3 mt-1'>
                          <div className='bg-green-500 h-3 rounded' style={{ width: `${scorePercent ?? 0}%` }} />
                        </div>
                      ) : (
                        <span className='ml-2'>N/A</span>
                      )}
                    </div>
                  </div>

                  {industries.length > 0 ? (
                    <div className='text-sm text-white/70 mb-2'><strong>Industries:</strong> {industries.join(', ')}</div>
                  ) : (
                    <div className='text-sm text-white/70 mb-2'>Industries: N/A</div>
                  )}

                  {roles.length > 0 ? (
                    <div className='text-sm text-white/70 mb-2'><strong>Related roles:</strong> {roles.join(', ')}</div>
                  ) : (
                    <div className='text-sm text-white/70 mb-2'>Related roles: N/A</div>
                  )}

                  {complementary.length > 0 ? (
                    <div className='text-sm text-white/70 mb-2'><strong>Complementary skills:</strong> {complementary.join(', ')}</div>
                  ) : null}

                  {insights ? <div className='text-sm text-white/70 mt-2'>{insights}</div> : null}
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

export default Jobs;
