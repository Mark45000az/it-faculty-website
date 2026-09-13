import Link from "next/link";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.info}>
            <div className={styles.footerLogoContainer}>
              <img src="/images/ITLogo.png" alt="IT Logo" className={styles.footerLogoImage} />
              <div>
                <h3 className={styles.title}>คณะเทคโนโลยีสารสนเทศ</h3>
                <p className={styles.subtitle}>มหาวิทยาลัยราชภัฏร้อยเอ็ด</p>
              </div>
            </div>
            <p className={styles.address}>
              113 หมู่ 12 ตำบลเกาะแก้ว อำเภอเสลภูมิ จังหวัดร้อยเอ็ด 45120
            </p>
            <p className={styles.contact}>โทร. 043-556001 โทรสาร 043-556009</p>
          </div>
          <div className={styles.links}>
            <h4 className={styles.linkTitle}>เมนูลัด</h4>
            <ul className={styles.linkList}>
              <li><Link href="/">หน้าแรก</Link></li>
              <li><Link href="/admissions">รับสมัครนักศึกษา</Link></li>
              <li><Link href="/lecturers">รายนามอาจารย์</Link></li>
            </ul>
          </div>
          <div className={styles.links}>
            <h4 className={styles.linkTitle}>ลิงก์ที่เกี่ยวข้อง</h4>
            <ul className={styles.linkList}>
              <li><a href="https://ite.reru.ac.th/" target="_blank" rel="noopener noreferrer">เว็บไซต์คณะเทคโนโลยีสารสนเทศ</a></li>
              <li><a href="https://www.reru.ac.th/" target="_blank" rel="noopener noreferrer">เว็บไซต์มหาวิทยาลัยราชภัฏร้อยเอ็ด</a></li>
            </ul>
          </div>
          <div className={styles.adminSection}>
            <h4 className={styles.linkTitle}>🔐 ระบบหลังบ้าน (Admin)</h4>
            <p className={styles.adminDesc}>สำหรับเจ้าหน้าที่ดูแลข้อมูลการสมัคร</p>
            <div className={styles.credentialBox}>
              <div className={styles.credentialRow}>
                <span className={styles.credLabel}>Username:</span>
                <code className={styles.credValue}>admin</code>
              </div>
              <div className={styles.credentialRow}>
                <span className={styles.credLabel}>Password:</span>
                <code className={styles.credValue}>admin1234</code>
              </div>
            </div>
            <Link href="/admin/login" className={styles.adminButton}>
              เข้าสู่ระบบ Admin →
            </Link>
          </div>
        </div>
        <div className={styles.bottom}>
          <p>&copy; {new Date().getFullYear()} Faculty of Information Technology, Roi Et Rajabhat University. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
