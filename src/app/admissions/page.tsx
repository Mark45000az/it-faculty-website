import ApplicationForm from "@/components/admissions/ApplicationForm";
import styles from "./page.module.css";

export const metadata = {
  title: 'รับสมัครนักศึกษา | คณะเทคโนโลยีสารสนเทศ',
};

export default function AdmissionsPage() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>รับสมัครนักศึกษาใหม่</h1>
        <p className={styles.subtitle}>กรุณากรอกข้อมูลให้ครบถ้วนและแนบเอกสารที่เกี่ยวข้อง</p>
      </div>
      
      <div className={styles.formContainer}>
        <ApplicationForm />
      </div>
    </div>
  );
}
