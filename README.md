# Personal Fitness Tracker

A mobile-friendly web application for tracking your weight, workouts, and fitness progress. Built with React and designed to work completely offline with local data storage.

## 🌟 Features

### Weight Tracking
- Daily weight logging with date and notes
- Weight history with edit/delete functionality
- Progress visualization and quick stats
- Weight change tracking between entries

### Workout Logging
- Support for three workout types: Gym, Home, and Kettlebell
- Comprehensive exercise libraries for each workout type
- Sets and reps tracking with weight logging
- Workout history and management
- Custom exercise support

### Data Visualization
- Interactive weight progress charts
- Workout frequency analysis (last 30 days)
- Workout type distribution charts
- Weekly summary statistics
- Touch-friendly charts with detailed tooltips

### Mobile Features
- **Progressive Web App (PWA)** - Install on your phone's home screen
- **Offline functionality** - Works without internet connection
- **Responsive design** - Adapts to all screen sizes
- **Touch-optimized interface** - Large buttons and thumb-friendly navigation
- **Local data storage** - All data stays on your device

## 🚀 Live Demo

Visit the live app: [Your GitHub Pages URL]

## 📱 Installation

### As a Web App
1. Visit the live demo URL on your mobile device
2. Bookmark the page for easy access

### As a Mobile App (PWA)
1. **iPhone**: Open in Safari → Share → Add to Home Screen
2. **Android**: Open in Chrome → Menu → Add to Home Screen or Install App
3. **Desktop**: Look for the install prompt in your browser's address bar

## 🛠️ Development

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Setup
```bash
# Clone the repository
git clone https://github.com/yourusername/fitness-tracker.git
cd fitness-tracker

# Install dependencies
npm install

# Start development server
npm start
```

The app will open at `http://localhost:3000`

### Build for Production
```bash
npm run build
```

### Deploy to GitHub Pages
```bash
# First time setup
npm install --save-dev gh-pages

# Deploy
npm run deploy
```

## 📊 Data Storage

### Local Storage
- All data is stored locally in your browser's localStorage
- No external servers or databases required
- Data persists between sessions
- Works completely offline

### Data Management
- **Export**: Download backup files of all your data
- **Import**: Import data from backup files
- **Clear**: Permanently delete all data (with confirmation)

### Privacy
- **No data collection**: Your fitness data never leaves your device
- **No tracking**: No analytics or user tracking
- **No accounts**: No registration or login required
- **Secure**: Data is encrypted in browser's local storage

## 🏗️ Technical Details

### Built With
- **React 18** - Frontend framework
- **React Router** - Navigation
- **Recharts** - Data visualization
- **Lucide React** - Icons
- **CSS3** - Styling and responsive design
- **Service Worker** - Offline functionality

### Browser Support
- Chrome/Chromium (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers (iOS Safari, Chrome Mobile)

### PWA Features
- Service Worker for offline caching
- Web App Manifest for installation
- Responsive design for all screen sizes
- Touch-friendly interface

## 📖 Usage Guide

### Getting Started
1. **Log your first weight**: Go to Weight tab → Enter weight → Add notes (optional) → Save
2. **Log your first workout**: Go to Workouts tab → Add New Workout → Select type → Add exercises → Save
3. **View progress**: Go to Charts tab → Switch between different visualizations

### Tips for Best Results
- **Consistency**: Weigh yourself at the same time each day
- **Regular logging**: Log workouts immediately after completing them
- **Use notes**: Add context to weight entries (morning, after workout, etc.)
- **Backup data**: Export your data regularly as backup

## 🔧 Customization

### Adding New Exercises
1. Go to Workouts → Add New Workout
2. Select "Custom Exercise" from the dropdown
3. Enter your custom exercise name
4. Add sets and reps as usual

### Modifying Exercise Lists
Edit the exercise arrays in `src/components/WorkoutLogger.js`:
- `gymExercises` - Gym workout exercises
- `homeExercises` - Home workout exercises  
- `kettlebellExercises` - Kettlebell workout exercises

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

If you encounter any issues:

1. **Check browser compatibility** - Use a modern browser
2. **Clear browser cache** - Refresh the page
3. **Enable JavaScript** - Required for app functionality
4. **Check localStorage** - Ensure not in private/incognito mode

## 🎯 Roadmap

- [ ] Exercise video demonstrations
- [ ] Workout templates and routines
- [ ] Progress photos
- [ ] Goal setting and tracking
- [ ] Social sharing features
- [ ] Advanced analytics and insights

---

**Enjoy your fitness journey!** 💪

This app is designed to be simple, private, and effective. Start logging your data today and watch your progress unfold through beautiful charts and insights.

