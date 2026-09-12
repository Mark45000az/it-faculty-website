import Link from 'next/link';
import styles from './page.module.css';

export default function Home() {
  const programs = [
    {
      id: "it",
      icon: "🌐",
      title: "เทคโนโลยีสารสนเทศ",
      shortName: "IT",
      description: "เรียนรู้ระบบเครือข่าย การพัฒนาซอฟต์แวร์ และการจัดการฐานข้อมูล เพื่อตอบโจทย์ธุรกิจดิจิทัล",
      skills: ["Network & Cloud", "Web Development", "System Analysis"],
      careers: ["IT Support", "System Administrator", "Software Developer"]
    },
    {
      id: "cs",
      icon: "💻",
      title: "วิทยาการคอมพิวเตอร์",
      shortName: "CS",
      description: "เน้นการเขียนโปรแกรมเชิงลึก โครงสร้างข้อมูล และปัญญาประดิษฐ์ สร้างสรรค์นวัตกรรมใหม่",
      skills: ["Algorithms", "AI & Machine Learning", "Data Structures"],
      careers: ["Data Scientist", "AI Engineer", "Backend Developer"]
    },
    {
      id: "msi",
      icon: "🤖",
      title: "วิทยาการมัลติมีเดียปัญญาประดิษฐ์",
      shortName: "MSI",
      description: "ผสมผสานเทคโนโลยีมัลติมีเดียและ AI เพื่อสร้างสรรค์ผลงานดิจิทัลอัจฉริยะ",
      skills: ["Multimedia Design", "Artificial Intelligence", "Creative Technology"],
      careers: ["AI Developer", "UX/UI Designer", "Creative Technologist"]
    }
  ];

  const stats = [
    { number: "1,200+", label: "นักศึกษาปัจจุบัน", icon: "🎓" },
    { number: "10+", label: "อาจารย์ผู้เชี่ยวชาญ", icon: "👨‍🏫" },
    { number: "95%", label: "อัตราการมีงานทำ", icon: "💼" },
    { number: "3", label: "หลักสูตรทันสมัย", icon: "📚" },
  ];

  const highlights = [
    {
      icon: "🏆",
      title: "ห้องปฏิบัติการทันสมัย",
      description: "ห้องแล็บคอมพิวเตอร์ที่ทันสมัยพร้อมอุปกรณ์ระดับอุตสาหกรรม"
    },
    {
      icon: "🤝",
      title: "ฝึกงานกับบริษัทชั้นนำ",
      description: "ร่วมมือกับบริษัทเทคโนโลยีชั้นนำทั้งในและต่างประเทศ"
    },
    {
      icon: "🚀",
      title: "เรียนรู้จากโปรเจกต์จริง",
      description: "Project-Based Learning เน้นลงมือทำจริงทุกเทอม"
    },
    {
      icon: "🌍",
      title: "เชื่อมต่อเครือข่ายระดับสากล",
      description: "โอกาสแลกเปลี่ยนนักศึกษากับมหาวิทยาลัยต่างประเทศ"
    }
  ];

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroParticles}>
          <div className={styles.particle} style={{ top: '10%', left: '10%', animationDelay: '0s' }}></div>
          <div className={styles.particle} style={{ top: '20%', right: '15%', animationDelay: '1s' }}></div>
          <div className={styles.particle} style={{ bottom: '30%', left: '20%', animationDelay: '2s' }}></div>
          <div className={styles.particle} style={{ bottom: '15%', right: '25%', animationDelay: '0.5s' }}></div>
          <div className={styles.particle} style={{ top: '50%', left: '50%', animationDelay: '1.5s' }}></div>
          <div className={styles.particle} style={{ top: '35%', right: '40%', animationDelay: '3s' }}></div>
        </div>

        <div className={styles.heroContent}>
          <span className={styles.eyebrow}>
            <span className={styles.eyebrowDot}></span>
            คณะเทคโนโลยีสารสนเทศ
          </span>
          <h1 className={styles.heroTitle}>
            เปิดประตูสู่<span className={styles.gradientText}>โลกเทคโนโลยี</span>
          </h1>
          <p className={styles.heroSubtitle}>
            เรียนรู้ ลงมือทำ และสร้างอนาคตไปด้วยกัน<br />
            มหาวิทยาลัยราชภัฏร้อยเอ็ด
          </p>
          <div className={styles.heroActions}>
            <Link href="/admissions" className={styles.primaryButton}>
              <span>สมัครเรียน</span>
              <span className={styles.buttonArrow}>→</span>
            </Link>
            <Link href="/lecturers" className={styles.secondaryButton}>
              ดูอาจารย์ผู้สอน
            </Link>
          </div>
        </div>

        <div className={styles.heroWave}>
          <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
            <path d="M0,64L48,58.7C96,53,192,43,288,48C384,53,480,75,576,80C672,85,768,75,864,64C960,53,1056,43,1152,48C1248,53,1344,75,1392,85.3L1440,96L1440,120L0,120Z" fill="var(--surface-soft)" />
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className={styles.stats}>
        <div className={styles.statsGrid}>
          {stats.map((stat, index) => (
            <div key={index} className={styles.statCard} style={{ animationDelay: `${index * 0.1}s` }}>
              <span className={styles.statIcon}>{stat.icon}</span>
              <span className={styles.statNumber}>{stat.number}</span>
              <span className={styles.statLabel}>{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Programs Section */}
      <section className={styles.programs}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTag}>PROGRAMS</span>
          <h2 className={styles.sectionTitle}>หลักสูตรที่เปิดสอน</h2>
          <div className={styles.sectionDivider}></div>
          <p className={styles.sectionSubtitle}>เราพร้อมสร้างบัณฑิตที่มีทักษะตรงกับความต้องการของตลาดงาน</p>
        </div>
        
        <div className={styles.programGrid}>
          {programs.map((program) => (
            <div key={program.id} className={styles.programCard}>
              <div className={styles.programCardTop}>
                <span className={styles.programIcon}>{program.icon}</span>
                <span className={styles.programBadge}>{program.shortName}</span>
              </div>
              <h3 className={styles.programTitle}>{program.title}</h3>
              <p className={styles.programDescription}>{program.description}</p>
              
              <div className={styles.programDetails}>
                <div className={styles.detailGroup}>
                  <h4>ทักษะที่ได้รับ:</h4>
                  <div className={styles.tagList}>
                    {program.skills.map((skill, idx) => (
                      <span key={idx} className={styles.tag}>{skill}</span>
                    ))}
                  </div>
                </div>
                <div className={styles.detailGroup}>
                  <h4>อาชีพที่รองรับ:</h4>
                  <div className={styles.tagList}>
                    {program.careers.map((career, idx) => (
                      <span key={idx} className={`${styles.tag} ${styles.tagCareer}`}>{career}</span>
                    ))}
                  </div>
                </div>
              </div>
              
              <Link href="/admissions" className={styles.outlineButton}>
                สมัครเรียนหลักสูตรนี้
                <span className={styles.buttonArrow}>→</span>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Highlights Section */}
      <section className={styles.highlights}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTag}>WHY US</span>
          <h2 className={styles.sectionTitle}>ทำไมต้องเลือกเรา?</h2>
          <div className={styles.sectionDivider}></div>
        </div>

        <div className={styles.highlightGrid}>
          {highlights.map((item, index) => (
            <div key={index} className={styles.highlightCard}>
              <div className={styles.highlightIcon}>{item.icon}</div>
              <h3 className={styles.highlightTitle}>{item.title}</h3>
              <p className={styles.highlightDesc}>{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.cta}>
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>พร้อมเริ่มต้นเส้นทางใหม่หรือยัง?</h2>
          <p className={styles.ctaSubtitle}>เปิดรับสมัครนักศึกษาใหม่แล้ววันนี้ อย่ารอช้า มาเป็นส่วนหนึ่งของครอบครัว IT!</p>
          <Link href="/admissions" className={styles.ctaButton}>
            สมัครเรียนเลย
            <span className={styles.buttonArrow}>→</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
