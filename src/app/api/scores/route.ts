import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

// GET — ดึง Top 10 คะแนนสูงสุด (ไม่ซ้ำชื่อ)
export async function GET() {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json({ scores: [] });
    }

    const { data, error } = await supabase
      .from('scores')
      .select('*')
      .order('score', { ascending: false })
      .limit(100);

    if (error) {
      console.error('Supabase scores error:', error);
      return NextResponse.json({ scores: [] });
    }

    // เอาเฉพาะคะแนนสูงสุดของแต่ละคน (ไม่ซ้ำชื่อ)
    const bestScores = new Map<string, typeof data[0]>();
    for (const entry of data || []) {
      const existing = bestScores.get(entry.nickname);
      if (!existing || entry.score > existing.score) {
        bestScores.set(entry.nickname, entry);
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
    const { nickname, score } = body;

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
