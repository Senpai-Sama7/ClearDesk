import { DocumentProvider } from './contexts/DocumentContext';
import { Dashboard } from './components/dashboard/Dashboard';

function App() {
  return (
    <DocumentProvider>
      <Dashboard />
    </DocumentProvider>
  );
}

export default App;
