export default function SkillBadge({ skill, level = null }) {
  const getColorClass = () => {
    if (!level) return 'bg-blue-100 text-blue-800';
    switch (level.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-purple-100 text-purple-800';
      case 'expert':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getColorClass()} mr-2 mb-2`}>
      {skill}
      {level && <span className="ml-1 opacity-75">• {level}</span>}
    </span>
  );
}