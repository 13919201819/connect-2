import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function OPTIONS() {
  console.log('✅ OPTIONS received');
  return new NextResponse(null, { 
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': '*',
    }
  });
}

export async function POST(request: Request) {
  console.log('✅ POST received');

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': '*',
  };

  try {
    const data = await request.json();
    console.log('Data:', data);

    return NextResponse.json({ success: true, message: 'Test successful!' }, { headers });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500, headers });
  }
}