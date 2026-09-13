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

const IT_WORDS = [
  'console.log("Hello")',
  'SELECT * FROM users',
  'npm run dev',
  'git commit -m "fix"',
  'sudo rm -rf /',
  'function main()',
  "import React from 'react'",
  'export default',
  'Next.js App Router',
  '<div>คณะไอที</div>',
  'border-radius: 50%',
  'const [state, setState]',
  "await fetch('/api')",
  'git push origin main',
  'typeof window !== "undefined"',
  'justify-content: center',
  'align-items: center',
  'JSON.stringify(data)',
  'JSON.parse(json)',
  'return null;'
];

export default function TypingGamePage() {
  const [gameState, setGameState] = useState<"login" | "playing" | "gameover">("login");
  const [nickname, setNickname] = useState("");
  const [playerId, setPlayerId] = useState("");
  const [score, setScore] = useState(0);
  const [leaderboard, setLeaderboard] = useState<Score[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scoreSubmitted, setScoreSubmitted] = useState(false);

  // Game state
  const [currentWord, setCurrentWord] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [timeLeft, setTimeLeft] = useState(30);
  const [streak, setStreak] = useState(0);
  const timerRef = useRef<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const fetchLeaderboard = useCallback(async () => {
    try {
      const res = await fetch(`/api/scores?gameType=typing&t=${Date.now()}`);
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
    
    const savedNickname = localStorage.getItem('typing_nickname') || localStorage.getItem('snake_nickname');
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

  const getNewWord = () => {
    const randomWord = IT_WORDS[Math.floor(Math.random() * IT_WORDS.length)];
    setCurrentWord(randomWord);
  };

  const startGame = () => {
    if (!nickname.trim()) return;
    localStorage.setItem('typing_nickname', nickname.trim());
    localStorage.setItem('snake_nickname', nickname.trim()); 

    setScore(0);
    setStreak(0);
    setTimeLeft(30);
    setInputValue("");
    getNewWord();
    setGameState("playing");
    setScoreSubmitted(false);

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleGameOver();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    setTimeout(() => {
      if (inputRef.current) inputRef.current.focus();
    }, 100);
  };

  const handleGameOver = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setGameState("gameover");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);

    if (val === currentWord) {
      // Correct!
      setScore(prev => prev + 10 + (streak * 2));
      setStreak(prev => prev + 1);
      setTimeLeft(prev => prev + 2); // Bonus time
      setInputValue("");
      getNewWord();
    } else if (currentWord.startsWith(val)) {
      // Still correct so far, do nothing
    } else {
      // Mistake! Reset streak
      setStreak(0);
    }
  };

  const submitScore = async () => {
    if (scoreSubmitted || isSubmitting || !playerId) return;
    setIsSubmitting(true);
    try {
      await fetch("/api/scores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerId, gameType: 'typing', nickname: nickname.trim(), score }),
      });
      setScoreSubmitted(true);
      await fetchLeaderboard();
    } catch (err) {
      console.error("Failed to submit score:", err);
    }
    setIsSubmitting(false);
  };

  // Render colored word based on current input
  const renderWord = () => {
    return currentWord.split('').map((char, index) => {
      let colorClass = styles.charPending;
      if (index < inputValue.length) {
        colorClass = inputValue[index] === char ? styles.charCorrect : styles.charIncorrect;
      }
      return <span key={index} className={colorClass}>{char}</span>;
    });
  };

  return (
    <main className={styles.gameMain}>
      <div className={styles.container}>
        <div className={styles.gameHeader}>
          <Link href="/game" className={styles.backBtn}>← กลับไปเลือกเกม</Link>
          <div className={styles.gameTitle}>
            <span className={styles.gameIcon}>⌨️</span>
            <h1>Hackerman Typing</h1>
          </div>
        </div>

        <div className={styles.layout}>
          {/* Game Area */}
          <div className={styles.gameCard}>
            {gameState === "login" && (
              <div className={styles.loginScreen}>
                <div className={styles.loginIcon}>⌨️</div>
                <h2>เข้าร่วมเกมพิมพ์เร็ว</h2>
                <p>ทดสอบสกิลนิ้วทองคำ พิมพ์โค้ดและคำศัพท์ไอทีให้ทันเวลา!</p>
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
                    ⌨️ เริ่มพิมพ์เลย!
                  </button>
                </div>
              </div>
            )}

            {gameState === "playing" && (
              <div className={styles.playArea}>
                <div className={styles.statsBar}>
                  <div className={styles.statItem}>
                    <span>คะแนน</span>
                    <strong className={styles.scoreText}>{score}</strong>
                  </div>
                  <div className={styles.statItem}>
                    <span>คอมโบ</span>
                    <strong className={styles.streakText}>x{streak}</strong>
                  </div>
                  <div className={styles.statItem}>
                    <span>เวลาเหลือ</span>
                    <strong className={`${styles.timeText} ${timeLeft <= 5 ? styles.timeDanger : ''}`}>
                      {timeLeft}s
                    </strong>
                  </div>
                </div>

                <div className={styles.terminal}>
                  <div className={styles.terminalHeader}>
                    <span className={styles.dotRed}></span>
                    <span className={styles.dotYellow}></span>
                    <span className={styles.dotGreen}></span>
                    <span className={styles.terminalTitle}>hackerman@it-faculty:~</span>
                  </div>
                  <div className={styles.terminalBody}>
                    <div className={styles.wordDisplay}>
                      {renderWord()}
                    </div>
                    <div className={styles.inputRow}>
                      <span className={styles.prompt}>$</span>
                      <input
                        ref={inputRef}
                        type="text"
                        value={inputValue}
                        onChange={handleInputChange}
                        className={styles.terminalInput}
                        autoComplete="off"
                        autoCapitalize="off"
                        spellCheck="false"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {gameState === "gameover" && (
              <div className={styles.gameOverScreen}>
                <h2>จบเกม! 🛑</h2>
                <div className={styles.finalScore}>
                  <span>คุณได้</span>
                  <strong>{score}</strong>
                  <span>คะแนน</span>
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
                  พิมพ์ใหม่อีกรอบ
                </button>
              </div>
            )}
          </div>

          {/* Leaderboard Area */}
          <div className={styles.leaderboardCard}>
            <div className={styles.leaderboardHeader}>
              <h3>🏆 Leaderboard — Top 10</h3>
              <p>นักพิมพ์นิ้วทองคำ</p>
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
