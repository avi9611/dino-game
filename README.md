# Network-Aware Dino Game

A React application that automatically shows a Chrome-style dinosaur game when there's a network error or when you're offline.

## Features

- 🦕 **Classic Dino Game**: Jump over obstacles in a retro-style game
- 📡 **Automatic Network Detection**: Detects when you're offline and shows the game
- 🎮 **Multiple Controls**: Use Space, Up Arrow, or click to jump
- 📱 **Mobile Friendly**: Works on touch devices
- 🏆 **Score Tracking**: Keeps track of current and high scores
- ⚡ **Progressive Difficulty**: Game speed increases over time
- 🎨 **Beautiful UI**: Modern design with glassmorphism effects

## How It Works

1. **Online Mode**: When connected to the internet, you'll see a welcome screen with a button to simulate a network error
2. **Offline Mode**: When disconnected, the dino game automatically appears
3. **Network Detection**: The app continuously monitors your connection status
4. **Game Features**:
   - Jump over obstacles using Space, Up Arrow, or click
   - Score increases as you survive longer
   - Game speed increases every 500 points
   - High score is saved locally

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone or download this project
2. Navigate to the project directory:

   ```bash
   cd my-react-app
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open your browser and go to `http://localhost:5173`

## How to Test

### Method 1: Simulate Network Error

1. Click the "🦖 Simulate Network Error & Play Dino Game" button
2. The game will appear immediately

### Method 2: Disconnect Internet

1. Disconnect your internet connection
2. The game will automatically appear
3. Reconnect to return to the main screen

### Method 3: Use Browser DevTools

1. Open browser DevTools (F12)
2. Go to Network tab
3. Check "Offline" to simulate no connection
4. The game will appear automatically

## Game Controls

- **Space Bar**: Jump
- **Up Arrow**: Jump
- **Mouse Click**: Jump (on the game area)
- **Touch**: Tap to jump (on mobile devices)

## Technical Details

- **Framework**: React 19 with Vite
- **Network Detection**: Custom hook using `navigator.onLine` and periodic connectivity tests
- **Game Engine**: Custom implementation using React hooks and `requestAnimationFrame`
- **Styling**: CSS with glassmorphism effects and responsive design
- **State Management**: React hooks for local state

## File Structure

```
src/
├── components/
│   ├── DinoGame.jsx      # Main game component
│   └── DinoGame.css      # Game styling
├── hooks/
│   └── useNetworkStatus.js # Network detection hook
├── App.jsx               # Main app component
├── App.css               # App styling
└── main.jsx              # App entry point
```

## Customization

You can customize the game by modifying:

- **Game Speed**: Change the `gameSpeed` variable in `DinoGame.jsx`
- **Jump Height**: Modify `JUMP_HEIGHT` constant
- **Obstacle Frequency**: Adjust the obstacle generation timing
- **Visual Style**: Update colors and animations in the CSS files
- **Network Test URL**: Change the test URL in `useNetworkStatus.js`

## Browser Compatibility

- Chrome/Chromium (recommended)
- Firefox
- Safari
- Edge

## License

This project is open source and available under the MIT License.

## Contributing

Feel free to submit issues and enhancement requests!
