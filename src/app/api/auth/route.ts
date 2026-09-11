import { NextRequest, NextResponse } from 'next/server';

// POST — Admin Login
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin1234';

    if (username === adminUsername && password === adminPassword) {
      // สร้าง simple token (สำหรับโปรเจกต์ส่งอาจารย์)
      const token = Buffer.from(`${username}:${Date.now()}`).toString('base64');
      
      return NextResponse.json({ 
        message: 'เข้าสู่ระบบสำเร็จ',
        token 
      });
    }

    return NextResponse.json(
      { error: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' },
      { status: 401 }
    );

  } catch {
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในระบบ' },
      { status: 500 }
    );
  }
}
