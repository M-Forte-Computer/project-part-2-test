import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = global.prisma || new PrismaClient();
if (process.env.NODE_ENV === 'development') global.prisma = prisma;

export async function POST(request) {
  try {
    const { name, email, subject, message } = await request.json();
    
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    const contact = await prisma.contact.create({
      data: {
        name,
        email,
        subject,
        message
      }
    });

    return NextResponse.json(contact, { status: 201 });
  } catch (error) {
    console.error('Contact submission error:', error);
    return NextResponse.json(
      { error: 'Failed to submit contact form', details: error.message },
      { status: 500 }
    );
  }
}
