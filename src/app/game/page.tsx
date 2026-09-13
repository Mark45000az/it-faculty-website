"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import styles from "./page.module.css";

interface Score {
  id: number;
  nickname: string;
  score: number;
  created_at: string;
}

type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";

const CANVAS_SIZE = 400;
const CELL_SIZE = 20;
const GRID_SIZE = CANVAS_SIZE / CELL_SIZE; // 20x20

export default function GamePage() {
  // Game states
  const [gameState, setGameState] = useState<"login" | "playing" | "gameover">("login");
  const [nickname, setNickname] = useState("");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [leaderboard, setLeaderboard] = useState<Score[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scoreSubmitted, setScoreSubmitted] = useState(false);

  // Game logic refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameLoopRef = useRef<number | null>(null);
  const snakeRef = useRef<{ x: number; y: number }[]>([{ x: 10, y: 10 }]);
  const directionRef = useRef<Direction>("RIGHT");
  const foodRef = useRef<{ x: number; y: number }>({ x: 15, y: 10 });
  const scoreRef = useRef(0);
  const speedRef = useRef(150);

  // Fetch leaderboard
  const fetchLeaderboard = useCallback(async () => {
    try {
      const res = await fetch("/api/scores");
      const data = await res.json();
      if (data.scores) {
        setLeaderboard(data.scores);
      }
    } catch (err) {
      console.error("Failed to fetch leaderboard:", err);
    }
  }, []);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  // Spawn food at random position
  const spawnFood = useCallback(() => {
    const snake = snakeRef.current;
    let newFood: { x: number; y: number };
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (snake.some((s) => s.x === newFood.x && s.y === newFood.y));
    foodRef.current = newFood;
  }, []);

  // Draw game
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Background
    ctx.fillStyle = "#0a1628";
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Grid lines
    ctx.strokeStyle = "rgba(255, 255, 255, 0.03)";
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * CELL_SIZE, 0);
      ctx.lineTo(i * CELL_SIZE, CANVAS_SIZE);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * CELL_SIZE);
      ctx.lineTo(CANVAS_SIZE, i * CELL_SIZE);
      ctx.stroke();
    }

    // Border walls (visible glowing boundary)
    ctx.shadowColor = "#ef4444";
    ctx.shadowBlur = 6;
    ctx.strokeStyle = "rgba(239, 68, 68, 0.7)";
    ctx.lineWidth = 3;
    ctx.strokeRect(1.5, 1.5, CANVAS_SIZE - 3, CANVAS_SIZE - 3);
    ctx.shadowBlur = 0;

    // Corner markers
    const cornerSize = 12;
    ctx.fillStyle = "rgba(239, 68, 68, 0.5)";
    ctx.fillRect(0, 0, cornerSize, cornerSize);
    ctx.fillRect(CANVAS_SIZE - cornerSize, 0, cornerSize, cornerSize);
    ctx.fillRect(0, CANVAS_SIZE - cornerSize, cornerSize, cornerSize);
    ctx.fillRect(CANVAS_SIZE - cornerSize, CANVAS_SIZE - cornerSize, cornerSize, cornerSize);

    // Food (golden glow)
    const food = foodRef.current;
    ctx.shadowColor = "#f4b51b";
    ctx.shadowBlur = 12;
    ctx.fillStyle = "#f4b51b";
    ctx.beginPath();
    ctx.arc(
      food.x * CELL_SIZE + CELL_SIZE / 2,
      food.y * CELL_SIZE + CELL_SIZE / 2,
      CELL_SIZE / 2 - 2,
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.shadowBlur = 0;

    // Snake
    const snake = snakeRef.current;
    snake.forEach((segment, index) => {
      const isHead = index === 0;
      const alpha = 1 - (index / snake.length) * 0.5;

      if (isHead) {
        // Head - brighter
        ctx.shadowColor = "#4ade80";
        ctx.shadowBlur = 8;
        ctx.fillStyle = "#4ade80";
      } else {
        ctx.shadowBlur = 0;
        ctx.fillStyle = `rgba(74, 222, 128, ${alpha})`;
      }

      const padding = isHead ? 1 : 2;
      const radius = isHead ? 5 : 3;

      // Rounded rectangle for each segment
      const x = segment.x * CELL_SIZE + padding;
      const y = segment.y * CELL_SIZE + padding;
      const w = CELL_SIZE - padding * 2;
      const h = CELL_SIZE - padding * 2;

      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + w - radius, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
      ctx.lineTo(x + w, y + h - radius);
      ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
      ctx.lineTo(x + radius, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.closePath();
      ctx.fill();

      // Eyes on head
      if (isHead) {
        ctx.shadowBlur = 0;
        ctx.fillStyle = "#0a1628";
        const dir = directionRef.current;
        let eye1x: number, eye1y: number, eye2x: number, eye2y: number;
        const cx = segment.x * CELL_SIZE + CELL_SIZE / 2;
        const cy = segment.y * CELL_SIZE + CELL_SIZE / 2;

        if (dir === "RIGHT") {
          eye1x = cx + 4; eye1y = cy - 4;
          eye2x = cx + 4; eye2y = cy + 4;
        } else if (dir === "LEFT") {
          eye1x = cx - 4; eye1y = cy - 4;
          eye2x = cx - 4; eye2y = cy + 4;
        } else if (dir === "UP") {
          eye1x = cx - 4; eye1y = cy - 4;
          eye2x = cx + 4; eye2y = cy - 4;
        } else {
          eye1x = cx - 4; eye1y = cy + 4;
          eye2x = cx + 4; eye2y = cy + 4;
        }

        ctx.beginPath();
        ctx.arc(eye1x, eye1y, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(eye2x, eye2y, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    ctx.shadowBlur = 0;

    // Score overlay
    ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
    ctx.font = "bold 14px 'Inter', sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(`🏆 ${scoreRef.current}`, 10, 20);
  }, []);

  // Game tick
  const gameTick = useCallback(() => {
    const snake = [...snakeRef.current];
    const head = { ...snake[0] };
    const dir = directionRef.current;

    // Move head
    if (dir === "UP") head.y -= 1;
    else if (dir === "DOWN") head.y += 1;
    else if (dir === "LEFT") head.x -= 1;
    else if (dir === "RIGHT") head.x += 1;

    // Wall collision
    if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
      setGameState("gameover");
      return;
    }

    // Self collision
    if (snake.some((s) => s.x === head.x && s.y === head.y)) {
      setGameState("gameover");
      return;
    }

    snake.unshift(head);

    // Eat food
    const food = foodRef.current;
    if (head.x === food.x && head.y === food.y) {
      scoreRef.current += 10;
      setScore(scoreRef.current);
      if (scoreRef.current > highScore) {
        setHighScore(scoreRef.current);
      }
      spawnFood();
      // Speed up (min 60ms)
      speedRef.current = Math.max(60, 150 - Math.floor(scoreRef.current / 50) * 10);
    } else {
      snake.pop();
    }

    snakeRef.current = snake;
    draw();
  }, [draw, spawnFood, highScore]);

  // Game loop
  const startGameLoop = useCallback(() => {
    const loop = () => {
      gameTick();
      gameLoopRef.current = window.setTimeout(loop, speedRef.current);
    };
    loop();
  }, [gameTick]);

  // Start game
  const startGame = () => {
    if (!nickname.trim()) return;

    // Reset
    snakeRef.current = [{ x: 10, y: 10 }];
    directionRef.current = "RIGHT";
    scoreRef.current = 0;
    speedRef.current = 150;
    setScore(0);
    setScoreSubmitted(false);
    spawnFood();
    setGameState("playing");
  };

  // Start game loop when playing
  useEffect(() => {
    if (gameState === "playing") {
      draw();
      startGameLoop();
      return () => {
        if (gameLoopRef.current) {
          clearTimeout(gameLoopRef.current);
        }
      };
    }
  }, [gameState, draw, startGameLoop]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== "playing") return;

      const dir = directionRef.current;
      switch (e.key) {
        case "ArrowUp":
        case "w":
        case "W":
          e.preventDefault();
          if (dir !== "DOWN") directionRef.current = "UP";
          break;
        case "ArrowDown":
        case "s":
        case "S":
          e.preventDefault();
          if (dir !== "UP") directionRef.current = "DOWN";
          break;
        case "ArrowLeft":
        case "a":
        case "A":
          e.preventDefault();
          if (dir !== "RIGHT") directionRef.current = "LEFT";
          break;
        case "ArrowRight":
        case "d":
        case "D":
          e.preventDefault();
          if (dir !== "LEFT") directionRef.current = "RIGHT";
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameState]);

  // Submit score
  const submitScore = async () => {
    if (scoreSubmitted || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await fetch("/api/scores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nickname: nickname.trim(), score }),
      });
      setScoreSubmitted(true);
      await fetchLeaderboard();
    } catch (err) {
      console.error("Failed to submit score:", err);
    }
    setIsSubmitting(false);
  };

  // Auto-submit on game over
  useEffect(() => {
    if (gameState === "gameover" && score > 0 && !scoreSubmitted) {
      submitScore();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState]);

  // Touch controls for mobile
  const handleTouchControl = (dir: Direction) => {
    if (gameState !== "playing") return;
    const current = directionRef.current;
    if (dir === "UP" && current !== "DOWN") directionRef.current = "UP";
    if (dir === "DOWN" && current !== "UP") directionRef.current = "DOWN";
    if (dir === "LEFT" && current !== "RIGHT") directionRef.current = "LEFT";
    if (dir === "RIGHT" && current !== "LEFT") directionRef.current = "RIGHT";
  };

  return (
    <div className={styles.container}>
      {/* Page Hero */}
      <section className={styles.pageHero}>
        <div className={styles.heroContent}>
          <span className={styles.heroTag}>🎮 MINI GAME</span>
          <h1 className={styles.title}>Snake Game</h1>
          <p className={styles.subtitle}>เกมงูคลาสสิก — กินอาหาร สะสมคะแนน ท้าชิงอันดับ!</p>
        </div>
        <div className={styles.heroWave}>
          <svg viewBox="0 0 1440 100" preserveAspectRatio="none">
            <path d="M0,40L80,44C160,48,320,56,480,56C640,56,800,48,960,44C1120,40,1280,40,1360,40L1440,40L1440,100L0,100Z" fill="var(--surface-soft)" />
          </svg>
        </div>
      </section>

      <div className={styles.content}>
        <div className={styles.gameLayout}>
          {/* Left: Game Area */}
          <div className={styles.gameArea}>
            {/* Login Screen */}
            {gameState === "login" && (
              <div className={styles.loginCard}>
                <div className={styles.loginIcon}>🐍</div>
                <h2>เข้าร่วมเกม</h2>
                <p>กรอกชื่อเล่นของคุณเพื่อเริ่มเล่นและบันทึกคะแนน</p>
                <input
                  type="text"
                  placeholder="ชื่อเล่น (Nickname)"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && startGame()}
                  className={styles.nicknameInput}
                  maxLength={50}
                />
                <button
                  onClick={startGame}
                  className={styles.playButton}
                  disabled={!nickname.trim()}
                >
                  🎮 เริ่มเล่นเลย!
                </button>
              </div>
            )}

            {/* Game Canvas */}
            {(gameState === "playing" || gameState === "gameover") && (
              <div className={styles.canvasWrapper}>
                <div className={styles.scoreBar}>
                  <div className={styles.scoreItem}>
                    <span className={styles.scoreLabel}>ผู้เล่น</span>
                    <span className={styles.scoreValue}>{nickname}</span>
                  </div>
                  <div className={styles.scoreItem}>
                    <span className={styles.scoreLabel}>คะแนน</span>
                    <span className={styles.scoreValue}>{score}</span>
                  </div>
                  <div className={styles.scoreItem}>
                    <span className={styles.scoreLabel}>สูงสุด</span>
                    <span className={styles.scoreValue}>{highScore}</span>
                  </div>
                </div>

                <div className={styles.canvasContainer}>
                  <canvas
                    ref={canvasRef}
                    width={CANVAS_SIZE}
                    height={CANVAS_SIZE}
                    className={styles.canvas}
                  />

                  {/* Game Over Overlay */}
                  {gameState === "gameover" && (
                    <div className={styles.gameOverOverlay}>
                      <div className={styles.gameOverCard}>
                        <span className={styles.gameOverIcon}>💀</span>
                        <h3>Game Over!</h3>
                        <p className={styles.finalScore}>คะแนนของคุณ: <strong>{score}</strong></p>
                        {scoreSubmitted && (
                          <p className={styles.savedMsg}>✅ บันทึกคะแนนแล้ว!</p>
                        )}
                        <div className={styles.gameOverActions}>
                          <button onClick={startGame} className={styles.retryButton}>
                            🔄 เล่นอีกครั้ง
                          </button>
                          <button
                            onClick={() => { setGameState("login"); setNickname(""); }}
                            className={styles.backButton}
                          >
                            เปลี่ยนชื่อ
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Mobile Touch Controls */}
                <div className={styles.touchControls}>
                  <div className={styles.touchRow}>
                    <button className={styles.touchBtn} onTouchStart={() => handleTouchControl("UP")} onClick={() => handleTouchControl("UP")}>▲</button>
                  </div>
                  <div className={styles.touchRow}>
                    <button className={styles.touchBtn} onTouchStart={() => handleTouchControl("LEFT")} onClick={() => handleTouchControl("LEFT")}>◀</button>
                    <button className={styles.touchBtn} onTouchStart={() => handleTouchControl("DOWN")} onClick={() => handleTouchControl("DOWN")}>▼</button>
                    <button className={styles.touchBtn} onTouchStart={() => handleTouchControl("RIGHT")} onClick={() => handleTouchControl("RIGHT")}>▶</button>
                  </div>
                </div>

                <div className={styles.controlHint}>
                  ใช้ปุ่มลูกศร ⬆⬇⬅➡ หรือ WASD ในการบังคับทิศทาง
                </div>
              </div>
            )}
          </div>

          {/* Right: Leaderboard */}
          <div className={styles.leaderboardCard}>
            <h3 className={styles.leaderboardTitle}>🏆 Leaderboard — Top 10</h3>
            {leaderboard.length > 0 ? (
              <div className={styles.leaderboardList}>
                {leaderboard.map((entry, index) => (
                  <div
                    key={entry.id}
                    className={`${styles.leaderboardRow} ${index < 3 ? styles.topThree : ""}`}
                  >
                    <span className={styles.rank}>
                      {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `#${index + 1}`}
                    </span>
                    <span className={styles.playerName}>{entry.nickname}</span>
                    <span className={styles.playerScore}>{entry.score}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.emptyLeaderboard}>
                <span>🎯</span>
                <p>ยังไม่มีคะแนน — เป็นคนแรกที่ทำลายสถิติ!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
