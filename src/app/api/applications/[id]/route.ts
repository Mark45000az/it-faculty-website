import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// PATCH — อัปเดตสถานะใบสมัคร (อนุมัติ/ปฏิเสธ)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return NextResponse.json(
        { error: 'สถานะไม่ถูกต้อง' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('applications')
      .update({ status })
      .eq('id', parseInt(id))
      .select()
      .single();

    if (error) {
      console.error('Supabase update error:', error);
      return NextResponse.json(
        { error: 'เกิดข้อผิดพลาดในการอัปเดตสถานะ' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      message: 'อัปเดตสถานะสำเร็จ',
      application: data 
    });

  } catch {
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในระบบ' },
      { status: 500 }
    );
  }
}

// DELETE — ลบใบสมัคร
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { error } = await supabase
      .from('applications')
      .delete()
      .eq('id', parseInt(id));

    if (error) {
      console.error('Supabase delete error:', error);
      return NextResponse.json(
        { error: 'เกิดข้อผิดพลาดในการลบข้อมูล' },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: 'ลบข้อมูลสำเร็จ' });

  } catch {
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในระบบ' },
      { status: 500 }
    );
  }
}
