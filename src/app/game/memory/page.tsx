"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import styles from "./page.module.css";

interface Score {
  id: string;
  nickname: string;
  score: number;
  created_at: string;
}

const ICONS = ["💻", "📱", "🔋", "⌨️", "🖱️", "🖨️", "🎧", "💾"];

export default function MemoryGamePage() {
  const [gameState, setGameState] = useState<"login" | "playing" | "gameover">("login");
  const [nickname, setNickname] = useState("");
  const [playerId, setPlayerId] = useState("");
  const [score, setScore] = useState(0);
  const [leaderboard, setLeaderboard] = useState<Score[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scoreSubmitted, setScoreSubmitted] = useState(false);

  // Game state
  const [cards, setCards] = useState<{ id: number; icon: string; isFlipped: boolean; isMatched: boolean }[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [timer, setTimer] = useState(0);
  const timerRef = useRef<number | null>(null);

  // Fetch leaderboard
  const fetchLeaderboard = useCallback(async () => {
    try {
      const res = await fetch("/api/scores?gameType=memory");
      if (!res.ok) return;
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
    
    const savedNickname = localStorage.getItem('memory_nickname') || localStorage.getItem('snake_nickname');
    if (savedNickname) {
      setNickname(savedNickname);
    }

    let savedPlayerId = localStorage.getItem('snake_player_id');
    if (!savedPlayerId) {
      savedPlayerId = crypto.randomUUID();
      localStorage.setItem('snake_player_id', savedPlayerId);
    }
    setPlayerId(savedPlayerId);
  }, [fetchLeaderboard]);

  const initGame = () => {
    const shuffledCards = [...ICONS, ...ICONS]
      .sort(() => Math.random() - 0.5)
      .map((icon, index) => ({
        id: index,
        icon,
        isFlipped: false,
        isMatched: false,
      }));
    setCards(shuffledCards);
    setFlippedIndices([]);
    setMoves(0);
    setTimer(0);
  };

  const startGame = () => {
    if (!nickname.trim()) return;
    localStorage.setItem('memory_nickname', nickname.trim());
    localStorage.setItem('snake_nickname', nickname.trim()); // Sync across games

    initGame();
    setGameState("playing");
    setScoreSubmitted(false);

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = window.setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);
  };

  const handleCardClick = (index: number) => {
    if (gameState !== "playing") return;
    if (cards[index].isFlipped || cards[index].isMatched) return;
    if (flippedIndices.length === 2) return; // Prevent clicking more than 2

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newFlippedIndices = [...flippedIndices, index];
    setFlippedIndices(newFlippedIndices);

    if (newFlippedIndices.length === 2) {
      setMoves((prev) => prev + 1);
      
      const [firstIndex, secondIndex] = newFlippedIndices;
      if (newCards[firstIndex].icon === newCards[secondIndex].icon) {
        // Match!
        newCards[firstIndex].isMatched = true;
        newCards[secondIndex].isMatched = true;
        setCards(newCards);
        setFlippedIndices([]);

        // Check win condition
        if (newCards.every(card => card.isMatched)) {
          handleGameOver();
        }
      } else {
        // No match, flip back after delay
        setTimeout(() => {
          const resetCards = [...cards];
          resetCards[firstIndex].isFlipped = false;
          resetCards[secondIndex].isFlipped = false;
          setCards(resetCards);
          setFlippedIndices([]);
        }, 1000);
      }
    }
  };

  const handleGameOver = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    
    // Calculate Score (Base 1000 - (moves * 10) - (timer * 5))
    const calculatedScore = Math.max(10, 1000 - (moves * 15) - (timer * 10));
    setScore(calculatedScore);
    setGameState("gameover");
  };

  const submitScore = async () => {
    if (scoreSubmitted || isSubmitting || !playerId) return;
    setIsSubmitting(true);
    try {
      await fetch("/api/scores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerId, gameType: 'memory', nickname: nickname.trim(), score }),
      });
      setScoreSubmitted(true);
      await fetchLeaderboard();
    } catch (err) {
      console.error("Failed to submit score:", err);
    }
    setIsSubmitting(false);
  };

  return (
    <main className={styles.gameMain}>
      <div className={styles.container}>
        <div className={styles.gameHeader}>
          <Link href="/game" className={styles.backBtn}>← กลับไปเลือกเกม</Link>
          <div className={styles.gameTitle}>
            <span className={styles.gameIcon}>🃏</span>
            <h1>IT Memory Match</h1>
          </div>
        </div>

        <div className={styles.layout}>
          {/* Game Area */}
          <div className={styles.gameCard}>
            {gameState === "login" && (
              <div className={styles.loginScreen}>
                <div className={styles.loginIcon}>🃏</div>
                <h2>เข้าร่วมเกมจับคู่</h2>
                <p>เปิดการ์ดหาคู่เครื่องมือไอที ใช้เวลาน้อยที่สุด!</p>
                <div className={styles.inputGroup}>
                  <input
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="ชื่อเล่น (Nickname)"
                    className={styles.input}
                    maxLength={20}
                    onKeyDown={(e) => e.key === 'Enter' && startGame()}
                  />
                  <button 
                    onClick={startGame} 
                    className={styles.playBtn}
                    disabled={!nickname.trim()}
                  >
                    🃏 เริ่มจับคู่เลย!
                  </button>
                </div>
              </div>
            )}

            {gameState === "playing" && (
              <div className={styles.playArea}>
                <div className={styles.statsBar}>
                  <div className={styles.statItem}>
                    <span>เวลา:</span>
                    <strong>{timer} วินาที</strong>
                  </div>
                  <div className={styles.statItem}>
                    <span>พลิกการ์ด:</span>
                    <strong>{moves} ครั้ง</strong>
                  </div>
                </div>

                <div className={styles.grid}>
                  {cards.map((card, index) => (
                    <div 
                      key={card.id} 
                      className={`${styles.card} ${card.isFlipped ? styles.flipped : ''} ${card.isMatched ? styles.matched : ''}`}
                      onClick={() => handleCardClick(index)}
                    >
                      <div className={styles.cardInner}>
                        <div className={styles.cardFront}>IT</div>
                        <div className={styles.cardBack}>{card.icon}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {gameState === "gameover" && (
              <div className={styles.gameOverScreen}>
                <h2>ยอดเยี่ยมมาก! 🎉</h2>
                <div className={styles.finalScore}>
                  <span>คุณได้</span>
                  <strong>{score}</strong>
                  <span>คะแนน</span>
                </div>
                <div className={styles.gameStats}>
                  <p>เวลา: {timer} วินาที</p>
                  <p>พลิกการ์ด: {moves} ครั้ง</p>
                </div>
                
                {!scoreSubmitted ? (
                  <button 
                    onClick={submitScore} 
                    className={styles.submitBtn}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'กำลังบันทึก...' : '🏆 บันทึกคะแนน'}
                  </button>
                ) : (
                  <div className={styles.successMsg}>บันทึกคะแนนเรียบร้อย!</div>
                )}
                
                <button onClick={startGame} className={styles.playAgainBtn}>
                  เล่นใหม่อีกรอบ
                </button>
              </div>
            )}
          </div>

          {/* Leaderboard Area */}
          <div className={styles.leaderboardCard}>
            <div className={styles.leaderboardHeader}>
              <h3>🏆 Leaderboard — Top 10</h3>
              <p>จับคู่</p>
            </div>
            
            <div className={styles.leaderboardList}>
              {leaderboard.length === 0 ? (
                <div className={styles.emptyLeaderboard}>ยังไม่มีใครทำคะแนน มาร่วมเป็นคนแรก!</div>
              ) : (
                leaderboard.map((item, index) => (
                  <div key={item.id} className={`${styles.leaderboardItem} ${index < 3 ? styles.topThree : ''}`}>
                    <div className={styles.rank}>
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                    </div>
                    <div className={styles.name}>{item.nickname}</div>
                    <div className={styles.score}>{item.score}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
