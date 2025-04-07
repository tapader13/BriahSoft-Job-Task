import './App.css';
import { GitHubProfileAnalyzer } from './components/GitHubProfileAnalyzer';

function App() {
  return (
    <main className='min-h-screen bg-background p-4 md:p-8'>
      <div className='container mx-auto max-w-5xl'>
        <h1 className='mb-8 text-3xl font-bold tracking-tight'>
          GitHub Profile Analyzer
        </h1>
        <GitHubProfileAnalyzer />
      </div>
    </main>
  );
}

export default App;
