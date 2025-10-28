import React, { createContext, useContext, useState } from 'react';

const GeneratedSkillsContext = createContext(null);

export const GeneratedSkillsProvider = ({ children }) => {
  const [generatedSkills, setGeneratedSkills] = useState([]);
  const [extractedSkills, setExtractedSkills] = useState([]);

  const clearGeneratedSkills = () => setGeneratedSkills([]);
  const clearExtractedSkills = () => setExtractedSkills([]);
  const clearAllSkills = () => {
    setGeneratedSkills([]);
    setExtractedSkills([]);
  };

  return (
    <GeneratedSkillsContext.Provider value={{
      generatedSkills,
      setGeneratedSkills,
      clearGeneratedSkills,
      extractedSkills,
      setExtractedSkills,
      clearExtractedSkills,
      clearAllSkills
    }}>
      {children}
    </GeneratedSkillsContext.Provider>
  );
};

export const useGeneratedSkills = () => {
  const ctx = useContext(GeneratedSkillsContext);
  if (!ctx) throw new Error('useGeneratedSkills must be used within GeneratedSkillsProvider');
  return ctx;
};
