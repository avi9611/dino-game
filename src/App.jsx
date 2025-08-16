import { useState, useEffect } from "react";
import "./App.css";
import DinoGame from "./components/DinoGame";
import useNetworkStatus from "./hooks/useNetworkStatus";

function App() {
  const { isOnline, showDinoGame, simulateNetworkError, clearNetworkError } =
    useNetworkStatus();
  const [lastScore, setLastScore] = useState(0);

  // Add/remove fullscreen classes to body and root
  useEffect(() => {
    if (showDinoGame) {
      document.body.classList.add("fullscreen-mode");
      document.getElementById("root").classList.add("fullscreen-mode");
    } else {
      document.body.classList.remove("fullscreen-mode");
      document.getElementById("root").classList.remove("fullscreen-mode");
    }

    // Cleanup on unmount
    return () => {
      document.body.classList.remove("fullscreen-mode");
      document.getElementById("root").classList.remove("fullscreen-mode");
    };
  }, [showDinoGame]);

  const handleGameOver = (score) => {
    setLastScore(score);
  };

  return (
    <div className={`App ${showDinoGame ? "network-error-mode" : ""}`}>
      <header className="app-header">
        <h1>Network-Aware Dino Game</h1>
        <div className="network-status">
          <span
            className={`status-indicator ${isOnline ? "online" : "offline"}`}
          >
            {isOnline ? "🟢 Online" : "🔴 Offline"}
          </span>
        </div>
      </header>

      <main className="app-main">
        {showDinoGame ? (
          <div className="network-error-container">
            <div className="error-message">
              <h2>No Internet Connection</h2>
              <p>
                You're offline! Enjoy the dinosaur game while you wait for the
                connection to return.
              </p>
              {lastScore > 0 && (
                <p className="last-score">Last Score: {lastScore}</p>
              )}
            </div>
            <DinoGame onGameOver={handleGameOver} fullscreen={true} />
            <button className="retry-button" onClick={clearNetworkError}>
              Try Again
            </button>
          </div>
        ) : (
          <div className="online-content">
            <div className="welcome-message">
              <h2>Welcome! You're Online</h2>
              <p>Your internet connection is working properly.</p>
              <p>
                Try disconnecting your internet or click the button below to
                test the dino game!
              </p>
            </div>

            <div className="demo-controls">
              <button className="demo-button" onClick={simulateNetworkError}>
                🦖 Simulate Network Error & Play Dino Game
              </button>
            </div>

            <div className="features">
              <h3>Features:</h3>
              <ul>
                <li>🦕 Classic dinosaur jumping game</li>
                <li>📡 Automatic network detection</li>
                <li>🎮 Keyboard controls (Space/Up Arrow)</li>
                <li>📱 Click to jump on mobile</li>
                <li>🏆 High score tracking</li>
                <li>⚡ Increasing difficulty</li>
                <li>🖥️ Fullscreen mode when offline</li>
              </ul>
            </div>
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>
          Built with React • Network Status:{" "}
          {isOnline ? "Connected" : "Disconnected"}
        </p>
      </footer>
    </div>
  );
}

export default App;
