export interface Lecturer {
  id: string;
  slug: string;
  name: string;
  academicTitle?: string;
  position?: string;
  faculty: string;
  program?: string;
  photo?: string;
  shortBio?: string;
  specialties: string[];
  courses: string[];
  education: {
    degree: string;
    field: string;
    institution: string;
    year?: string;
  }[];
  researchInterests: string[];
  publications?: {
    title: string;
    year?: string;
    type?: string;
    url?: string;
  }[];
  projects?: {
    title: string;
    description?: string;
    year?: string;
    url?: string;
  }[];
  contact?: {
    email?: string;
    phone?: string;
    office?: string;
    website?: string;
    facebook?: string;
    googleScholar?: string;
    researchGate?: string;
  };
  active: boolean;
  sortOrder?: number;
}

export const lecturers: Lecturer[] = [
  {
    id: "lecturer-001",
    slug: "vathinee-duangonnam",
    name: "วาทินี ดวงอ่อนนาม",
    academicTitle: "ผู้ช่วยศาสตราจารย์",
    position: "อาจารย์ผู้รับผิดชอบหลักสูตร",
    faculty: "คณะเทคโนโลยีสารสนเทศ",
    program: "วิทยาการคอมพิวเตอร์",
    photo: "/images/lecturers/vathinee-duangonnam.jpg",
    shortBio: "อาจารย์ประจำสาขาวิชาวิทยาการคอมพิวเตอร์",
    specialties: [],
    courses: [],
    education: [],
    researchInterests: [],
    contact: { 
      phone: "043-556-001 ต่อ 1520", 
      website: "https://it.reru.ac.th" 
    },
    active: true
  },
  {
    id: "lecturer-002",
    slug: "nithis-wangno",
    name: "นิธิศ วังโน",
    academicTitle: "ผู้ช่วยศาสตราจารย์ ดร.",
    position: "อาจารย์ผู้รับผิดชอบหลักสูตร",
    faculty: "คณะเทคโนโลยีสารสนเทศ",
    program: "เทคโนโลยีสารสนเทศ",
    photo: "/images/lecturers/nithis-wangno.jpg",
    shortBio: "ผู้ที่ทำงานด้วยหัวใจ ทุ่มเทกับศิษย์ เพื่ออนาคตลูกศิษย์เติบโต มองให้ไกล ไปให้ถึง ด้วยกรอบแนวคิดใหม่ๆ",
    specialties: [
      "Programming & Development",
      "Data Structures & Algorithms",
      "Artificial Intelligence",
      "Web & Mobile Development",
      "Database Systems",
      "Computer Networks",
      "Research & Innovation",
      "Problem Solving",
      "Team Leadership",
      "Communication & Coaching"
    ],
    courses: [],
    education: [],
    researchInterests: [
      "Artificial Intelligence",
      "Machine Learning",
      "Data Science",
      "Software Engineering",
      "Smart Learning Systems"
    ],
    contact: { 
      phone: "043-556-001 ต่อ 1520", 
      website: "https://it.reru.ac.th" 
    },
    active: true
  },
  {
    id: "lecturer-004",
    slug: "pramoon-suksakawpong",
    name: "ประมูล สุขสกาวผ่อง",
    academicTitle: "อาจารย์ ดร.",
    position: "ประธานหลักสูตรสาขาวิชาเทคโนโลยีสารสนเทศ",
    faculty: "คณะเทคโนโลยีสารสนเทศ",
    program: "เทคโนโลยีสารสนเทศ",
    photo: "/images/lecturers/pramoon-suksakawpong.jpg",
    shortBio: "อาจารย์ผู้รับผิดชอบหลักสูตรสาขาวิชาเทคโนโลยีสารสนเทศ",
    specialties: [
      "Computer Graphic", 
      "E-commerce", 
      "Data Structure", 
      "Data Mining", 
      "การประยุกต์เทคโนโลยีมัลติมีเดีย"
    ],
    courses: [],
    education: [],
    researchInterests: [],
    contact: {},
    active: true
  },
  {
    id: "lecturer-003",
    slug: "kemmawit-jittayasothorn",
    name: "เขมวิทย์ จิตตะยโศธร",
    academicTitle: "อาจารย์",
    position: "อาจารย์ผู้รับผิดชอบหลักสูตร",
    faculty: "คณะเทคโนโลยีสารสนเทศ",
    program: "วิทยาการมัลติมีเดียปัญญาประดิษฐ์",
    photo: "/images/lecturers/kemmawit-jittayasothorn.png",
    shortBio: "มุ่งเน้นการบูรณาการเทคโนโลยีมัลติมีเดียและปัญญาประดิษฐ์ เพื่อพัฒนานวัตกรรมที่สร้างสรรค์และมีคุณค่าอย่างยั่งยืน",
    specialties: [
      "Multimedia Design",
      "Artificial Intelligence",
      "Web & Application",
      "Motion Graphics",
      "Data Analysis",
      "Programming",
      "Creativity",
      "Teaching & Coaching",
      "Research & Innovation",
      "Project Management"
    ],
    courses: [],
    education: [],
    researchInterests: [
      "Multimedia & Animation",
      "Artificial Intelligence",
      "Computer Vision",
      "Interactive Media",
      "Smart Learning Technology"
    ],
    contact: {},
    active: true
  },
  {
    id: "lecturer-005",
    slug: "kla-poompayak",
    name: "กล้า ภูมิพยัคฆ์",
    academicTitle: "อาจารย์",
    position: "อาจารย์ผู้รับผิดชอบหลักสูตร",
    faculty: "คณะเทคโนโลยีสารสนเทศ",
    program: "วิทยาการมัลติมีเดียปัญญาประดิษฐ์",
    photo: "/images/lecturers/kla-poompayak.png",
    shortBio: "อาจารย์ประจำสาขาวิชาวิทยาการมัลติมีเดียปัญญาประดิษฐ์",
    specialties: ["Content Creator & Digital Storytelling", "Interactive Media & Innovation"],
    courses: [],
    education: [],
    researchInterests: [],
    contact: {},
    active: true
  },
  {
    id: "lecturer-006",
    slug: "prayat-supakam",
    name: "ประหยัด สุพะกำ",
    academicTitle: "ผู้ช่วยศาสตราจารย์",
    position: "อาจารย์ผู้รับผิดชอบหลักสูตร",
    faculty: "คณะเทคโนโลยีสารสนเทศ",
    program: "วิทยาการมัลติมีเดียปัญญาประดิษฐ์",
    photo: "/images/lecturers/prayat-supakam.png",
    shortBio: "อาจารย์ประจำสาขาวิชาวิทยาการมัลติมีเดียปัญญาประดิษฐ์",
    specialties: ["Motion Graphic", "Interactive Media & Innovation"],
    courses: [],
    education: [],
    researchInterests: [],
    contact: {},
    active: true
  },
  {
    id: "lecturer-007",
    slug: "kanjana-somkanay",
    name: "กาญจนา สมคะเนย์",
    academicTitle: "อาจารย์",
    position: "อาจารย์ผู้รับผิดชอบหลักสูตร",
    faculty: "คณะเทคโนโลยีสารสนเทศ",
    program: "วิทยาการมัลติมีเดียปัญญาประดิษฐ์",
    photo: "/images/lecturers/kanjana-somkanay.png",
    shortBio: "อาจารย์ประจำสาขาวิชาวิทยาการมัลติมีเดียปัญญาประดิษฐ์",
    specialties: ["Graphic Design & Digital Media", "UX/UI Design"],
    courses: [],
    education: [],
    researchInterests: [],
    contact: {},
    active: true
  },
  {
    id: "lecturer-008",
    slug: "thongchai-banjamart",
    name: "ธงชัย บรรจมาตย์",
    academicTitle: "อาจารย์",
    position: "อาจารย์ผู้รับผิดชอบหลักสูตร",
    faculty: "คณะเทคโนโลยีสารสนเทศ",
    program: "วิทยาการมัลติมีเดียปัญญาประดิษฐ์",
    photo: "/images/lecturers/thongchai-banjamart.png",
    shortBio: "อาจารย์ประจำสาขาวิชาวิทยาการมัลติมีเดียปัญญาประดิษฐ์",
    specialties: ["Animation 2D / 3D", "AI for Creative Content"],
    courses: [],
    education: [],
    researchInterests: [],
    contact: {},
    active: true
  },
  {
    id: "lecturer-009",
    slug: "chieochan-yangsila",
    name: "เชี่ยวชาญ ยางศิลา",
    academicTitle: "ผู้ช่วยศาสตราจารย์",
    position: "อาจารย์ผู้รับผิดชอบหลักสูตร",
    faculty: "คณะเทคโนโลยีสารสนเทศ",
    program: "เทคโนโลยีสารสนเทศ",
    photo: "/images/lecturers/chieochan-yangsila.jpg",
    shortBio: "อาจารย์ประจำสาขาวิชาเทคโนโลยีสารสนเทศ",
    specialties: [
      "การเขียนโปรแกรมเว็บ", 
      "ปฏิสัมพันธ์ระหว่างมนุษย์และคอมพิวเตอร์", 
      "การออกแบบและพัฒนาเว็บ", 
      "การเขียนโปรแกรม"
    ],
    courses: [],
    education: [],
    researchInterests: [],
    contact: {},
    active: true
  },
  {
    id: "lecturer-010",
    slug: "teerapol-suebchompoo",
    name: "ธีรพล สืบชมพู",
    academicTitle: "อาจารย์ ดร.",
    position: "อาจารย์ที่ปรึกษา",
    faculty: "คณะเทคโนโลยีสารสนเทศ",
    program: "เทคโนโลยีสารสนเทศ",
    photo: "/images/lecturers/teerapol-suebchompoo.jpg",
    shortBio: "มุ่งมั่นถ่ายทอดความรู้ เทคโนโลยี และนวัตกรรม เพื่อพัฒนาศักยภาพของนักศึกษา สู่การเป็นนักเทคโนโลยีมืออาชีพ อย่างมีคุณธรรมและสร้างสรรค์",
    specialties: [
      "Information Technology",
      "System Analysis & Design",
      "Database Management",
      "Web Development",
      "Data Science",
      "Artificial Intelligence",
      "Network & Security",
      "Cloud Computing",
      "IT Project Management",
      "Teaching & Coaching"
    ],
    courses: [],
    education: [],
    researchInterests: [
      "Information Systems",
      "Artificial Intelligence",
      "Data Analytics",
      "Digital Innovation",
      "Cyber Security",
      "Educational Technology"
    ],
    contact: {},
    active: true
  }
];
