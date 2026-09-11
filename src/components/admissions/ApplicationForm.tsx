"use client";

import { useState } from "react";
import styles from "./ApplicationForm.module.css";

function validateNationalId(id: string): boolean {
  if (id.length !== 13 || !/^\d{13}$/.test(id)) return false;
  // Thai National ID checksum validation
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += parseInt(id[i]) * (13 - i);
  }
  const checkDigit = (11 - (sum % 11)) % 10;
  return checkDigit === parseInt(id[12]);
}

export default function ApplicationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [applicationId, setApplicationId] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [nationalIdError, setNationalIdError] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    national_id: "",
    prefix: "",
    full_name: "",
    school: "",
    province: "",
    program: "",
    round: "",
    phone: "",
    email: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrorMessage("");

    if (name === "national_id") {
      if (value.length === 13) {
        if (!validateNationalId(value)) {
          setNationalIdError("เลขบัตรประชาชนไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง");
        } else {
          setNationalIdError("");
        }
      } else {
        setNationalIdError("");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!validateNationalId(formData.national_id)) {
      setNationalIdError("เลขบัตรประชาชนไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        setErrorMessage(result.error || "เกิดข้อผิดพลาด กรุณาลองใหม่");
        setIsSubmitting(false);
        return;
      }

      setApplicationId(result.applicationId);
      setIsSuccess(true);
    } catch {
      setErrorMessage("ไม่สามารถเชื่อมต่อระบบได้ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className={styles.successState}>
        <div className={styles.successIcon}>✓</div>
        <h2>ส่งใบสมัครเรียบร้อยแล้ว</h2>
        {applicationId && (
          <p className={styles.applicationId}>
            เลขที่ใบสมัคร: <strong>#{applicationId}</strong>
          </p>
        )}
        <p>เจ้าหน้าที่จะติดต่อกลับไปยังอีเมลที่คุณได้ระบุไว้โดยเร็วที่สุด</p>
        <button
          onClick={() => {
            setIsSuccess(false);
            setApplicationId(null);
            setFormData({
              national_id: "", prefix: "", full_name: "",
              school: "", province: "", program: "",
              round: "", phone: "", email: "",
            });
          }}
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
      {errorMessage && (
        <div className={styles.errorBanner}>
          ⚠️ {errorMessage}
        </div>
      )}

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>ข้อมูลผู้สมัคร</h3>

        <div className={styles.formGroup}>
          <label htmlFor="national_id">เลขบัตรประชาชน (13 หลัก)</label>
          <input
            type="text"
            id="national_id"
            name="national_id"
            required
            maxLength={13}
            pattern="\d{13}"
            placeholder="1234567890123"
            value={formData.national_id}
            onChange={handleChange}
            className={nationalIdError ? styles.inputError : ""}
          />
          {nationalIdError && (
            <span className={styles.fieldError}>{nationalIdError}</span>
          )}
        </div>

        <div className={styles.row}>
          <div className={styles.formGroup}>
            <label htmlFor="prefix">คำนำหน้า</label>
            <select id="prefix" name="prefix" required value={formData.prefix} onChange={handleChange}>
              <option value="">เลือกคำนำหน้า</option>
              <option value="นาย">นาย</option>
              <option value="นางสาว">นางสาว</option>
              <option value="นาง">นาง</option>
            </select>
          </div>
          <div className={`${styles.formGroup} ${styles.colSpan2}`}>
            <label htmlFor="full_name">ชื่อ - นามสกุล</label>
            <input type="text" id="full_name" name="full_name" required placeholder="สมชาย ใจดี" value={formData.full_name} onChange={handleChange} />
          </div>
        </div>

        <div className={styles.rowEqual}>
          <div className={styles.formGroup}>
            <label htmlFor="school">โรงเรียนที่สำเร็จการศึกษา</label>
            <input type="text" id="school" name="school" required placeholder="ชื่อโรงเรียน" value={formData.school} onChange={handleChange} />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="province">จังหวัดของโรงเรียน</label>
            <input type="text" id="province" name="province" required placeholder="ร้อยเอ็ด" value={formData.province} onChange={handleChange} />
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>ข้อมูลการสมัคร</h3>

        <div className={styles.rowEqual}>
          <div className={styles.formGroup}>
            <label htmlFor="program">สาขาวิชาที่สมัคร</label>
            <select id="program" name="program" required value={formData.program} onChange={handleChange}>
              <option value="">เลือกสาขาวิชา</option>
              <option value="it">เทคโนโลยีสารสนเทศ</option>
              <option value="cs">วิทยาการคอมพิวเตอร์</option>
              <option value="msi">วิทยาการมัลติมีเดียปัญญาประดิษฐ์</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="round">รอบที่สมัคร</label>
            <select id="round" name="round" required value={formData.round} onChange={handleChange}>
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
            <input type="tel" id="phone" name="phone" required pattern="[0-9]{10}" placeholder="0812345678" value={formData.phone} onChange={handleChange} />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="email">อีเมล</label>
            <input type="email" id="email" name="email" required placeholder="example@email.com" value={formData.email} onChange={handleChange} />
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
          disabled={isSubmitting || !!nationalIdError}
        >
          {isSubmitting ? "กำลังส่งข้อมูล..." : "ส่งใบสมัคร"}
        </button>
      </div>
    </form>
  );
}
