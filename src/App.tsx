import { useState } from 'react';
import { DocumentProvider } from './contexts/DocumentContext';
import { Dashboard } from './components/dashboard/Dashboard';
import { LandingPage } from './components/LandingPage';

function App() {
  const [showLanding, setShowLanding] = useState(() => !localStorage.getItem('cleardesk_visited'));

  return (
    <DocumentProvider>
      <Dashboard />
      {showLanding && <LandingPage onEnter={() => setShowLanding(false)} />}
    </DocumentProvider>
  );
}

export default App;
