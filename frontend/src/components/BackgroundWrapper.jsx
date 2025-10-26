export default function BackgroundWrapper({ children }) {
  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: `url('/background.jpg')`,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backgroundBlendMode: 'overlay'
      }}
    >
      {children}
    </div>
  );
}