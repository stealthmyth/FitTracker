import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit3, Save, X } from 'lucide-react';
import storage from '../utils/storage';

const WeightTracker = () => {
  const [weightData, setWeightData] = useState([]);
  const [newWeight, setNewWeight] = useState('');
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [newNotes, setNewNotes] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editWeight, setEditWeight] = useState('');
  const [editNotes, setEditNotes] = useState('');

  useEffect(() => {
    // Load weight data from storage
    const savedData = storage.getItem('weightData');
    if (savedData) {
      setWeightData(JSON.parse(savedData));
    }
  }, []);

  const saveToStorage = (data) => {
    storage.setItem('weightData', JSON.stringify(data));
  };

  const addWeight = (e) => {
    e.preventDefault();
    if (!newWeight || !newDate) return;

    const weightEntry = {
      id: Date.now().toString(),
      weight: parseFloat(newWeight),
      date: newDate,
      notes: newNotes,
      timestamp: new Date().toISOString()
    };

    const updatedData = [...weightData, weightEntry].sort((a, b) => new Date(b.date) - new Date(a.date));
    setWeightData(updatedData);
    saveToStorage(updatedData);

    // Reset form
    setNewWeight('');
    setNewDate(new Date().toISOString().split('T')[0]);
    setNewNotes('');
  };

  const deleteWeight = (id) => {
    const updatedData = weightData.filter(entry => entry.id !== id);
    setWeightData(updatedData);
    saveToStorage(updatedData);
  };

  const startEdit = (entry) => {
    setEditingId(entry.id);
    setEditWeight(entry.weight.toString());
    setEditNotes(entry.notes || '');
  };

  const saveEdit = (id) => {
    if (!editWeight) return;

    const updatedData = weightData.map(entry => 
      entry.id === id 
        ? { ...entry, weight: parseFloat(editWeight), notes: editNotes }
        : entry
    );
    setWeightData(updatedData);
    saveToStorage(updatedData);
    setEditingId(null);
    setEditWeight('');
    setEditNotes('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditWeight('');
    setEditNotes('');
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

  const getWeightChange = (currentWeight, index) => {
    if (index === weightData.length - 1) return null;
    const previousWeight = weightData[index + 1].weight;
    const change = currentWeight - previousWeight;
    return change;
  };

  return (
    <div className="main-content">
      <div className="page-header">
        <h1 className="page-title">Weight Tracker</h1>
        <p className="page-subtitle">Monitor your weight progress</p>
      </div>

      {/* Add Weight Form */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Log Weight</h2>
        </div>
        <form onSubmit={addWeight}>
          <div className="form-group">
            <label className="form-label">Weight (kg)</label>
            <input
              type="number"
              step="0.1"
              className="form-input"
              value={newWeight}
              onChange={(e) => setNewWeight(e.target.value)}
              placeholder="Enter your weight"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Date</label>
            <input
              type="date"
              className="form-input"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Notes (optional)</label>
            <input
              type="text"
              className="form-input"
              value={newNotes}
              onChange={(e) => setNewNotes(e.target.value)}
              placeholder="Morning weight, after workout, etc."
            />
          </div>
          <button type="submit" className="btn btn-primary btn-full">
            <Plus size={20} />
            Add Weight Entry
          </button>
        </form>
      </div>

      {/* Weight History */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Weight History</h2>
        </div>
        {weightData.length > 0 ? (
          <div className="weight-list">
            {weightData.map((entry, index) => {
              const weightChange = getWeightChange(entry.weight, index);
              const isEditing = editingId === entry.id;

              return (
                <div key={entry.id} className="list-item">
                  <div className="list-item-content">
                    {isEditing ? (
                      <div className="edit-form">
                        <div className="grid grid-2" style={{ marginBottom: '12px' }}>
                          <input
                            type="number"
                            step="0.1"
                            className="form-input"
                            value={editWeight}
                            onChange={(e) => setEditWeight(e.target.value)}
                            placeholder="Weight"
                          />
                          <input
                            type="text"
                            className="form-input"
                            value={editNotes}
                            onChange={(e) => setEditNotes(e.target.value)}
                            placeholder="Notes"
                          />
                        </div>
                        <div className="edit-actions">
                          <button 
                            onClick={() => saveEdit(entry.id)}
                            className="btn btn-success"
                            style={{ marginRight: '8px', padding: '8px 12px' }}
                          >
                            <Save size={16} />
                          </button>
                          <button 
                            onClick={cancelEdit}
                            className="btn btn-secondary"
                            style={{ padding: '8px 12px' }}
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="list-item-title">
                          {entry.weight} kg
                          {weightChange !== null && (
                            <span 
                              style={{ 
                                marginLeft: '8px',
                                fontSize: '14px',
                                color: weightChange > 0 ? '#ef4444' : weightChange < 0 ? '#10b981' : '#64748b'
                              }}
                            >
                              ({weightChange > 0 ? '+' : ''}{weightChange.toFixed(1)} kg)
                            </span>
                          )}
                        </div>
                        <div className="list-item-subtitle">
                          {formatDate(entry.date)}
                          {entry.notes && ` • ${entry.notes}`}
                        </div>
                      </>
                    )}
                  </div>
                  {!isEditing && (
                    <div className="list-item-action">
                      <button 
                        onClick={() => startEdit(entry)}
                        className="btn btn-secondary"
                        style={{ marginRight: '8px', padding: '8px' }}
                      >
                        <Edit3 size={16} />
                      </button>
                      <button 
                        onClick={() => deleteWeight(entry.id)}
                        className="btn btn-secondary"
                        style={{ padding: '8px', color: '#ef4444' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">⚖️</div>
            <div className="empty-state-title">No weight entries yet</div>
            <div className="empty-state-description">
              Start tracking your weight to see your progress over time
            </div>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      {weightData.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Quick Stats</h2>
          </div>
          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-value">{weightData[0].weight}</span>
              <span className="stat-label">Latest (kg)</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{Math.min(...weightData.map(e => e.weight))}</span>
              <span className="stat-label">Lowest (kg)</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{Math.max(...weightData.map(e => e.weight))}</span>
              <span className="stat-label">Highest (kg)</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{weightData.length}</span>
              <span className="stat-label">Total Entries</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeightTracker;

