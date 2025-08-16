import { useState, useEffect, useRef, useCallback } from "react";
import "./DinoGame.css";

const DinoGame = ({ onGameOver, fullscreen = false }) => {
  const [gameState, setGameState] = useState("ready");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [dinoY, setDinoY] = useState(0);
  const [isJumping, setIsJumping] = useState(false);
  const [obstacles, setObstacles] = useState([]);
  const [gameSpeed, setGameSpeed] = useState(0.05); // Start much slower

  const gameRef = useRef(null);
  const animationRef = useRef(null);
  const lastObstacleTime = useRef(0);

  // Game constants
  const GAME_HEIGHT = fullscreen ? 400 : 200;
  const DINO_SIZE = fullscreen ? 45 : 30;
  const OBSTACLE_WIDTH = fullscreen ? 30 : 20;
  const OBSTACLE_HEIGHT = fullscreen ? 45 : 30;
  const GROUND_Y = GAME_HEIGHT - DINO_SIZE;
  const JUMP_HEIGHT = fullscreen ? 180 : 120;
  const JUMP_DURATION = 500;

  // Handle keyboard input
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault();
        if (gameState === "ready") {
          startGame();
        } else if (gameState === "playing" && !isJumping) {
          jump();
        } else if (gameState === "gameOver") {
          resetGame();
        }
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [gameState, isJumping]);

const startGame = useCallback(() => {
  setGameState("playing");
  setScore(0);
  setObstacles([]);
  setDinoY(0);
  setIsJumping(false);
  setGameSpeed(0.15); // Lower initial speed
  lastObstacleTime.current = Date.now();
}, []);

const resetGame = useCallback(() => {
  if (score > highScore) setHighScore(score);
  setGameState("ready");
  setScore(0);
  setObstacles([]);
  setDinoY(0);
  setIsJumping(false);
  setGameSpeed(0.15); // Lower initial speed
  lastObstacleTime.current = Date.now();
}, [score, highScore]);

  const jump = useCallback(() => {
    if (!isJumping) {
      setIsJumping(true);
      const jumpStartTime = Date.now();

      const jumpAnimation = () => {
        const elapsed = Date.now() - jumpStartTime;
        const progress = elapsed / JUMP_DURATION;

        if (progress < 1) {
          const jumpProgress = Math.sin(progress * Math.PI);
          setDinoY(JUMP_HEIGHT * jumpProgress);
          requestAnimationFrame(jumpAnimation);
        } else {
          setDinoY(0);
          setIsJumping(false);
        }
      };

      jumpAnimation();
    }
  }, [isJumping, JUMP_HEIGHT, JUMP_DURATION]);

  const gameOver = useCallback(() => {
    setGameState("gameOver");
    if (onGameOver) {
      onGameOver(score);
    }
  }, [onGameOver, score]);

