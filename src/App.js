import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import WeightTracker from './components/WeightTracker';
import WorkoutLogger from './components/WorkoutLogger';
import Charts from './components/Charts';
import Profile from './components/Profile';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <div className="app-container">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/weight" element={<WeightTracker />} />
            <Route path="/workouts" element={<WorkoutLogger />} />
            <Route path="/charts" element={<Charts />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
          <Navigation />
        </div>
      </div>
    </Router>
  );
}

export default App;

