// app/api/register-user/route.ts
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid'; // Install with: npm install uuid @types/uuid

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, phone } = body;

    if (!email || !phone) {
      return NextResponse.json({ success: false, error: 'Email and phone are required' }, { status: 400 });
    }

    // Here you would typically:
    // 1. Check if user already exists in your database
    // 2. If not, create a new user record
    // 3. Generate or retrieve their UID

    // For this example, we'll just generate a new UUID
    const uid = uuidv4();

    console.log("user registered ::: uid ", uid);

    // In a real app, you would save this user to your database
    // await db.users.create({ email, phone, uid });

    return NextResponse.json({ 
      success: true, 
      uid,
      message: 'User registered successfully' 
    });
  } catch (error) {
    console.error('Error in register-user API:', error);
    return NextResponse.json({ success: false, error: 'Failed to register user' }, { status: 500 });
  }
}