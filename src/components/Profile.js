import React, { useState, useEffect } from 'react';
import { Download, Upload, Trash2, Settings, User, Database } from 'lucide-react';
import storage from '../utils/storage';

const Profile = () => {
  const [stats, setStats] = useState({
    weightEntries: 0,
    totalWorkouts: 0,
    dataSize: 0
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    // Load data from storage
    const weightData = JSON.parse(storage.getItem('weightData') || '[]');
    const workoutData = JSON.parse(storage.getItem('workoutData') || '[]');
    
    const dataSize = new Blob([
      storage.getItem('weightData') || '[]',
      storage.getItem('workoutData') || '[]'
    ]).size;

    setStats({
      weightEntries: weightData.length,
      totalWorkouts: workoutData.length,
      dataSize: Math.round(dataSize / 1024 * 100) / 100 // KB
    });
  }, []);

  const exportData = () => {
    const weightData = storage.getItem('weightData') || '[]';
    const workoutData = storage.getItem('workoutData') || '[]';
    
    const exportObject = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      data: {
        weightData: JSON.parse(weightData),
        workoutData: JSON.parse(workoutData)
      }
    };

    const dataStr = JSON.stringify(exportObject, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `fitness-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const importData = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result);
        
        if (importedData.data && importedData.data.weightData && importedData.data.workoutData) {
          // Merge with existing data
          const existingWeightData = JSON.parse(storage.getItem('weightData') || '[]');
          const existingWorkoutData = JSON.parse(storage.getItem('workoutData') || '[]');
          
          const mergedWeightData = [...existingWeightData, ...importedData.data.weightData]
            .filter((item, index, self) => 
              index === self.findIndex(t => t.id === item.id)
            )
            .sort((a, b) => new Date(b.date) - new Date(a.date));
          
          const mergedWorkoutData = [...existingWorkoutData, ...importedData.data.workoutData]
            .filter((item, index, self) => 
              index === self.findIndex(t => t.id === item.id)
            )
            .sort((a, b) => new Date(b.date) - new Date(a.date));
          
          storage.setItem('weightData', JSON.stringify(mergedWeightData));
          storage.setItem('workoutData', JSON.stringify(mergedWorkoutData));
          
          // Update stats
          setStats({
            weightEntries: mergedWeightData.length,
            totalWorkouts: mergedWorkoutData.length,
            dataSize: Math.round(new Blob([
              JSON.stringify(mergedWeightData),
              JSON.stringify(mergedWorkoutData)
            ]).size / 1024 * 100) / 100
          });
          
          alert('Data imported successfully!');
        } else {
          alert('Invalid file format. Please select a valid backup file.');
        }
      } catch (error) {
        alert('Error importing data. Please check the file format.');
      }
    };
    reader.readAsText(file);
    
    // Reset file input
    event.target.value = '';
  };

  const clearAllData = () => {
    storage.removeItem('weightData');
    storage.removeItem('workoutData');
    setStats({
      weightEntries: 0,
      totalWorkouts: 0,
      dataSize: 0
    });
    setShowDeleteConfirm(false);
    alert('All data has been cleared.');
  };

  const installPWA = () => {
    // This would be handled by the browser's PWA install prompt
    alert('To install this app on your phone:\n\n1. Open this page in your mobile browser\n2. Tap the browser menu\n3. Look for "Add to Home Screen" or "Install App"\n4. Follow the prompts to install');
  };

  return (
    <div className="main-content">
      <div className="page-header">
        <h1 className="page-title">Profile</h1>
        <p className="page-subtitle">Settings and data management</p>
      </div>

      {/* App Info */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">
            <User size={20} style={{ marginRight: '8px' }} />
            App Information
          </h2>
        </div>
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-value">{stats.weightEntries}</span>
            <span className="stat-label">Weight Entries</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{stats.totalWorkouts}</span>
            <span className="stat-label">Total Workouts</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{stats.dataSize}</span>
            <span className="stat-label">Data Size (KB)</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">v1.0</span>
            <span className="stat-label">App Version</span>
          </div>
        </div>
      </div>

      {/* Data Management */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">
            <Database size={20} style={{ marginRight: '8px' }} />
            Data Management
          </h2>
        </div>
        
        <div className="form-group">
          <label className="form-label">Export Data</label>
          <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '12px' }}>
            Download a backup of all your fitness data
          </p>
          <button onClick={exportData} className="btn btn-primary btn-full">
            <Download size={20} />
            Export Data
          </button>
        </div>

        <div className="form-group">
          <label className="form-label">Import Data</label>
          <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '12px' }}>
            Import data from a backup file (will merge with existing data)
          </p>
          <input
            type="file"
            accept=".json"
            onChange={importData}
            className="form-input"
            style={{ marginBottom: '12px' }}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Clear All Data</label>
          <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '12px' }}>
            Permanently delete all weight and workout data
          </p>
          {!showDeleteConfirm ? (
            <button 
              onClick={() => setShowDeleteConfirm(true)}
              className="btn btn-secondary btn-full"
              style={{ color: '#ef4444' }}
            >
              <Trash2 size={20} />
              Clear All Data
            </button>
          ) : (
            <div className="grid grid-2">
              <button 
                onClick={() => setShowDeleteConfirm(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button 
                onClick={clearAllData}
                className="btn btn-secondary"
                style={{ backgroundColor: '#ef4444', color: 'white' }}
              >
                Confirm Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* App Settings */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">
            <Settings size={20} style={{ marginRight: '8px' }} />
            App Settings
          </h2>
        </div>
        
        <div className="form-group">
          <label className="form-label">Install as Mobile App</label>
          <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '12px' }}>
            Install this app on your phone for a native app experience
          </p>
          <button onClick={installPWA} className="btn btn-primary btn-full">
            <Download size={20} />
            Install App
          </button>
        </div>

        <div className="form-group">
          <label className="form-label">Data Storage</label>
          <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '12px' }}>
            All data is stored locally on your device. No data is sent to external servers.
          </p>
        </div>

        <div className="form-group">
          <label className="form-label">Privacy</label>
          <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '12px' }}>
            This app respects your privacy. All fitness data remains on your device and is never shared.
          </p>
        </div>
      </div>

      {/* App Features */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Features</h2>
        </div>
        <div style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.6' }}>
          <ul style={{ paddingLeft: '20px', margin: 0 }}>
            <li>Daily weight tracking with progress visualization</li>
            <li>Comprehensive workout logging (Gym, Home, Kettlebell)</li>
            <li>Sets and reps tracking for all exercises</li>
            <li>Interactive charts and progress analytics</li>
            <li>Data export and import for backup</li>
            <li>Mobile-optimized responsive design</li>
            <li>Offline functionality with local storage</li>
            <li>Progressive Web App (PWA) support</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Profile;

