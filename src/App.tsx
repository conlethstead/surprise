import Timeline from './components/Timeline';
import FloatingSparkles from './components/FloatingSparkles';
import FunFolder from './components/FunFolder';
import { timelineData } from './data/data';
import './App.css';

function App() {
  return (
    <div className="App">
      <FloatingSparkles />
      <FunFolder />
      <Timeline data={timelineData} />
    </div>
  );
}

export default App;
