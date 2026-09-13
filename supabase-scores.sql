-- ============================================
-- Snake Game Leaderboard Table (V2 - Persistent Player ID)
-- Run this in Supabase SQL Editor
-- ============================================

-- ลบตารางเก่าทิ้งก่อน (เพราะเราเปลี่ยนโครงสร้างใหม่)
DROP TABLE IF EXISTS scores;

-- สร้างตาราง scores ใหม่ (รองรับหลายเกม)
CREATE TABLE scores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  player_id UUID NOT NULL,
  game_type VARCHAR(20) NOT NULL DEFAULT 'snake',
  nickname VARCHAR(50) NOT NULL,
  score INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(player_id, game_type)
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
