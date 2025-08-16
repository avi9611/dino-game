import { useState, useEffect, useRef, useCallback } from "react";
import "./DinoGame.css";

const DinoGame = ({ onGameOver, fullscreen = false }) => {
  const [gameState, setGameState] = useState("ready");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [dinoY, setDinoY] = useState(0);
  const [isJumping, setIsJumping] = useState(false);
  const [obstacles, setObstacles] = useState([]);
  const [gameSpeed, setGameSpeed] = useState(4); 
  const [collisionDetected, setCollisionDetected] = useState(false);

  const animationRef = useRef(null);

  // Game constants
  const GAME_HEIGHT = fullscreen ? 400 : 200;
  const GAME_WIDTH = fullscreen ? 800 : 600;
  const DINO_SIZE = fullscreen ? 50 : 35;
  const OBSTACLE_WIDTH = fullscreen ? 35 : 25;
  const OBSTACLE_HEIGHT = fullscreen ? 50 : 30;
  const GROUND_Y = 0;
  const JUMP_HEIGHT = fullscreen ? 160 : 100;
  const JUMP_DURATION = 600;

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
    setGameSpeed(4);
  }, []);

  const resetGame = useCallback(() => {
    if (score > highScore) setHighScore(score);
    setGameState("ready");
    setScore(0);
    setObstacles([]);
    setDinoY(0);
    setIsJumping(false);
    setGameSpeed(4);
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
  }, [isJumping]);

  const gameOver = useCallback(() => {
    setGameState("gameOver");
    if (onGameOver) onGameOver(score);
  }, [onGameOver, score]);

  const gameLoop = useCallback(() => {
    if (gameState !== "playing") return;

    setScore((prev) => {
      const newScore = prev + 1;
      // Increase difficulty gradually
      if (newScore % 200 === 0 && gameSpeed < 15) {
        setGameSpeed((gs) => gs + 0.5);
      }
      return newScore;
    });

    setObstacles((prevObstacles) => {
      let updatedObstacles = prevObstacles
        .map((ob) => ({ ...ob, x: ob.x - gameSpeed }))
        .filter((ob) => ob.x > -OBSTACLE_WIDTH);

      // Spawn new obstacle
      if (
        updatedObstacles.length === 0 ||
        updatedObstacles[updatedObstacles.length - 1].x < GAME_WIDTH - 200
      ) {
        if (Math.random() < 0.02 + gameSpeed * 0.003) {
          updatedObstacles.push({
            id: Date.now(),
            x: GAME_WIDTH,
            y: GROUND_Y,
          });
        }
      }

      // Proper collision check (bounding box overlap)
      const dinoRect = {
        x: fullscreen ? 75 : 50,
        y: dinoY,
        width: DINO_SIZE,
        height: DINO_SIZE,
      };

      const collision = updatedObstacles.some((ob) => {
        const obstacleRect = {
          x: ob.x,
          y: GROUND_Y,
          width: OBSTACLE_WIDTH,
          height: OBSTACLE_HEIGHT,
        };

        return !(
          dinoRect.x + dinoRect.width < obstacleRect.x || 
          dinoRect.x > obstacleRect.x + obstacleRect.width || 
          dinoRect.y + dinoRect.height < obstacleRect.y || 
          dinoRect.y > obstacleRect.y + obstacleRect.height 
        );
      });

      if (collision) {
        setCollisionDetected(true);
        return prevObstacles; 
      }

      return updatedObstacles;
    });

    animationRef.current = requestAnimationFrame(gameLoop);
  }, [gameState, gameSpeed, dinoY, fullscreen, gameOver]);


  useEffect(() => {
    if (gameState === "playing") {
      animationRef.current = requestAnimationFrame(gameLoop);
    }
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [gameState, gameLoop]);


  useEffect(() => {
    if (collisionDetected) {
      gameOver();
      setCollisionDetected(false);
    }
  }, [collisionDetected, gameOver]);

  // 🖱️ Handle clicks
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
        <div className="high-score">High Score: {highScore}</div>
      </div>

      <div
        className="game-area"
        onClick={handleClick}
        style={{ width: "100%" }}
      >
        {/* Dino */}
        <div
          className="dino"
          style={{
            bottom: `calc(${dinoY / (fullscreen ? 400 : 200)} * 100% )`,
            left: fullscreen ? "12%" : "8%",
            width: fullscreen ? "6.5%" : "6%",
            height: fullscreen ? "12%" : "18%",
            minWidth: 20,
            minHeight: 20,
            maxWidth: 60,
            maxHeight: 80,
          }}
        >
          <div className="dino-body">
            <div className="dino-tail"></div>
            <div className="dino-leg dino-leg-left"></div>
            <div className="dino-leg dino-leg-right"></div>
            <div className="dino-neck">
              <div className="dino-head">
                <div className="dino-eye"></div>
                <div className="dino-mouth"></div>
              </div>
            </div>
            <div className="dino-arm dino-arm-left"></div>
            <div className="dino-arm dino-arm-right"></div>
          </div>
        </div>

        {/* Obstacles */}
        {obstacles.map((ob) => (
          <div
            key={ob.id}
            className="obstacle"
            style={{
              left: `calc(${ob.x / (fullscreen ? 800 : 600)} * 100%)`,
              bottom: ob.y,
              width: fullscreen ? "4.5%" : "4%",
              height: fullscreen ? "12%" : "15%",
              minWidth: 12,
              minHeight: 20,
              maxWidth: 40,
              maxHeight: 60,
            }}
          />
        ))}

        {/* Ground */}
        <div className="ground" />

        {/* Overlay messages */}
        {gameState === "ready" && (
          <div className="game-overlay">
            <h2>Press SPACE or CLICK to Start</h2>
            <p>Jump over obstacles!</p>
          </div>
        )}
        {gameState === "gameOver" && (
          <div className="game-overlay">
            <h2>Game Over!</h2>
            <p>Score: {score}</p>
            <p>Press SPACE or CLICK to Restart</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Instructions
export const GameInstructions = () => (
  <div className="game-instructions" style={{ marginTop: 16, textAlign: "center" }}>
    <p>Use SPACE, UP ARROW, or CLICK to jump</p>
  </div>
);

export default DinoGame;
