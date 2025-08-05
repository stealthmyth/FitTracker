import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';
import { TrendingUp, Calendar, Target, Activity } from 'lucide-react';
import storage from '../utils/storage';

const Charts = () => {
  const [weightData, setWeightData] = useState([]);
  const [workoutData, setWorkoutData] = useState([]);
  const [selectedChart, setSelectedChart] = useState('weight');

  useEffect(() => {
    // Load data from storage
    const savedWeightData = storage.getItem('weightData');
    const savedWorkoutData = storage.getItem('workoutData');
    
    if (savedWeightData) {
      setWeightData(JSON.parse(savedWeightData));
    }
    if (savedWorkoutData) {
      setWorkoutData(JSON.parse(savedWorkoutData));
    }
  }, []);

  // Prepare weight chart data
  const prepareWeightChartData = () => {
    return weightData
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .map(entry => ({
        date: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        weight: entry.weight,
        fullDate: entry.date
      }));
  };

  // Prepare workout frequency data (last 30 days)
  const prepareWorkoutFrequencyData = () => {
    const last30Days = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      
      const workoutsOnDate = workoutData.filter(workout => workout.date === dateString).length;
      
      last30Days.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        workouts: workoutsOnDate,
        fullDate: dateString
      });
    }
    
    return last30Days;
  };

  // Prepare workout type distribution
  const prepareWorkoutTypeData = () => {
    const typeCounts = workoutData.reduce((acc, workout) => {
      acc[workout.type] = (acc[workout.type] || 0) + 1;
      return acc;
    }, {});

    const colors = {
      gym: '#3b82f6',
      home: '#10b981',
      kettlebell: '#f59e0b'
    };

    return Object.entries(typeCounts).map(([type, count]) => ({
      name: type.charAt(0).toUpperCase() + type.slice(1),
      value: count,
      color: colors[type] || '#64748b'
    }));
  };

  // Prepare weekly workout summary
  const prepareWeeklyWorkoutData = () => {
    const weeks = {};
    
    workoutData.forEach(workout => {
      const date = new Date(workout.date);
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      const weekKey = weekStart.toISOString().split('T')[0];
      
      if (!weeks[weekKey]) {
        weeks[weekKey] = {
          week: weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          workouts: 0,
          totalExercises: 0,
          totalDuration: 0
        };
      }
      
      weeks[weekKey].workouts += 1;
      weeks[weekKey].totalExercises += workout.exercises.length;
      weeks[weekKey].totalDuration += workout.duration || 0;
    });
    
    return Object.values(weeks)
      .sort((a, b) => new Date(a.week) - new Date(b.week))
      .slice(-8); // Last 8 weeks
  };

  const weightChartData = prepareWeightChartData();
  const workoutFrequencyData = prepareWorkoutFrequencyData();
  const workoutTypeData = prepareWorkoutTypeData();
  const weeklyWorkoutData = prepareWeeklyWorkoutData();

  const chartOptions = [
    { id: 'weight', label: 'Weight Progress', icon: TrendingUp },
    { id: 'frequency', label: 'Workout Frequency', icon: Calendar },
    { id: 'types', label: 'Workout Types', icon: Target },
    { id: 'weekly', label: 'Weekly Summary', icon: Activity }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          backgroundColor: 'white',
          padding: '12px',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <p style={{ margin: 0, fontWeight: '500' }}>{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ margin: '4px 0', color: entry.color }}>
              {entry.name}: {entry.value}
              {entry.dataKey === 'weight' && ' kg'}
              {entry.dataKey === 'totalDuration' && ' min'}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="main-content">
      <div className="page-header">
        <h1 className="page-title">Charts</h1>
        <p className="page-subtitle">Visualize your fitness progress</p>
      </div>

      {/* Chart Selection */}
      <div className="card">
        <div className="chart-selector" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', 
          gap: '8px' 
        }}>
          {chartOptions.map(option => {
            const IconComponent = option.icon;
            return (
              <button
                key={option.id}
                onClick={() => setSelectedChart(option.id)}
                className={`btn ${selectedChart === option.id ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '12px 8px', fontSize: '14px' }}
              >
                <IconComponent size={16} />
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Weight Progress Chart */}
      {selectedChart === 'weight' && (
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Weight Progress</h2>
          </div>
          {weightChartData.length > 0 ? (
            <div style={{ width: '100%', height: '300px' }}>
              <ResponsiveContainer>
                <LineChart data={weightChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#64748b"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="#64748b"
                    fontSize={12}
                    domain={['dataMin - 2', 'dataMax + 2']}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="weight" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">📊</div>
              <div className="empty-state-title">No weight data</div>
              <div className="empty-state-description">
                Start logging your weight to see progress charts
              </div>
            </div>
          )}
        </div>
      )}

      {/* Workout Frequency Chart */}
      {selectedChart === 'frequency' && (
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Workout Frequency (Last 30 Days)</h2>
          </div>
          {workoutData.length > 0 ? (
            <div style={{ width: '100%', height: '300px' }}>
              <ResponsiveContainer>
                <BarChart data={workoutFrequencyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#64748b"
                    fontSize={12}
                    interval="preserveStartEnd"
                  />
                  <YAxis 
                    stroke="#64748b"
                    fontSize={12}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="workouts" 
                    fill="#10b981"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">📅</div>
              <div className="empty-state-title">No workout data</div>
              <div className="empty-state-description">
                Start logging workouts to see frequency charts
              </div>
            </div>
          )}
        </div>
      )}

      {/* Workout Types Chart */}
      {selectedChart === 'types' && (
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Workout Type Distribution</h2>
          </div>
          {workoutTypeData.length > 0 ? (
            <div style={{ width: '100%', height: '300px' }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={workoutTypeData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {workoutTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">🎯</div>
              <div className="empty-state-title">No workout data</div>
              <div className="empty-state-description">
                Start logging workouts to see type distribution
              </div>
            </div>
          )}
        </div>
      )}

      {/* Weekly Summary Chart */}
      {selectedChart === 'weekly' && (
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Weekly Workout Summary</h2>
          </div>
          {weeklyWorkoutData.length > 0 ? (
            <div style={{ width: '100%', height: '300px' }}>
              <ResponsiveContainer>
                <BarChart data={weeklyWorkoutData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="week" 
                    stroke="#64748b"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="#64748b"
                    fontSize={12}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="workouts" 
                    fill="#3b82f6"
                    radius={[4, 4, 0, 0]}
                    name="Workouts"
                  />
                  <Bar 
                    dataKey="totalExercises" 
                    fill="#10b981"
                    radius={[4, 4, 0, 0]}
                    name="Exercises"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">📈</div>
              <div className="empty-state-title">No workout data</div>
              <div className="empty-state-description">
                Start logging workouts to see weekly summaries
              </div>
            </div>
          )}
        </div>
      )}

      {/* Statistics Summary */}
      {(weightData.length > 0 || workoutData.length > 0) && (
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Statistics Summary</h2>
          </div>
          <div className="stats-grid">
            {weightData.length > 0 && (
              <>
                <div className="stat-card">
                  <span className="stat-value">
                    {(weightData[0].weight - weightData[weightData.length - 1].weight).toFixed(1)}
                  </span>
                  <span className="stat-label">Total Weight Change (kg)</span>
                </div>
                <div className="stat-card">
                  <span className="stat-value">{weightData.length}</span>
                  <span className="stat-label">Weight Entries</span>
                </div>
              </>
            )}
            {workoutData.length > 0 && (
              <>
                <div className="stat-card">
                  <span className="stat-value">{workoutData.length}</span>
                  <span className="stat-label">Total Workouts</span>
                </div>
                <div className="stat-card">
                  <span className="stat-value">
                    {Math.round(workoutData.reduce((sum, w) => sum + (w.duration || 0), 0) / 60)}
                  </span>
                  <span className="stat-label">Total Hours</span>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Charts;

