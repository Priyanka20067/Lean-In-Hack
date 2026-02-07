import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import ReportPage from './pages/ReportPage';
import MapPage from './pages/MapPage';
import RoomPage from './pages/RoomPage';
import SkillsPage from './pages/SkillsPage';
import ResolvePage from './pages/ResolvePage';
import ProfilePage from './pages/ProfilePage';
import DashboardPage from './pages/DashboardPage';

function App() {
    return (
        <Router>
            <div className="bg-cracks"></div>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/report" element={<ReportPage />} />
                <Route path="/map" element={<MapPage />} />
                <Route path="/room/:id" element={<RoomPage />} />
                <Route path="/skills/:id" element={<SkillsPage />} />
                <Route path="/resolve/:id" element={<ResolvePage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
            </Routes>
        </Router>
    );
}

export default App;
