# 🍅 Pomodoro Pro - Next-Gen Productivity Timer

A modern, feature-rich Pomodoro timer built with React, TypeScript, and cutting-edge web technologies. Transform your productivity with intelligent task management, advanced analytics, and a beautiful, customizable interface.

![Pomodoro Pro](https://img.shields.io/badge/Version-2.0.0-purple) ![React](https://img.shields.io/badge/React-18.3.1-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.6.2-blue) ![PWA](https://img.shields.io/badge/PWA-Enabled-green)

## ✨ Features

### 🎯 Core Timer Features
- **Smart Timer**: 25-minute work sessions with customizable break intervals
- **Visual Progress**: Beautiful circular progress bar with smooth animations
- **Session Tracking**: Automatic work/break cycle management
- **Audio Alerts**: Customizable sound notifications for session completion
- **Vibration Support**: Mobile device vibration for session alerts

### 📱 Progressive Web App (PWA)
- **Installable**: Add to home screen on any device
- **Offline Support**: Works without internet connection
- **Background Sync**: Syncs data when connection is restored
- **App-like Experience**: Full-screen, standalone app experience

### 🎨 Modern UI/UX
- **Dynamic Themes**: Light, dark, and system theme support
- **Color Schemes**: 5 beautiful color schemes (Blue, Purple, Green, Orange, Red)
- **Smooth Animations**: Framer Motion powered transitions
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **Glass Morphism**: Modern frosted glass design elements

### ✅ Task Management
- **Smart Tasks**: Create and manage tasks with pomodoro estimates
- **Priority Levels**: High, medium, and low priority task organization
- **Progress Tracking**: Visual progress bars for each task
- **Current Focus**: Set active task for focused work sessions
- **Task Analytics**: Track completion rates and productivity patterns

### 📊 Advanced Analytics
- **Session Statistics**: Track completed, incomplete, and total sessions
- **Time Tracking**: Monitor total focus time and break time
- **Performance Metrics**: Calculate completion percentage and productivity trends
- **Visual Charts**: Beautiful data visualization with progress indicators

### 🔔 Smart Notifications
- **Desktop Notifications**: System-level notifications for session alerts
- **Permission Management**: Graceful permission request handling
- **Customizable Alerts**: Enable/disable different notification types
- **Cross-Platform**: Works on desktop and mobile devices

### 💾 Data Persistence
- **Redux Persist**: Automatic state persistence across sessions
- **Local Storage**: Secure local data storage
- **Settings Sync**: All preferences saved automatically
- **Offline Data**: Analytics and tasks work offline

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/pomodoro-pro.git
   cd pomodoro-pro
   ```

2. **Run the installation script**
   ```bash
   chmod +x install.sh
   ./install.sh
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Visit `http://localhost:3000`

### Manual Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🛠️ Technologies Used

### Frontend
- **React 18.3.1** - Modern React with hooks and concurrent features
- **TypeScript 5.6.2** - Type-safe JavaScript development
- **Vite** - Lightning-fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Production-ready motion library

### State Management
- **Redux Toolkit** - Modern Redux with less boilerplate
- **React Redux** - Official React bindings for Redux
- **Redux Persist** - Persist and rehydrate Redux store

### UI Components
- **Radix UI** - Unstyled, accessible UI primitives
- **Shadcn UI** - Beautiful, accessible component library
- **Lucide React** - Beautiful & consistent icon toolkit
- **FontAwesome** - Icon library and toolkit

### PWA & Performance
- **Vite PWA Plugin** - PWA support with Workbox
- **Service Workers** - Offline functionality and caching
- **Web App Manifest** - App installation and metadata

### Development Tools
- **ESLint** - Code linting and formatting
- **TypeScript ESLint** - TypeScript-specific linting rules
- **PostCSS** - CSS processing and optimization

## 📱 PWA Installation

### Desktop (Chrome/Edge)
1. Visit the app in your browser
2. Click the install button in the address bar
3. Follow the installation prompts

### Mobile (iOS/Android)
1. Open the app in Safari (iOS) or Chrome (Android)
2. Tap the share button
3. Select "Add to Home Screen"
4. The app will be installed like a native app

## 🎨 Customization

### Themes
- **Light Mode**: Clean, bright interface
- **Dark Mode**: Easy-on-the-eyes dark theme
- **System**: Automatically follows your OS theme

### Color Schemes
- **Blue**: Professional and calming
- **Purple**: Creative and inspiring
- **Green**: Fresh and energizing
- **Orange**: Warm and motivating
- **Red**: Bold and attention-grabbing

### Timer Settings
- **Work Duration**: 1-60 minutes (default: 25)
- **Break Duration**: 1-30 minutes (default: 5)
- **Long Break**: Optional extended break after multiple sessions

## 📊 Analytics Dashboard

Track your productivity with comprehensive analytics:

- **Completed Sessions**: Total work sessions finished
- **Focus Time**: Total productive time spent
- **Break Time**: Total rest and recovery time
- **Incomplete Sessions**: Sessions that were interrupted
- **Performance Rate**: Completion percentage over time

## 🔧 Development

### Project Structure
```
src/
├── app/                 # Redux store configuration
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components
│   └── EnhancedTimer.tsx
├── features/           # Feature-based Redux slices
│   ├── analytics/      # Analytics state management
│   ├── settings/       # Settings state management
│   ├── tasks/          # Task management
│   ├── theme/          # Theme management
│   └── notifications/  # Notification settings
├── lib/                # Utility functions
├── routes/             # Page components
└── main.tsx           # Application entry point
```

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 🌟 Key Features in Detail

### Smart Task Management
- Create tasks with estimated pomodoro counts
- Set priority levels (high, medium, low)
- Track progress with visual indicators
- Set current focus task for sessions
- Filter and search through tasks

### Advanced Timer
- Smooth circular progress animation
- Real-time session tracking
- Automatic work/break cycling
- Session count display
- Quick stats overview

### Beautiful Analytics
- Card-based metric display
- Color-coded performance indicators
- Progress bars for completion rates
- Responsive grid layout
- Smooth animations

### PWA Capabilities
- Offline functionality
- App-like installation
- Background sync
- Push notifications (when supported)
- Responsive design

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/pomodoro-pro/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/pomodoro-pro/discussions)
- **Email**: support@pomodoropro.dev

## 🙏 Acknowledgments

- Pomodoro Technique by Francesco Cirillo
- React and TypeScript communities
- Open source contributors
- Design inspiration from modern productivity apps

---

**Made with ❤️ for productivity enthusiasts**

*Transform your work habits with Pomodoro Pro - the next generation of productivity tools.*
