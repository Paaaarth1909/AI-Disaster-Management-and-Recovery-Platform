import { useState } from 'react';
import Dashboard from './components/Dashboard';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';

function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard'>('landing');
  const [initialDashboardView, setInitialDashboardView] = useState<string>('map');

  const handleLaunchDashboard = (view: string = 'map') => {
    setInitialDashboardView(view);
    setCurrentView('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExitToLanding = () => {
    setCurrentView('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (currentView === 'landing') {
    return <LandingPage onLaunchDashboard={handleLaunchDashboard} />;
  }

  return (
    <div className="min-h-screen bg-[#050811] text-zinc-100 font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      <Navbar onExitToLanding={handleExitToLanding} />
      <Dashboard initialView={initialDashboardView} onExitToLanding={handleExitToLanding} />
    </div>
  );
}

export default App;
