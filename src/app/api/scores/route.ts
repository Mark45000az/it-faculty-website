import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

// GET — ดึง Top 10 คะแนนสูงสุด (ไม่ซ้ำคน)
export async function GET() {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json({ scores: [] });
    }

    const { data, error } = await supabase
      .from('scores')
      .select('*')
      .order('score', { ascending: false })
      .limit(200);

    if (error) {
      console.error('Supabase scores error:', error);
      return NextResponse.json({ scores: [] });
    }

    // เอาเฉพาะคะแนนสูงสุดของแต่ละคน — จำด้วย player_id (ถ้ามี) หรือ nickname
    const bestScores = new Map<string, typeof data[0]>();
    for (const entry of data || []) {
      const key = entry.player_id || entry.nickname; // ใช้ player_id เป็นหลัก
      const existing = bestScores.get(key);
      if (!existing || entry.score > existing.score) {
        bestScores.set(key, entry);
      }
    }

    const top10 = Array.from(bestScores.values())
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    return NextResponse.json({ scores: top10 });
  } catch {
    return NextResponse.json({ scores: [] });
  }
}

// POST — บันทึกคะแนนใหม่
export async function POST(request: NextRequest) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { error: 'ระบบฐานข้อมูลยังไม่พร้อม' },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { nickname, score, player_id } = body;

    if (!nickname || typeof nickname !== 'string' || nickname.trim().length === 0) {
      return NextResponse.json(
        { error: 'กรุณาระบุชื่อเล่น' },
        { status: 400 }
      );
    }

    if (typeof score !== 'number' || score < 0) {
      return NextResponse.json(
        { error: 'คะแนนไม่ถูกต้อง' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('scores')
      .insert([{
        nickname: nickname.trim().substring(0, 50),
        score: Math.floor(score),
        player_id: player_id || null,
      }])
      .select()
      .single();

    if (error) {
      console.error('Supabase insert score error:', error);
      return NextResponse.json(
        { error: 'บันทึกคะแนนไม่สำเร็จ' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'บันทึกคะแนนสำเร็จ',
      score: data,
    }, { status: 201 });

  } catch {
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในระบบ' },
      { status: 500 }
    );
  }
}
