import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit3, Save, X, Dumbbell, Home, Target } from 'lucide-react';
import storage from '../utils/storage';

const WorkoutLogger = () => {
  const [workoutData, setWorkoutData] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [workoutType, setWorkoutType] = useState('gym');
  const [workoutDate, setWorkoutDate] = useState(new Date().toISOString().split('T')[0]);
  const [workoutDuration, setWorkoutDuration] = useState('');
  const [workoutNotes, setWorkoutNotes] = useState('');
  const [exercises, setExercises] = useState([]);
  const [editingId, setEditingId] = useState(null);

  // Common exercises for each workout type
  const exerciseTemplates = {
    gym: [
      'Bench Press', 'Squat', 'Deadlift', 'Overhead Press', 'Barbell Row',
      'Pull-ups', 'Dips', 'Lat Pulldown', 'Leg Press', 'Bicep Curls',
      'Tricep Extensions', 'Shoulder Press', 'Chest Fly', 'Leg Curls'
    ],
    home: [
      'Push-ups', 'Squats', 'Lunges', 'Burpees', 'Mountain Climbers',
      'Plank', 'Jumping Jacks', 'High Knees', 'Sit-ups', 'Crunches',
      'Wall Sit', 'Step-ups', 'Glute Bridges', 'Pike Push-ups'
    ],
    kettlebell: [
      'Kettlebell Swing', 'Turkish Get-up', 'Goblet Squat', 'Kettlebell Press',
      'Kettlebell Row', 'Kettlebell Deadlift', 'Kettlebell Clean',
      'Kettlebell Snatch', 'Windmill', 'Halo', 'Farmer\'s Walk'
    ]
  };

  useEffect(() => {
    const savedData = storage.getItem('workoutData');
    if (savedData) {
      setWorkoutData(JSON.parse(savedData));
    }
  }, []);

  const saveToStorage = (data) => {
    storage.setItem('workoutData', JSON.stringify(data));
  };

  const addExercise = () => {
    setExercises([...exercises, {
      id: Date.now().toString(),
      name: '',
      sets: [{ reps: '', weight: '' }]
    }]);
  };

  const updateExercise = (exerciseId, field, value) => {
    setExercises(exercises.map(exercise =>
      exercise.id === exerciseId ? { ...exercise, [field]: value } : exercise
    ));
  };

  const addSet = (exerciseId) => {
    setExercises(exercises.map(exercise =>
      exercise.id === exerciseId
        ? { ...exercise, sets: [...exercise.sets, { reps: '', weight: '' }] }
        : exercise
    ));
  };

  const updateSet = (exerciseId, setIndex, field, value) => {
    setExercises(exercises.map(exercise =>
      exercise.id === exerciseId
        ? {
            ...exercise,
            sets: exercise.sets.map((set, index) =>
              index === setIndex ? { ...set, [field]: value } : set
            )
          }
        : exercise
    ));
  };

  const removeSet = (exerciseId, setIndex) => {
    setExercises(exercises.map(exercise =>
      exercise.id === exerciseId
        ? { ...exercise, sets: exercise.sets.filter((_, index) => index !== setIndex) }
        : exercise
    ));
  };

  const removeExercise = (exerciseId) => {
    setExercises(exercises.filter(exercise => exercise.id !== exerciseId));
  };

  const saveWorkout = (e) => {
    e.preventDefault();
    if (exercises.length === 0) return;

    const workout = {
      id: Date.now().toString(),
      type: workoutType,
      date: workoutDate,
      duration: parseInt(workoutDuration) || 0,
      notes: workoutNotes,
      exercises: exercises.filter(ex => ex.name.trim() !== ''),
      timestamp: new Date().toISOString()
    };

    const updatedData = [workout, ...workoutData].sort((a, b) => new Date(b.date) - new Date(a.date));
    setWorkoutData(updatedData);
    saveToStorage(updatedData);

    // Reset form
    setShowAddForm(false);
    setWorkoutType('gym');
    setWorkoutDate(new Date().toISOString().split('T')[0]);
    setWorkoutDuration('');
    setWorkoutNotes('');
    setExercises([]);
  };

  const deleteWorkout = (id) => {
    const updatedData = workoutData.filter(workout => workout.id !== id);
    setWorkoutData(updatedData);
    saveToStorage(updatedData);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getWorkoutIcon = (type) => {
    switch (type) {
      case 'gym': return <Dumbbell size={20} />;
      case 'home': return <Home size={20} />;
      case 'kettlebell': return <Target size={20} />;
      default: return <Dumbbell size={20} />;
    }
  };

  const getWorkoutTypeLabel = (type) => {
    switch (type) {
      case 'gym': return 'Gym Workout';
      case 'home': return 'Home Workout';
      case 'kettlebell': return 'Kettlebell Workout';
      default: return 'Workout';
    }
  };

  return (
    <div className="main-content">
      <div className="page-header">
        <h1 className="page-title">Workout Logger</h1>
        <p className="page-subtitle">Track your gym, home, and kettlebell workouts</p>
      </div>

      {/* Add Workout Button */}
      {!showAddForm && (
        <div className="card">
          <button 
            onClick={() => setShowAddForm(true)}
            className="btn btn-primary btn-full"
          >
            <Plus size={20} />
            Add New Workout
          </button>
        </div>
      )}

      {/* Add Workout Form */}
      {showAddForm && (
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">New Workout</h2>
            <button 
              onClick={() => setShowAddForm(false)}
              className="btn btn-secondary"
              style={{ padding: '8px' }}
            >
              <X size={16} />
            </button>
          </div>
          <form onSubmit={saveWorkout}>
            <div className="form-group">
              <label className="form-label">Workout Type</label>
              <select
                className="form-select"
                value={workoutType}
                onChange={(e) => setWorkoutType(e.target.value)}
              >
                <option value="gym">Gym Workout</option>
                <option value="home">Home Workout</option>
                <option value="kettlebell">Kettlebell Workout</option>
              </select>
            </div>
            
            <div className="grid grid-2">
              <div className="form-group">
                <label className="form-label">Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={workoutDate}
                  onChange={(e) => setWorkoutDate(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Duration (minutes)</label>
                <input
                  type="number"
                  className="form-input"
                  value={workoutDuration}
                  onChange={(e) => setWorkoutDuration(e.target.value)}
                  placeholder="45"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Notes (optional)</label>
              <input
                type="text"
                className="form-input"
                value={workoutNotes}
                onChange={(e) => setWorkoutNotes(e.target.value)}
                placeholder="Great workout, felt strong today..."
              />
            </div>

            {/* Exercises */}
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <label className="form-label" style={{ margin: 0 }}>Exercises</label>
                <button 
                  type="button"
                  onClick={addExercise}
                  className="btn btn-secondary"
                  style={{ padding: '8px 12px' }}
                >
                  <Plus size={16} />
                  Add Exercise
                </button>
              </div>

              {exercises.map((exercise, exerciseIndex) => (
                <div key={exercise.id} className="exercise-form" style={{ 
                  border: '1px solid #e2e8f0', 
                  borderRadius: '8px', 
                  padding: '16px', 
                  marginBottom: '16px',
                  backgroundColor: '#f8fafc'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <select
                      className="form-select"
                      value={exercise.name}
                      onChange={(e) => updateExercise(exercise.id, 'name', e.target.value)}
                      style={{ flex: 1, marginRight: '8px' }}
                    >
                      <option value="">Select exercise...</option>
                      {exerciseTemplates[workoutType].map(name => (
                        <option key={name} value={name}>{name}</option>
                      ))}
                      <option value="custom">Custom Exercise</option>
                    </select>
                    <button 
                      type="button"
                      onClick={() => removeExercise(exercise.id)}
                      className="btn btn-secondary"
                      style={{ padding: '8px', color: '#ef4444' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  {exercise.name === 'custom' && (
                    <div className="form-group">
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Enter custom exercise name"
                        onChange={(e) => updateExercise(exercise.id, 'name', e.target.value)}
                      />
                    </div>
                  )}

                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontWeight: '500', fontSize: '14px' }}>Sets</span>
                      <button 
                        type="button"
                        onClick={() => addSet(exercise.id)}
                        className="btn btn-secondary"
                        style={{ padding: '4px 8px', fontSize: '12px' }}
                      >
                        <Plus size={14} />
                        Add Set
                      </button>
                    </div>
                    
                    {exercise.sets.map((set, setIndex) => (
                      <div key={setIndex} style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'center' }}>
                        <span style={{ minWidth: '30px', fontSize: '14px', color: '#64748b' }}>
                          {setIndex + 1}.
                        </span>
                        <input
                          type="number"
                          className="form-input"
                          placeholder="Reps"
                          value={set.reps}
                          onChange={(e) => updateSet(exercise.id, setIndex, 'reps', e.target.value)}
                          style={{ flex: 1 }}
                        />
                        {workoutType !== 'home' && (
                          <input
                            type="number"
                            step="0.5"
                            className="form-input"
                            placeholder="Weight (kg)"
                            value={set.weight}
                            onChange={(e) => updateSet(exercise.id, setIndex, 'weight', e.target.value)}
                            style={{ flex: 1 }}
                          />
                        )}
                        {exercise.sets.length > 1 && (
                          <button 
                            type="button"
                            onClick={() => removeSet(exercise.id, setIndex)}
                            className="btn btn-secondary"
                            style={{ padding: '8px', color: '#ef4444' }}
                          >
                            <X size={14} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-2">
              <button 
                type="button"
                onClick={() => setShowAddForm(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="btn btn-success"
                disabled={exercises.length === 0}
              >
                <Save size={20} />
                Save Workout
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Workout History */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Workout History</h2>
        </div>
        {workoutData.length > 0 ? (
          <div className="workout-list">
            {workoutData.map((workout) => (
              <div key={workout.id} className="list-item">
                <div className="list-item-content">
                  <div className="list-item-title">
                    {getWorkoutIcon(workout.type)}
                    <span style={{ marginLeft: '8px' }}>
                      {getWorkoutTypeLabel(workout.type)}
                    </span>
                    {workout.duration > 0 && (
                      <span style={{ marginLeft: '8px', fontSize: '14px', color: '#64748b' }}>
                        ({workout.duration} min)
                      </span>
                    )}
                  </div>
                  <div className="list-item-subtitle">
                    {formatDate(workout.date)} • {workout.exercises.length} exercises
                    {workout.notes && ` • ${workout.notes}`}
                  </div>
                  <div style={{ marginTop: '8px', fontSize: '14px', color: '#64748b' }}>
                    {workout.exercises.map((exercise, index) => (
                      <div key={index}>
                        {exercise.name}: {exercise.sets.length} sets
                      </div>
                    ))}
                  </div>
                </div>
                <div className="list-item-action">
                  <button 
                    onClick={() => deleteWorkout(workout.id)}
                    className="btn btn-secondary"
                    style={{ padding: '8px', color: '#ef4444' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">💪</div>
            <div className="empty-state-title">No workouts logged yet</div>
            <div className="empty-state-description">
              Start tracking your workouts to monitor your fitness progress
            </div>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      {workoutData.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Workout Stats</h2>
          </div>
          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-value">{workoutData.length}</span>
              <span className="stat-label">Total Workouts</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">
                {workoutData.filter(w => {
                  const oneWeekAgo = new Date();
                  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
                  return new Date(w.date) >= oneWeekAgo;
                }).length}
              </span>
              <span className="stat-label">This Week</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">
                {Math.round(workoutData.reduce((sum, w) => sum + w.duration, 0) / workoutData.length) || 0}
              </span>
              <span className="stat-label">Avg Duration (min)</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">
                {workoutData.reduce((sum, w) => sum + w.exercises.length, 0)}
              </span>
              <span className="stat-label">Total Exercises</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkoutLogger;

