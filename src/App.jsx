import { useState, useEffect } from "react";
import "./App.css";
import DinoGame from "./components/DinoGame";
import useNetworkStatus from "./hooks/useNetworkStatus";

function App() {
  const { isOnline, showDinoGame, simulateNetworkError, clearNetworkError } =
    useNetworkStatus();
  const [lastScore, setLastScore] = useState(0);

  useEffect(() => {
    const root = document.getElementById("root");
    if (showDinoGame) {
      document.body.classList.add("fullscreen-mode");
      root.classList.add("fullscreen-mode");
    } else {
      document.body.classList.remove("fullscreen-mode");
      root.classList.remove("fullscreen-mode");
    }
    return () => {
      document.body.classList.remove("fullscreen-mode");
      root.classList.remove("fullscreen-mode");
    };
  }, [showDinoGame]);

  return (
    <div className={`App ${showDinoGame ? "network-error-mode" : ""}`}>
      <header className="app-header">
        <h1>Dino Game (Network Test)</h1>
        <span className={`status ${isOnline ? "online" : "offline"}`}>
          {isOnline ? "Online" : "Offline"}
        </span>
      </header>

      <main className="app-main">
        {showDinoGame ? (
          <div className="dino-wrapper">
            <h2>No Internet Connection</h2>
            <p>You are offline. Play the game while waiting to reconnect.</p>
            {lastScore > 0 && <p className="last-score">Last Score: {lastScore}</p>}

            <DinoGame onGameOver={setLastScore} fullscreen={true} />

            <button className="action-btn" onClick={clearNetworkError}>
              Retry Connection
            </button>
          </div>
        ) : (
          <div className="online-wrapper">
            <h2>Connected</h2>
            <p>Your internet connection is active.</p>
            <button className="action-btn secondary" onClick={simulateNetworkError}>
              Test Dino Game (Simulate Offline)
            </button>
          </div>
        )}
      </main>

      <footer className="app-footer">
        <small>
          React • Network Status: {isOnline ? "Connected" : "Disconnected"}
        </small>
      </footer>
    </div>
  );
}

export default App;
