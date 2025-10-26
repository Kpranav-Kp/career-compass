export default function SkillDisplay({ skills, onSelect = null }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, index) => (
          <span
            key={index}
            onClick={() => onSelect && onSelect(skill)}
            className={`
              px-3 py-1 rounded-full text-sm font-medium
              bg-gradient-to-r from-blue-50 to-blue-100
              text-blue-800 border border-blue-200
              hover:from-blue-100 hover:to-blue-200
              transition-colors duration-200
              ${onSelect ? 'cursor-pointer hover:shadow-md' : ''}
            `}
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}

export function MarketRelevanceDisplay({ relevance }) {
  const getScoreColor = (score) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-blue-600';
    if (score >= 4) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getTrendIcon = (trend) => {
    switch (trend.toLowerCase()) {
      case 'growing':
        return '↗️';
      case 'stable':
        return '➡️';
      case 'declining':
        return '↘️';
      default:
        return '➡️';
    }
  };

  return (
    <div className="space-y-6">
      {Object.entries(relevance.skills || {}).map(([skill, data]) => (
        <div key={skill} className="bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-800">{skill}</h3>
            <div className="flex items-center space-x-2">
              <span className={`text-lg font-bold ${getScoreColor(data.relevance_score)}`}>
                {data.relevance_score}/10
              </span>
              <span title={`Trend: ${data.trend}`}>{getTrendIcon(data.trend)}</span>
            </div>
          </div>
          
          <p className="text-gray-600 mb-3">{data.insights}</p>
          
          <div className="space-y-2">
            <div>
              <span className="text-sm font-medium text-gray-500">Related Roles:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {data.related_roles.map((role, idx) => (
                  <span key={idx} className="text-sm bg-gray-100 text-gray-700 px-2 py-1 rounded">
                    {role}
                  </span>
                ))}
              </div>
            </div>
            
            <div>
              <span className="text-sm font-medium text-gray-500">Complementary Skills:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {data.complementary_skills.map((skill, idx) => (
                  <span key={idx} className="text-sm bg-blue-50 text-blue-700 px-2 py-1 rounded">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function RoadmapDisplay({ roadmap }) {
  return (
    <div className="space-y-8">
      {Object.entries(roadmap.roadmap || {}).map(([skill, data]) => (
        <div key={skill} className="bg-white/90 backdrop-blur-sm rounded-lg p-6 shadow-md">
          <h3 className="text-xl font-bold text-gray-800 mb-4">{skill}</h3>
          
          <div className="space-y-6">
            {data.levels.map((level, idx) => (
              <div key={idx} className="border-l-4 border-blue-500 pl-4">
                <h4 className="text-lg font-semibold text-blue-700 mb-2">{level.level}</h4>
                <p className="text-gray-600 mb-3">{level.description}</p>
                
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Resources:</span>
                    <ul className="list-disc list-inside text-blue-600">
                      {level.resources.map((resource, i) => (
                        <li key={i} className="text-sm">{resource}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <span className="text-sm font-medium text-gray-500">Projects:</span>
                    <ul className="list-disc list-inside text-gray-700">
                      {level.projects.map((project, i) => (
                        <li key={i} className="text-sm">{project}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="text-sm text-gray-500">
                    Estimated Time: {level.timeframe}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 pt-4 border-t">
            <div className="text-sm">
              <span className="font-medium text-gray-500">Market Relevance:</span>
              <p className="text-gray-700 mt-1">{data.market_relevance}</p>
            </div>
            
            {data.prerequisites.length > 0 && (
              <div className="mt-3 text-sm">
                <span className="font-medium text-gray-500">Prerequisites:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {data.prerequisites.map((prereq, idx) => (
                    <span key={idx} className="bg-gray-100 text-gray-700 px-2 py-1 rounded">
                      {prereq}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}