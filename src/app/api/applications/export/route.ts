import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET — ส่งออกข้อมูลเป็น CSV
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: 'เกิดข้อผิดพลาดในการดึงข้อมูล' },
        { status: 500 }
      );
    }

    // สร้าง CSV content
    const headers = [
      'ลำดับ', 'เลขบัตรประชาชน', 'คำนำหน้า', 'ชื่อ-นามสกุล',
      'โรงเรียน', 'จังหวัด', 'สาขาวิชา', 'รอบที่สมัคร',
      'เบอร์โทร', 'อีเมล', 'สถานะ', 'วันที่สมัคร'
    ];

    const statusMap: Record<string, string> = {
      pending: 'รอดำเนินการ',
      approved: 'อนุมัติ',
      rejected: 'ไม่อนุมัติ'
    };

    const programMap: Record<string, string> = {
      it: 'เทคโนโลยีสารสนเทศ',
      cs: 'วิทยาการคอมพิวเตอร์',
      msi: 'วิทยาการมัลติมีเดียปัญญาประดิษฐ์'
    };

    const roundMap: Record<string, string> = {
      portfolio: 'รอบ 1 Portfolio',
      quota: 'รอบ 2 Quota',
      admission: 'รอบ 3 Admission'
    };

    const rows = (data || []).map((app, index) => [
      index + 1,
      app.national_id,
      app.prefix,
      app.full_name,
      app.school,
      app.province,
      programMap[app.program] || app.program,
      roundMap[app.round] || app.round,
      app.phone,
      app.email,
      statusMap[app.status] || app.status,
      new Date(app.created_at).toLocaleString('th-TH')
    ]);

    // BOM for Thai characters in Excel
    const BOM = '\uFEFF';
    const csvContent = BOM + [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="applications_${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });

  } catch {
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในระบบ' },
      { status: 500 }
    );
  }
}
