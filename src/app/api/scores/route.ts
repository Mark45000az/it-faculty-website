import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

// GET — ดึง Top 10 คะแนนสูงสุดของเกมนั้นๆ
export async function GET(request: NextRequest) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json({ scores: [] });
    }

    const { searchParams } = new URL(request.url);
    const gameType = searchParams.get('gameType') || 'snake';

    const { data, error } = await supabase
      .from('scores')
      .select('*')
      .eq('game_type', gameType)
      .order('score', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Supabase scores error:', error);
      return NextResponse.json({ scores: [] });
    }

    return NextResponse.json({ scores: data });
  } catch {
    return NextResponse.json({ scores: [] });
  }
}

// POST — บันทึกคะแนนใหม่ (อัปเดตถ้าคะแนนเยอะขึ้น)
export async function POST(request: NextRequest) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { error: 'ระบบฐานข้อมูลยังไม่พร้อม' },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { playerId, nickname, score, gameType = 'snake' } = body;

    if (!playerId || !nickname || typeof nickname !== 'string' || nickname.trim().length === 0) {
      return NextResponse.json(
        { error: 'ข้อมูลไม่ครบถ้วน' },
        { status: 400 }
      );
    }

    if (typeof score !== 'number' || score < 0) {
      return NextResponse.json(
        { error: 'คะแนนไม่ถูกต้อง' },
        { status: 400 }
      );
    }

    // 1. ดึงคะแนนเดิมของผู้เล่นสำหรับเกมนี้
    const { data: existing } = await supabase
      .from('scores')
      .select('score')
      .eq('player_id', playerId)
      .eq('game_type', gameType)
      .single();

    // 2. กำหนดคะแนนที่จะบันทึก (ถ้าคะแนนใหม่น้อยกว่าคะแนนเดิม ให้เก็บคะแนนเดิมไว้)
    let finalScore = Math.floor(score);
    if (existing && existing.score > finalScore) {
      finalScore = existing.score;
    }

    // 3. ทำการ Upsert โดยต้องมี Unique constraint (player_id, game_type)
    const { data, error } = await supabase
      .from('scores')
      .upsert({
        player_id: playerId,
        game_type: gameType,
        nickname: nickname.trim().substring(0, 50),
        score: finalScore,
        updated_at: new Date().toISOString()
      }, { onConflict: 'player_id, game_type' })
      .select()
      .single();

    if (error) {
      console.error('Supabase upsert score error:', error);
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
