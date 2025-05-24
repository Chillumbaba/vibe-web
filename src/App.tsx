import React, { useState } from 'react';
import './App.css';
import RuleGrid from './components/RuleGrid';
import RuleConfig from './components/RuleConfig';
import GridStats from './components/GridStats';

type PageType = 'grid' | 'config' | 'stats';

function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('grid');

  const getPageTitle = () => {
    switch (currentPage) {
      case 'grid':
        return 'Rule Tracking Grid';
      case 'config':
        return 'Rule Configuration';
      case 'stats':
        return 'Rule Statistics';
      default:
        return 'Rule Tracking';
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'grid':
        return <RuleGrid />;
      case 'config':
        return <RuleConfig />;
      case 'stats':
        return <GridStats />;
      default:
        return <RuleGrid />;
    }
  };

  return (
    <div className="App">
      <nav className="top-nav">
        <div className="nav-menu">
          <button 
            className={`nav-button ${currentPage === 'grid' ? 'active' : ''}`}
            onClick={() => setCurrentPage('grid')}
          >
            Grid View
          </button>
          <button 
            className={`nav-button ${currentPage === 'config' ? 'active' : ''}`}
            onClick={() => setCurrentPage('config')}
          >
            Configure Rules
          </button>
          <button 
            className={`nav-button ${currentPage === 'stats' ? 'active' : ''}`}
            onClick={() => setCurrentPage('stats')}
          >
            Statistics
          </button>
        </div>
      </nav>
      <header className="App-header">
        <h1>{getPageTitle()}</h1>
      </header>
      <main>
        {renderPage()}
      </main>
    </div>
  );
}

export default App; 