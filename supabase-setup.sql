-- สร้างตาราง applications สำหรับเก็บข้อมูลผู้สมัคร
CREATE TABLE IF NOT EXISTS applications (
  id BIGSERIAL PRIMARY KEY,
  national_id VARCHAR(13) UNIQUE NOT NULL,
  prefix VARCHAR(20) NOT NULL,
  full_name VARCHAR(200) NOT NULL,
  school VARCHAR(200) NOT NULL,
  province VARCHAR(100) NOT NULL,
  program VARCHAR(100) NOT NULL,
  round VARCHAR(50) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(200) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- สร้าง Index สำหรับค้นหาเร็วขึ้น
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_program ON applications(program);
CREATE INDEX idx_applications_national_id ON applications(national_id);

-- เปิด Row Level Security
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Policy: อนุญาตให้ทุกคน INSERT ได้ (สำหรับฟอร์มสมัคร)
CREATE POLICY "Allow public insert" ON applications
  FOR INSERT TO anon
  WITH CHECK (true);

-- Policy: อนุญาตให้ทุกคน SELECT ได้ (สำหรับ Admin dashboard)
CREATE POLICY "Allow public select" ON applications
  FOR SELECT TO anon
  USING (true);

-- Policy: อนุญาตให้อัปเดตได้ (สำหรับ Admin เปลี่ยนสถานะ)
CREATE POLICY "Allow public update" ON applications
  FOR UPDATE TO anon
  USING (true)
  WITH CHECK (true);

-- Policy: อนุญาตให้ลบได้ (สำหรับ Admin)
CREATE POLICY "Allow public delete" ON applications
  FOR DELETE TO anon
  USING (true);
