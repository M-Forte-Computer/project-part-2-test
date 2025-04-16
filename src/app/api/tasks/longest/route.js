import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = global.prisma || new PrismaClient();
if (process.env.NODE_ENV === 'development') global.prisma = prisma;

const secret = process.env.AUTH_SECRET;

function formatDate(date) {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  }).format(new Date(date));
}

function calculateDuration(createdAt) {
  const createdDate = new Date(createdAt);
  const currentDate = new Date();
  const durationInMilliseconds = currentDate - createdDate;

  const hours = Math.floor(durationInMilliseconds / (1000 * 60 * 60));
  const minutes = Math.floor((durationInMilliseconds % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((durationInMilliseconds % (1000 * 60)) / 1000);

  return `${hours} hours, ${minutes} minutes, ${seconds} seconds (EST)`;
}

export async function GET() {
  try {
    const oldestTask = await prisma.task.findFirst({
      orderBy: {
        createdAt: 'asc'
      }
    });

    if (!oldestTask) {
      return NextResponse.json({ message: 'No tasks found' }, { status: 404 });
    }

    return NextResponse.json({
      ...oldestTask,
      formattedCreatedAt: formatDate(oldestTask.createdAt),
      duration: calculateDuration(oldestTask.createdAt)
    });
  } catch (error) {
    console.error('Error fetching longest task:', error);
    return NextResponse.json(
      { error: 'Failed to fetch longest task' },
      { status: 500 }
    );
  }
}
