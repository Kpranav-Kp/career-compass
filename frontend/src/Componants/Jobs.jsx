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

  // Generate a session key on mount and load cached market data
  useEffect(() => {
    const key = sessionStorage.getItem('marketSessionKey');
    if (key) {
      setSessionKey(key);
      // Load cached market data from sessionStorage
      const cached = sessionStorage.getItem('marketData');
      if (cached) {
        try {
          const parsedData = JSON.parse(cached);
          setMarket(parsedData);
          setHasFetched(true); // Mark as already fetched
          console.log('Loaded cached market data from sessionStorage');
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

  // Clear cache when new resume is uploaded (detected by generatedSkills change)
  useEffect(() => {
    if (!sessionKey || !generatedSkills || generatedSkills.length === 0) return;

    const cachedSkills = sessionStorage.getItem('cachedMarketSkills');
    const currentSkills = JSON.stringify(generatedSkills);
    
    if (cachedSkills && cachedSkills !== currentSkills) {
      // Skills changed - clear cache and reset state
      console.log('Skills changed - clearing market cache');
      const newKey = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('marketSessionKey', newKey);
      sessionStorage.removeItem('marketData');
      sessionStorage.setItem('cachedMarketSkills', currentSkills);
      setSessionKey(newKey);
      setMarket(null);
      setHasFetched(false);
    } else if (!cachedSkills) {
      // First time - save skills
      sessionStorage.setItem('cachedMarketSkills', currentSkills);
    }
  }, [generatedSkills, sessionKey]);

  // Fetch market data only once if not cached
  useEffect(() => {
    const fetchMarketData = async () => {
      // Don't fetch if:
      // 1. No skills available
      // 2. Already have market data
      // 3. Already fetched in this session
      // 4. Currently loading
      if (!generatedSkills || generatedSkills.length === 0) return;
      if (market || hasFetched || loading) {
        console.log('Skipping market fetch - data already available');
        return;
      }

      console.log('Fetching market data from API...');
      setLoading(true);
      try {
        const res = await skillsService.getMarketForSkills(generatedSkills.map(s => String(s).toLowerCase()));
        setMarket(res);
        setHasFetched(true);
        
        // Save to sessionStorage
        if (res && sessionKey) {
          sessionStorage.setItem('marketData', JSON.stringify(res));
          console.log('Saved market data to sessionStorage');
        }
      } catch (e) {
        console.error('Failed to load market insights', e);
        setHasFetched(true); // Prevent retry loops
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
              const block = market.skills || market;
              if (!block || Object.keys(block).length === 0) {
                return (
                  <div className='bg-black/20 border border-[#0089ED]/10 rounded-lg p-6'>
                    <p className='text-white/70'>No market insights available for the generated skills.</p>
                  </div>
                );
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
                const demand = data.demand || '';

                const scorePercent = (typeof relevance === 'number' && !isNaN(relevance)) 
                  ? Math.max(0, Math.min(100, Math.round(relevance * 10))) 
                  : null;

                // Determine demand level color
                let demandColor = 'bg-gray-500';
                let demandText = demand || 'Unknown';
                
                if (demand) {
                  const demandLower = demand.toLowerCase();
                  if (demandLower.includes('high') || demandLower.includes('very high')) {
                    demandColor = 'bg-green-500';
                  } else if (demandLower.includes('medium') || demandLower.includes('moderate')) {
                    demandColor = 'bg-yellow-500';
                  } else if (demandLower.includes('low')) {
                    demandColor = 'bg-red-500';
                  }
                }

                return (
                  <div key={idx} className='bg-black/20 border border-[#0089ED]/10 rounded-lg p-5'>
                    <div className='flex items-center justify-between mb-4'>
                      <h3 className='text-white text-xl font-semibold'>{skill}</h3>
                      {trend && (
                        <div className='text-sm text-white/70 bg-black/30 px-3 py-1 rounded-full'>
                          📈 Trend: {trend}
                        </div>
                      )}
                    </div>

                    <div className='space-y-4'>
                      {/* Demand Score */}
                      <div>
                        <div className='flex items-center justify-between mb-2'>
                          <strong className='text-white/90'>Market Demand:</strong>
                          {demandText && (
                            <span className={`text-xs px-2 py-1 rounded ${demandColor} text-white font-semibold`}>
                              {demandText}
                            </span>
                          )}
                        </div>
                        {relevance !== null ? (
                          <div className='w-full bg-white/5 rounded-full h-4'>
                            <div 
                              className={`${demandColor} h-4 rounded-full transition-all duration-500 flex items-center justify-end pr-2`}
                              style={{ width: `${scorePercent ?? 0}%` }}
                            >
                              {scorePercent !== null && scorePercent > 10 && (
                                <span className='text-xs text-white font-semibold'>{scorePercent}%</span>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className='text-sm text-white/60'>Demand data not available</div>
                        )}
                      </div>

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