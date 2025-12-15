import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import HistoryPage from './pages/HistoryPage';
import GamesPage from './pages/GamesPage';
import AudioController from './components/common/AudioController';
import './index.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/noi-dung" element={<HistoryPage />} />
          <Route path="/games" element={<GamesPage />} />
        </Routes>
        <AudioController />
      </div>
    </Router>
  );
}

export default App;
