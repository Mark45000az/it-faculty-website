"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./page.module.css";

export default function GameCenterPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <main className={styles.gameCenterMain}>
      <div className={styles.heroSection}>
        <div className={styles.heroContent}>
          <span className={styles.badge}>🎮 IT Game Center</span>
          <h1 className={styles.title}>ศูนย์รวมมินิเกม</h1>
          <p className={styles.subtitle}>
            ผ่อนคลายจากการเขียนโค้ด มาประลองฝีมือและชิงอันดับ Leaderboard
          </p>
        </div>
      </div>

      <div className={styles.gamesContainer}>
        {/* Game 1: Snake */}
        <Link href="/game/snake" className={styles.gameCard}>
          <div className={styles.gameIconWrapper}>
            <span className={styles.gameIcon}>🐍</span>
          </div>
          <div className={styles.gameInfo}>
            <h2 className={styles.gameTitle}>Snake Game</h2>
            <p className={styles.gameDesc}>เกมงูคลาสสิก — กินอาหาร สะสมคะแนน ท้าชิงอันดับ!</p>
            <div className={styles.playBtn}>เล่นเกม →</div>
          </div>
        </Link>

        {/* Game 2: Memory Match */}
        <Link href="/game/memory" className={styles.gameCard}>
          <div className={styles.gameIconWrapper}>
            <span className={styles.gameIcon}>🃏</span>
          </div>
          <div className={styles.gameInfo}>
            <h2 className={styles.gameTitle}>IT Memory Match</h2>
            <p className={styles.gameDesc}>เกมจับคู่ — ทดสอบความจำกับโลโก้ภาษาโปรแกรมมิ่ง</p>
            <div className={styles.playBtn}>เล่นเกม →</div>
          </div>
        </Link>

        {/* Game 3: Hackerman Typing */}
        <Link href="/game/typing" className={styles.gameCard}>
          <div className={styles.gameIconWrapper}>
            <span className={styles.gameIcon}>⌨️</span>
          </div>
          <div className={styles.gameInfo}>
            <h2 className={styles.gameTitle}>Hackerman Typing</h2>
            <p className={styles.gameDesc}>พิมพ์โค้ดทะลุมิติ — พิมพ์คำศัพท์ไอทีให้เร็วที่สุดก่อนเวลาหมด</p>
            <div className={styles.playBtn}>เล่นเกม →</div>
          </div>
        </Link>
      </div>
    </main>
  );
}
