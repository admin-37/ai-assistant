import { useState } from "react";
import { Hero12 } from "./components/Hero12";
import { Console } from "./components/Console";

export default function App() {
  const [currentView, setCurrentView] = useState<'hero' | 'console'>('hero');

  const handleGetStarted = () => {
    setCurrentView('console');
  };

  const handleBackToHero = () => {
    setCurrentView('hero');
  };

  if (currentView === 'console') {
    return <Console onBackToHero={handleBackToHero} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Hero12 onGetStarted={handleGetStarted} />
    </div>
  );
}