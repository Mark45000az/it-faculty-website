import Link from 'next/link';
import styles from './page.module.css';

export default function Home() {
  const programs = [
    {
      id: "it",
      title: "เทคโนโลยีสารสนเทศ",
      description: "เรียนรู้ระบบเครือข่าย การพัฒนาซอฟต์แวร์ และการจัดการฐานข้อมูล เพื่อตอบโจทย์ธุรกิจดิจิทัล",
      skills: ["Network & Cloud", "Web Development", "System Analysis"],
      careers: ["IT Support", "System Administrator", "Software Developer"]
    },
    {
      id: "cs",
      title: "วิทยาการคอมพิวเตอร์",
      description: "เน้นการเขียนโปรแกรมเชิงลึก โครงสร้างข้อมูล และปัญญาประดิษฐ์ สร้างสรรค์นวัตกรรมใหม่",
      skills: ["Algorithms", "AI & Machine Learning", "Data Structures"],
      careers: ["Data Scientist", "AI Engineer", "Backend Developer"]
    }
  ];

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <span className={styles.eyebrow}>คณะเทคโนโลยีสารสนเทศ</span>
          <h1 className={styles.heroTitle}>เปิดประตูสู่โลกเทคโนโลยี</h1>
          <p className={styles.heroSubtitle}>
            เรียนรู้ ลงมือทำ และสร้างอนาคตไปด้วยกัน<br />
            มหาวิทยาลัยราชภัฏร้อยเอ็ด
          </p>
          <div className={styles.heroActions}>
            <Link href="/admissions" className={styles.primaryButton}>
              สมัครเรียน
            </Link>
            <Link href="/lecturers" className={styles.secondaryButton}>
              ดูอาจารย์ผู้สอน
            </Link>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section className={styles.programs}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>หลักสูตรที่เปิดสอน</h2>
          <div className={styles.sectionDivider}></div>
        </div>
        
        <div className={styles.programGrid}>
          {programs.map((program) => (
            <div key={program.id} className={styles.programCard}>
              <h3 className={styles.programTitle}>{program.title}</h3>
              <p className={styles.programDescription}>{program.description}</p>
              
              <div className={styles.programDetails}>
                <div className={styles.detailGroup}>
                  <h4>ทักษะที่ได้รับ:</h4>
                  <ul>
                    {program.skills.map((skill, idx) => (
                      <li key={idx}>{skill}</li>
                    ))}
                  </ul>
                </div>
                <div className={styles.detailGroup}>
                  <h4>อาชีพที่รองรับ:</h4>
                  <ul>
                    {program.careers.map((career, idx) => (
                      <li key={idx}>{career}</li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <Link href="/admissions" className={styles.outlineButton}>
                สมัครเรียนหลักสูตรนี้
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
