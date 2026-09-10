import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'operational',
    service: 'FixIt IT Web',
    timestamp: new Date().toISOString(),
  });
}
