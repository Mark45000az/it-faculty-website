import Link from "next/link";
import { Lecturer } from "@/data/lecturers";
import styles from "./LecturerCard.module.css";

interface LecturerCardProps {
  lecturer: Lecturer;
}

export default function LecturerCard({ lecturer }: LecturerCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        {lecturer.photo ? (
          <img src={lecturer.photo} alt={lecturer.name} className={styles.image} />
        ) : (
          <div className={styles.placeholder}>
            <span className={styles.placeholderIcon}>👤</span>
          </div>
        )}
      </div>
      
      <div className={styles.content}>
        <div className={styles.header}>
          <h3 className={styles.name}>
            {lecturer.academicTitle ? `${lecturer.academicTitle} ` : ''}{lecturer.name}
          </h3>
          <p className={styles.position}>{lecturer.position}</p>
          <span className={styles.program}>{lecturer.program}</span>
        </div>
        
        {lecturer.specialties && lecturer.specialties.length > 0 && (
          <div className={styles.specialties}>
            {lecturer.specialties.slice(0, 3).map((spec, idx) => (
              <span key={idx} className={styles.chip}>{spec}</span>
            ))}
            {lecturer.specialties.length > 3 && (
              <span className={styles.chip}>+{lecturer.specialties.length - 3}</span>
            )}
          </div>
        )}
        
        {lecturer.shortBio && (
          <p className={styles.bio}>{lecturer.shortBio}</p>
        )}
      </div>
      
      <div className={styles.footer}>
        <Link href={`/lecturers/${lecturer.slug}`} className={styles.button}>
          ดูโปรไฟล์
        </Link>
      </div>
    </div>
  );
}
