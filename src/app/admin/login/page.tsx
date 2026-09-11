"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./login.module.css";

export default function AdminLogin() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "เกิดข้อผิดพลาด");
        setIsLoading(false);
        return;
      }

      localStorage.setItem("adminToken", result.token);
      router.push("/admin/dashboard");
    } catch {
      setError("ไม่สามารถเชื่อมต่อระบบได้");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginCard}>
        <div className={styles.logoSection}>
          <img src="/images/ITLogo.png" alt="IT Logo" className={styles.logo} />
          <h1 className={styles.title}>ระบบจัดการหลังบ้าน</h1>
          <p className={styles.subtitle}>คณะเทคโนโลยีสารสนเทศ มหาวิทยาลัยราชภัฏร้อยเอ็ด</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && (
            <div className={styles.errorBanner}>⚠️ {error}</div>
          )}

          <div className={styles.formGroup}>
            <label htmlFor="username">ชื่อผู้ใช้</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="กรอกชื่อผู้ใช้"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">รหัสผ่าน</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="กรอกรหัสผ่าน"
              required
            />
          </div>

          <button
            type="submit"
            className={styles.loginButton}
            disabled={isLoading}
          >
            {isLoading ? "กำลังตรวจสอบ..." : "เข้าสู่ระบบ"}
          </button>
        </form>
      </div>
    </div>
  );
}
