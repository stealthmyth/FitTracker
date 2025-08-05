import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, TrendingUp, Calendar, Target } from 'lucide-react';
import storage from '../utils/storage';

const Dashboard = () => {
  const [stats, setStats] = useState({
    currentWeight: 0,
    weightChange: 0,
    workoutsThisWeek: 0,
    totalWorkouts: 0
  });

  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    // Load data from storage
    const weightData = JSON.parse(storage.getItem('weightData') || '[]');
    const workoutData = JSON.parse(storage.getItem('workoutData') || '[]');

    // Calculate stats
    const currentWeight = weightData.length > 0 ? weightData[weightData.length - 1].weight : 0;
    const previousWeight = weightData.length > 1 ? weightData[weightData.length - 2].weight : currentWeight;
    const weightChange = currentWeight - previousWeight;

    // Calculate workouts this week
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const workoutsThisWeek = workoutData.filter(workout => 
      new Date(workout.date) >= oneWeekAgo
    ).length;

    setStats({
      currentWeight: currentWeight,
      weightChange: weightChange,
      workoutsThisWeek: workoutsThisWeek,
      totalWorkouts: workoutData.length
    });

    // Combine recent activities
    const activities = [
      ...weightData.slice(-3).map(entry => ({
        type: 'weight',
        date: entry.date,
        description: `Weight: ${entry.weight} kg`,
        icon: TrendingUp
      })),
      ...workoutData.slice(-3).map(workout => ({
        type: 'workout',
        date: workout.date,
        description: `${workout.type} workout - ${workout.exercises?.length || 0} exercises`,
        icon: Target
      }))
    ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

    setRecentActivities(activities);
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="main-content">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Track your fitness journey</p>
      </div>

      {/* Quick Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-value">{stats.currentWeight || '--'}</span>
          <span className="stat-label">Current Weight (kg)</span>
        </div>
        <div className="stat-card">
          <span className="stat-value" style={{
            color: stats.weightChange > 0 ? '#ef4444' : stats.weightChange < 0 ? '#10b981' : '#3b82f6'
          }}>
            {stats.weightChange > 0 ? '+' : ''}{stats.weightChange.toFixed(1)}
          </span>
          <span className="stat-label">Weight Change (kg)</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{stats.workoutsThisWeek}</span>
          <span className="stat-label">This Week</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{stats.totalWorkouts}</span>
          <span className="stat-label">Total Workouts</span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Quick Actions</h2>
        </div>
        <div className="grid grid-2">
          <Link to="/weight" className="btn btn-primary">
            <Plus size={20} />
            Log Weight
          </Link>
          <Link to="/workouts" className="btn btn-secondary">
            <Plus size={20} />
            Add Workout
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Recent Activity</h2>
        </div>
        {recentActivities.length > 0 ? (
          <div className="activity-list">
            {recentActivities.map((activity, index) => {
              const IconComponent = activity.icon;
              return (
                <div key={index} className="list-item">
                  <div className="list-item-content">
                    <div className="list-item-title">{activity.description}</div>
                    <div className="list-item-subtitle">
                      <Calendar size={14} style={{ marginRight: '4px', display: 'inline' }} />
                      {formatDate(activity.date)}
                    </div>
                  </div>
                  <IconComponent size={20} color="#64748b" />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">📊</div>
            <div className="empty-state-title">No activity yet</div>
            <div className="empty-state-description">
              Start by logging your weight or adding a workout
            </div>
            <Link to="/weight" className="btn btn-primary">
              Get Started
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

