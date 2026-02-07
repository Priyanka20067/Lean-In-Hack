import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import ReportPage from './pages/ReportPage';

function App() {
    return (
        <Router>
            <div className="bg-cracks"></div>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/report" element={<ReportPage />} />
            </Routes>
        </Router>
    );
}

export default App;
