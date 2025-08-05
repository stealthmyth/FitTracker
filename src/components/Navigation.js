import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Scale, Dumbbell, BarChart3, User } from 'lucide-react';
import './Navigation.css';

const Navigation = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/weight', icon: Scale, label: 'Weight' },
    { path: '/workouts', icon: Dumbbell, label: 'Workouts' },
    { path: '/charts', icon: BarChart3, label: 'Charts' },
    { path: '/profile', icon: User, label: 'Profile' }
  ];

  return (
    <nav className="bottom-nav">
      <div className="nav-container">
        {navItems.map(({ path, icon: Icon, label }) => (
          <Link
            key={path}
            to={path}
            className={`nav-item ${location.pathname === path ? 'active' : ''}`}
          >
            <Icon size={24} />
            <span className="nav-label">{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;

