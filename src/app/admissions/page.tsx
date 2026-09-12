import ApplicationForm from "@/components/admissions/ApplicationForm";
import styles from "./page.module.css";

export const metadata = {
  title: 'รับสมัครนักศึกษา | คณะเทคโนโลยีสารสนเทศ',
};

export default function AdmissionsPage() {
  return (
    <div className={styles.container}>
      {/* Page Hero */}
      <section className={styles.pageHero}>
        <div className={styles.heroContent}>
          <span className={styles.heroTag}>📋 ADMISSIONS 2568</span>
          <h1 className={styles.title}>รับสมัครนักศึกษาใหม่</h1>
          <p className={styles.subtitle}>กรุณากรอกข้อมูลให้ครบถ้วนและแนบเอกสารที่เกี่ยวข้อง</p>
        </div>
        <div className={styles.heroWave}>
          <svg viewBox="0 0 1440 100" preserveAspectRatio="none">
            <path d="M0,40L80,44C160,48,320,56,480,56C640,56,800,48,960,44C1120,40,1280,40,1360,40L1440,40L1440,100L0,100Z" fill="var(--surface-soft)" />
          </svg>
        </div>
      </section>

      {/* Steps indicator */}
      <div className={styles.stepsBar}>
        <div className={styles.step}>
          <div className={styles.stepNumber}>1</div>
          <span>กรอกข้อมูล</span>
        </div>
        <div className={styles.stepLine}></div>
        <div className={styles.step}>
          <div className={styles.stepNumber}>2</div>
          <span>แนบเอกสาร</span>
        </div>
        <div className={styles.stepLine}></div>
        <div className={styles.step}>
          <div className={styles.stepNumber}>3</div>
          <span>ยืนยันส่ง</span>
        </div>
      </div>

      <div className={styles.formContainer}>
        <ApplicationForm />
      </div>
    </div>
  );
}
