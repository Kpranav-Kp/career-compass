import React, { useEffect, useState } from 'react';
import Nav from './Nav';
import { useGeneratedSkills } from '../context/GeneratedSkillsContext';
import { skillsService } from '../services/api';

const Jobs = () => {
  const { generatedSkills } = useGeneratedSkills();
  const [market, setMarket] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sessionKey, setSessionKey] = useState(null);
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    const key = sessionStorage.getItem('marketSessionKey');
    if (key) {
      setSessionKey(key);
      const cached = sessionStorage.getItem('marketData');
      if (cached) {
        try {
          setMarket(JSON.parse(cached));
          setHasFetched(true);
        } catch (e) {
          console.error('Failed to parse cached market data', e);
        }
      }
    } else {
      const newKey = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('marketSessionKey', newKey);
      setSessionKey(newKey);
    }
  }, []);

  useEffect(() => {
    if (!sessionKey || !generatedSkills || generatedSkills.length === 0) return;
    const cachedSkills = sessionStorage.getItem('cachedMarketSkills');
    const currentSkills = JSON.stringify(generatedSkills);
    
    if (cachedSkills && cachedSkills !== currentSkills) {
      const newKey = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('marketSessionKey', newKey);
      sessionStorage.removeItem('marketData');
      sessionStorage.setItem('cachedMarketSkills', currentSkills);
      setSessionKey(newKey);
      setMarket(null);
      setHasFetched(false);
    } else if (!cachedSkills) {
      sessionStorage.setItem('cachedMarketSkills', currentSkills);
    }
  }, [generatedSkills, sessionKey]);

  useEffect(() => {
    const fetchMarketData = async () => {
      if (!generatedSkills || generatedSkills.length === 0 || market || hasFetched || loading) return;

      setLoading(true);
      try {
        const res = await skillsService.getMarketForSkills(generatedSkills.map(s => String(s).toLowerCase()));
        setMarket(res);
        setHasFetched(true);
        
        if (res && sessionKey) {
          sessionStorage.setItem('marketData', JSON.stringify(res));
        }
      } catch (e) {
        console.error('Failed to load market insights', e);
        setHasFetched(true);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMarketData();
  }, [generatedSkills, market, hasFetched, loading, sessionKey]);

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
        
        {loading && (
          <div className='flex items-center justify-center py-12'>
            <div className='text-white text-lg'>Loading market insights...</div>
          </div>
        )}
        
        {!loading && market && (
          <div className='space-y-6'>
            {(() => {
              // Handle response: {skills: {skill_name: {...}}}
              const skillsData = market.skills || {};
              
              if (!skillsData || Object.keys(skillsData).length === 0) {
                return (
                  <div className='bg-black/20 border border-[#0089ED]/10 rounded-lg p-6'>
                    <p className='text-white/70'>No market insights available for the generated skills.</p>
                  </div>
                );
              }

              return generatedSkills.map((skill, idx) => {
                const skillKey = Object.keys(skillsData).find(k => k.toLowerCase() === skill.toLowerCase());
                const data = skillKey ? skillsData[skillKey] : {};
                
                const relevance = data.relevance_score ?? null;
                const trend = data.trend || '';
                const industries = data.industries || [];
                const roles = data.related_roles || [];
                const complementary = data.complementary_skills || [];
                const insights = data.insights || '';

                const scorePercent = (typeof relevance === 'number' && !isNaN(relevance)) 
                  ? Math.max(0, Math.min(100, Math.round(relevance * 10))) 
                  : null;

                let trendColor = 'bg-gray-500';
                let trendIcon = '📊';
                if (trend.toLowerCase().includes('grow')) {
                  trendColor = 'bg-green-500';
                  trendIcon = '📈';
                } else if (trend.toLowerCase().includes('declin')) {
                  trendColor = 'bg-red-500';
                  trendIcon = '📉';
                } else if (trend.toLowerCase().includes('stable')) {
                  trendColor = 'bg-blue-500';
                  trendIcon = '➡️';
                }

                return (
                  <div key={idx} className='bg-black/20 border border-[#0089ED]/10 rounded-lg p-5'>
                    <div className='flex items-center justify-between mb-4'>
                      <h3 className='text-white text-xl font-semibold'>{skill}</h3>
                      {trend && (
                        <div className={`text-sm text-white px-3 py-1 rounded-full ${trendColor}`}>
                          {trendIcon} {trend}
                        </div>
                      )}
                    </div>

                    <div className='space-y-4'>
                      {/* Demand Score */}
                      {relevance !== null && (
                        <div>
                          <div className='flex items-center justify-between mb-2'>
                            <strong className='text-white/90'>Market Demand Score:</strong>
                            <span className='text-white/80 font-semibold'>{relevance}/10</span>
                          </div>
                          <div className='w-full bg-white/5 rounded-full h-4'>
                            <div 
                              className='bg-green-500 h-4 rounded-full transition-all duration-500'
                              style={{ width: `${scorePercent}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Industries */}
                      {industries.length > 0 && (
                        <div className='bg-black/10 rounded p-3'>
                          <strong className='text-white/90 block mb-2'>🏢 Key Industries:</strong>
                          <div className='flex flex-wrap gap-2'>
                            {industries.map((ind, i) => (
                              <span key={i} className='bg-[#0089ED]/20 text-[#0089ED] px-3 py-1 rounded-full text-sm'>
                                {ind}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Related Roles */}
                      {roles.length > 0 && (
                        <div className='bg-black/10 rounded p-3'>
                          <strong className='text-white/90 block mb-2'>💼 Related Job Roles:</strong>
                          <div className='flex flex-wrap gap-2'>
                            {roles.map((role, i) => (
                              <span key={i} className='bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm'>
                                {role}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Complementary Skills */}
                      {complementary.length > 0 && (
                        <div className='bg-black/10 rounded p-3'>
                          <strong className='text-white/90 block mb-2'>🔗 Complementary Skills:</strong>
                          <div className='flex flex-wrap gap-2'>
                            {complementary.map((comp, i) => (
                              <span key={i} className='bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full text-sm'>
                                {comp}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Insights */}
                      {insights && (
                        <div className='bg-black/10 rounded p-4 border-l-4 border-[#0089ED]'>
                          <strong className='text-white/90 block mb-2'>💡 Market Insights:</strong>
                          <p className='text-sm text-white/70 leading-relaxed'>{insights}</p>
                        </div>
                      )}

                      {/* No data message */}
                      {!insights && industries.length === 0 && roles.length === 0 && relevance === null && (
                        <div className='text-sm text-white/60 text-center py-4'>
                          Limited market data available for this skill.
                        </div>
                      )}
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        )}

        {!loading && !market && (
          <div className='bg-black/20 border border-[#0089ED]/10 rounded-lg p-6'>
            <p className='text-white/70'>Loading market insights for your skills...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs;