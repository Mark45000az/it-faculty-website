"use client";

import { useState } from "react";
import styles from "./ApplicationForm.module.css";

export default function ApplicationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Mock submission delay
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  if (isSuccess) {
    return (
      <div className={styles.successState}>
        <div className={styles.successIcon}>✓</div>
        <h2>ส่งใบสมัครเรียบร้อยแล้ว</h2>
        <p>เจ้าหน้าที่จะติดต่อกลับไปยังอีเมลที่คุณได้ระบุไว้โดยเร็วที่สุด</p>
        <button 
          onClick={() => setIsSuccess(false)}
          className={styles.primaryButton}
          type="button"
        >
          ส่งใบสมัครอีกครั้ง
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>ข้อมูลผู้สมัคร</h3>
        
        <div className={styles.row}>
          <div className={styles.formGroup}>
            <label htmlFor="prefix">คำนำหน้า</label>
            <select id="prefix" required>
              <option value="">เลือกคำนำหน้า</option>
              <option value="นาย">นาย</option>
              <option value="นางสาว">นางสาว</option>
              <option value="นาง">นาง</option>
            </select>
          </div>
          <div className={`${styles.formGroup} ${styles.colSpan2}`}>
            <label htmlFor="fullName">ชื่อ - นามสกุล</label>
            <input type="text" id="fullName" required placeholder="นาย สมชาย ใจดี" />
          </div>
        </div>

        <div className={styles.rowEqual}>
          <div className={styles.formGroup}>
            <label htmlFor="school">โรงเรียนที่สำเร็จการศึกษา</label>
            <input type="text" id="school" required placeholder="ชื่อโรงเรียน" />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="province">จังหวัดของโรงเรียน</label>
            <input type="text" id="province" required placeholder="กรุงเทพมหานคร" />
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>ข้อมูลการสมัคร</h3>
        
        <div className={styles.rowEqual}>
          <div className={styles.formGroup}>
            <label htmlFor="program">สาขาวิชาที่สมัคร</label>
            <select id="program" required>
              <option value="">เลือกสาขาวิชา</option>
              <option value="it">เทคโนโลยีสารสนเทศ</option>
              <option value="cs">วิทยาการคอมพิวเตอร์</option>
              <option value="msi">วิทยาการมัลติมีเดียปัญญาประดิษฐ์</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="round">รอบที่สมัคร</label>
            <select id="round" required>
              <option value="">เลือกรอบ</option>
              <option value="portfolio">รอบ 1 Portfolio</option>
              <option value="quota">รอบ 2 Quota</option>
              <option value="admission">รอบ 3 Admission</option>
            </select>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>ข้อมูลติดต่อ</h3>
        
        <div className={styles.rowEqual}>
          <div className={styles.formGroup}>
            <label htmlFor="phone">เบอร์โทรศัพท์</label>
            <input type="tel" id="phone" required pattern="[0-9]{10}" placeholder="0812345678" />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="email">อีเมล</label>
            <input type="email" id="email" required placeholder="example@email.com" />
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>เอกสารแนบ (PDF, JPG, PNG)</h3>
        
        <div className={styles.formGroup}>
          <div className={styles.fileUpload}>
            <input 
              type="file" 
              id="document" 
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              required
            />
            <div className={styles.fileUploadUI}>
              <span className={styles.uploadIcon}>📄</span>
              <p>
                {file ? file.name : "คลิกเพื่ออัปโหลด หรือลากไฟล์มาวางที่นี่"}
              </p>
              {file && (
                <span className={styles.fileSize}>
                  ({(file.size / 1024 / 1024).toFixed(2)} MB)
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.formActions}>
        <button 
          type="submit" 
          className={styles.primaryButton}
          disabled={isSubmitting}
        >
          {isSubmitting ? "กำลังส่งข้อมูล..." : "ส่งใบสมัคร"}
        </button>
      </div>
    </form>
  );
}
