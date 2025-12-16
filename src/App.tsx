import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import HistoryPage from './pages/HistoryPage';
import GamesPage from './pages/GamesPage';
import DocumentsPage from './pages/DocumentsPage';
import HistoryChatBot from './components/history/HistoryChatBot';
import './index.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/noi-dung" element={<HistoryPage />} />
          <Route path="/games" element={<GamesPage />} />
          <Route path="/tai-lieu" element={<DocumentsPage />} />
        </Routes>
        
        {/* AI Chatbot */}
        <HistoryChatBot />
      </div>
    </Router>
  );
}

export default App;
