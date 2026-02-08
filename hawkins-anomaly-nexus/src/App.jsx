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
import HealthEntryPage from './pages/HealthEntryPage';
import SymptomCheckerPage from './pages/SymptomCheckerPage';
import HealthGuidancePage from './pages/HealthGuidancePage';
import HealthActionPage from './pages/HealthActionPage';
import HealthReminderPage from './pages/HealthReminderPage';
import HealthLogPage from './pages/HealthLogPage';
import JobSuggestionPage from './pages/JobSuggestionPage';
import LearningPathPage from './pages/LearningPathPage';
import ChallengePage from './pages/ChallengePage';
import InterviewPage from './pages/InterviewPage';
import SkillProfilePage from './pages/SkillProfilePage';

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

                {/* Health Support Module */}
                <Route path="/health" element={<HealthEntryPage />} />
                <Route path="/health/symptoms" element={<SymptomCheckerPage />} />
                <Route path="/health/guidance" element={<HealthGuidancePage />} />
                <Route path="/health/action" element={<HealthActionPage />} />
                <Route path="/health/reminders" element={<HealthReminderPage />} />
                <Route path="/health/log" element={<HealthLogPage />} />

                {/* Job & Skill Module */}
                <Route path="/jobs/suggestion/:anomalyId" element={<JobSuggestionPage />} />
                <Route path="/jobs/learning/:anomalyId" element={<LearningPathPage />} />
                <Route path="/jobs/challenge/:anomalyId/:skill" element={<ChallengePage />} />
                <Route path="/jobs/challenge/:skill" element={<ChallengePage />} />
                <Route path="/jobs/interview/:anomalyId/:role" element={<InterviewPage />} />
                <Route path="/jobs/interview/:role" element={<InterviewPage />} />
                <Route path="/profile/skills" element={<SkillProfilePage />} />
            </Routes>
        </Router>
    );
}

export default App;
