import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'


export async function GET(request: Request) {
  (await cookies()).delete('token')
  return NextResponse.redirect(new URL('/login', request.url))
}


export async function POST(request: Request) {
  (await cookies()).delete('token')
  return NextResponse.redirect(new URL('/login', request.url))
}