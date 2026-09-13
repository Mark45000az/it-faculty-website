-- ============================================
-- Snake Game Leaderboard Table
-- Run this in Supabase SQL Editor
-- ============================================

-- สร้างตาราง scores
CREATE TABLE IF NOT EXISTS scores (
  id BIGSERIAL PRIMARY KEY,
  nickname VARCHAR(50) NOT NULL,
  score INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- เปิด RLS
ALTER TABLE scores ENABLE ROW LEVEL SECURITY;

-- ให้ทุกคนอ่านคะแนนได้
CREATE POLICY "Anyone can view scores"
  ON scores FOR SELECT
  USING (true);

-- ให้ทุกคนเพิ่มคะแนนได้
CREATE POLICY "Anyone can insert scores"
  ON scores FOR INSERT
  WITH CHECK (true);

-- สร้าง Index สำหรับ Leaderboard query ให้เร็ว
CREATE INDEX idx_scores_score_desc ON scores (score DESC);