const gameLoop = useCallback(() => {
  if (gameState !== "playing") return;
  const currentTime = Date.now();

  setScore(prev => {
    const newScore = prev + 1;
    // Slowly increase game speed
    if (newScore % 300 === 0 && newScore !== 0 && gameSpeed < 6) {
      setGameSpeed(gs => gs + 0.015);
    }
    return newScore;
  });

  setObstacles(prevObstacles => {
    let updatedObstacles = prevObstacles
      .map((ob) => ({ ...ob, x: ob.x - gameSpeed * (fullscreen ? 8 : 6) }))
      .filter((ob) => ob.x > -OBSTACLE_WIDTH);

    // More frequent obstacles
    const spawnProbability = 0.03 + gameSpeed * 0.1;
    if (Math.random() < spawnProbability || updatedObstacles.length === 0) {
      if (
        updatedObstacles.length === 0 ||
        (updatedObstacles.length > 0 &&
          (fullscreen
            ? updatedObstacles[updatedObstacles.length - 1].x < 350
            : updatedObstacles[updatedObstacles.length - 1].x < 250))
      ) {
        const newObstacle = {
          id: currentTime + Math.random(),
          x: fullscreen ? 700 : 500,
          y: 0,
        };
        updatedObstacles = [...updatedObstacles, newObstacle];
        lastObstacleTime.current = currentTime;
      }
    }

    // Check collisions
    const dinoRect = {
      x: fullscreen ? 75 : 50,
      y: dinoY,
      width: DINO_SIZE,
      height: DINO_SIZE,
    };

    const collision = updatedObstacles.some((obstacle) => {
      const obstacleRect = {
        x: obstacle.x,
        y: 0,
        width: OBSTACLE_WIDTH - 8, // Narrower obstacle hitbox
        height: OBSTACLE_HEIGHT - 18, // Much shorter for easier jump
      };

      // Only check collision if dino is on the ground (not jumping above obstacle)
      const isDinoOnGround = dinoY < 10;
      return (
        isDinoOnGround &&
        dinoRect.x < obstacleRect.x + obstacleRect.width &&
        dinoRect.x + dinoRect.width > obstacleRect.x &&
        dinoRect.y < obstacleRect.y + obstacleRect.height &&
        dinoRect.y + dinoRect.height > obstacleRect.y
      );
    });

    if (collision) {
      gameOver();
      return prevObstacles; // Don't update obstacles if game over
    }

    return updatedObstacles;
  });

  animationRef.current = requestAnimationFrame(gameLoop);
}, [
  gameState,
  gameSpeed,
  dinoY,
  fullscreen,
  OBSTACLE_WIDTH,
  OBSTACLE_HEIGHT,
  DINO_SIZE,
  gameOver,
]);

  // Start game loop when playing
  useEffect(() => {
    if (gameState === "playing") {
      animationRef.current = requestAnimationFrame(gameLoop);
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameState]);

  const handleClick = useCallback(() => {
    if (gameState === "ready") {
      startGame();
    } else if (gameState === "playing" && !isJumping) {
      jump();
    } else if (gameState === "gameOver") {
      resetGame();
    }
  }, [gameState, isJumping, startGame, jump, resetGame]);

  return (
    <div className={`dino-game-container ${fullscreen ? "fullscreen" : ""}`}>
      <div className="game-info">
        <div className="score">Score: {score}</div>
        {gameState === "gameOver" && (
          <button className="try-again-btn" onClick={resetGame}>
            Try Again
          </button>
        )}
        <div className="high-score">High Score: {highScore}</div>
      </div>

      <div
        ref={gameRef}
        className="game-area"
        onClick={handleClick}
        style={{ height: GAME_HEIGHT }}
      >
        {/* Dino */}
        <div
          className="dino"
          style={{
            bottom: dinoY,
            left: fullscreen ? 75 : 50,
            width: DINO_SIZE,
            height: DINO_SIZE,
          }}
        />

        {/* Obstacles */}
        {obstacles.map((obstacle) => (
          <div
            key={obstacle.id}
            className="obstacle"
            style={{
              left: obstacle.x,
              bottom: obstacle.y,
              width: OBSTACLE_WIDTH,
              height: OBSTACLE_HEIGHT,
            }}
          />
        ))}

        {/* Ground */}
        <div className="ground" style={{ bottom: 0 }} />

        {/* Game state overlay */}
        {gameState === "ready" && (
          <div className="game-overlay">
            <h2>Press SPACE or CLICK to start</h2>
            <p>Jump over the obstacles!</p>
          </div>
        )}

        {gameState === "gameOver" && (
          <div className="game-overlay">
            <h2>Game Over!</h2>
            <p>Score: {score}</p>
            <p>Press SPACE or CLICK to restart</p>
          </div>
        )}
      </div>

    </div>
  );
};

// Move instructions outside the main component
export const GameInstructions = () => (
  <div className="game-instructions" style={{ marginTop: 16, textAlign: "center" }}>
    <p>Use SPACE, UP ARROW, or CLICK to jump</p>
  </div>
);

export default DinoGame;
