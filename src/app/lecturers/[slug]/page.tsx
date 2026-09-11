import { notFound } from "next/navigation";
import Link from "next/link";
import { lecturers } from "@/data/lecturers";
import styles from "./page.module.css";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export function generateStaticParams() {
  return lecturers.map((lecturer) => ({
    slug: lecturer.slug,
  }));
}

export default async function LecturerProfilePage({ params }: PageProps) {
  const { slug } = await params;
  const lecturer = lecturers.find(l => l.slug === slug);
  
  if (!lecturer) {
    notFound();
  }

  return (
    <div className={styles.container}>
      <div className={styles.breadcrumb}>
        <Link href="/lecturers">← กลับหน้ารายนามอาจารย์</Link>
      </div>

      <div className={styles.profileHeader}>
        <div className={styles.imageContainer}>
          {lecturer.photo ? (
            <img src={lecturer.photo} alt={lecturer.name} className={styles.image} />
          ) : (
            <div className={styles.placeholder}>
              <span className={styles.placeholderIcon}>👤</span>
            </div>
          )}
        </div>
        
        <div className={styles.headerInfo}>
          <h1 className={styles.name}>
            {lecturer.academicTitle ? `${lecturer.academicTitle} ` : ''}{lecturer.name}
          </h1>
          <p className={styles.position}>{lecturer.position}</p>
          <span className={styles.programBadge}>{lecturer.program}</span>
          
          <div className={styles.contactInfo}>
            {lecturer.contact?.email && (
              <a href={`mailto:${lecturer.contact.email}`} className={styles.contactItem}>
                📧 {lecturer.contact.email}
              </a>
            )}
            {lecturer.contact?.office && (
              <span className={styles.contactItem}>
                🏢 {lecturer.contact.office}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className={styles.grid}>
        <div className={styles.mainContent}>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>เกี่ยวกับอาจารย์</h2>
            <p className={styles.bioText}>{lecturer.shortBio || 'ไม่มีข้อมูลประวัติย่อ'}</p>
          </section>

          {lecturer.education && lecturer.education.length > 0 && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>ประวัติการศึกษา</h2>
              <ul className={styles.timelineList}>
                {lecturer.education.map((edu, idx) => (
                  <li key={idx} className={styles.timelineItem}>
                    <div className={styles.timelineYear}>{edu.year || '-'}</div>
                    <div className={styles.timelineContent}>
                      <h4>{edu.degree} ({edu.field})</h4>
                      <p>{edu.institution}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {lecturer.courses && lecturer.courses.length > 0 && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>รายวิชาที่สอน</h2>
              <ul className={styles.list}>
                {lecturer.courses.map((course, idx) => (
                  <li key={idx}>{course}</li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <div className={styles.sidebar}>
          {lecturer.specialties && lecturer.specialties.length > 0 && (
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>ความเชี่ยวชาญ</h3>
              <div className={styles.chipContainer}>
                {lecturer.specialties.map((spec, idx) => (
                  <span key={idx} className={styles.chip}>{spec}</span>
                ))}
              </div>
            </div>
          )}

          {lecturer.researchInterests && lecturer.researchInterests.length > 0 && (
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>ความสนใจทางงานวิจัย</h3>
              <ul className={styles.bulletList}>
                {lecturer.researchInterests.map((interest, idx) => (
                  <li key={idx}>{interest}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
