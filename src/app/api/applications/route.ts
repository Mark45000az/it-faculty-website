import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// POST — บันทึกใบสมัครใหม่
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { national_id, prefix, full_name, school, province, program, round, phone, email } = body;

    // ตรวจสอบบัตรประชาชน 13 หลัก
    if (!national_id || national_id.length !== 13 || !/^\d{13}$/.test(national_id)) {
      return NextResponse.json(
        { error: 'เลขบัตรประชาชนไม่ถูกต้อง กรุณากรอก 13 หลัก' },
        { status: 400 }
      );
    }

    // ตรวจสอบว่าบัตรประชาชนซ้ำหรือไม่
    const { data: existing } = await supabase
      .from('applications')
      .select('id')
      .eq('national_id', national_id)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: 'เลขบัตรประชาชนนี้เคยสมัครไปแล้ว' },
        { status: 409 }
      );
    }

    // บันทึกข้อมูล
    const { data, error } = await supabase
      .from('applications')
      .insert([{
        national_id,
        prefix,
        full_name,
        school,
        province,
        program,
        round,
        phone,
        email,
        status: 'pending'
      }])
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json(
        { error: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      message: 'ส่งใบสมัครสำเร็จ',
      applicationId: data.id 
    }, { status: 201 });

  } catch {
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในระบบ' },
      { status: 500 }
    );
  }
}

// GET — ดึงรายชื่อผู้สมัครทั้งหมด (สำหรับ Admin)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const program = searchParams.get('program');
    const search = searchParams.get('search');

    let query = supabase
      .from('applications')
      .select('*')
      .order('created_at', { ascending: false });

    // กรองตามสถานะ
    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    // กรองตามสาขา
    if (program && program !== 'all') {
      query = query.eq('program', program);
    }

    // ค้นหาตามชื่อ
    if (search) {
      query = query.or(`full_name.ilike.%${search}%,national_id.ilike.%${search}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Supabase select error:', error);
      return NextResponse.json(
        { error: 'เกิดข้อผิดพลาดในการดึงข้อมูล' },
        { status: 500 }
      );
    }

    return NextResponse.json({ applications: data });

  } catch {
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในระบบ' },
      { status: 500 }
    );
  }
}
