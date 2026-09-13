-- ============================================
-- Snake Game Leaderboard Table (V2 - Persistent Player ID)
-- Run this in Supabase SQL Editor
-- ============================================

-- ลบตารางเก่าทิ้งก่อน (เพราะเราเปลี่ยนโครงสร้างใหม่)
DROP TABLE IF EXISTS scores;

-- สร้างตาราง scores ใหม่ โดยใช้ player_id เป็น Primary Key
CREATE TABLE scores (
  player_id UUID PRIMARY KEY,
  nickname VARCHAR(50) NOT NULL,
  score INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- เปิด RLS
ALTER TABLE scores ENABLE ROW LEVEL SECURITY;

-- ให้ทุกคนอ่านคะแนนได้
CREATE POLICY "Anyone can view scores"
  ON scores FOR SELECT
  USING (true);

-- ให้ทุกคนเพิ่มหรืออัปเดตคะแนนตัวเองได้
CREATE POLICY "Anyone can upsert scores"
  ON scores FOR INSERT
  WITH CHECK (true);
  
CREATE POLICY "Anyone can update scores"
  ON scores FOR UPDATE
  USING (true);

-- สร้าง Index สำหรับ Leaderboard query ให้เร็ว
CREATE INDEX idx_scores_score_desc ON scores (score DESC);
