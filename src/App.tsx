import React from 'react';
import Timeline from './components/Timeline';
import FloatingSparkles from './components/FloatingSparkles';
import { timelineData } from './data/data';
import './App.css';

function App() {
  return (
    <div className="App">
      <FloatingSparkles />
      <Timeline data={timelineData} />
    </div>
  );
}

export default App;
