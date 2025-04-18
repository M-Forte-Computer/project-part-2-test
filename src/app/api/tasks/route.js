import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = global.prisma || new PrismaClient();
if (process.env.NODE_ENV === 'development') global.prisma = prisma;

const secret = process.env.AUTH_SECRET;

function verifyToken(headers) {
  const authHeader = headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Authorization token is missing or invalid');
  }
  const token = authHeader.split(' ')[1];
  return jwt.verify(token, secret);
}

function calculateDuration(createdAt) {
  const createdDate = new Date(createdAt);
  const currentDate = new Date();
  
  const easternTime = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(currentDate);
  
  const easternDate = new Date(easternTime);
  const durationInMilliseconds = easternDate - createdDate;

  const hours = Math.floor(durationInMilliseconds / (1000 * 60 * 60));
  const minutes = Math.floor((durationInMilliseconds % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((durationInMilliseconds % (1000 * 60)) / 1000);

  return `${hours} hours, ${minutes} minutes, ${seconds} seconds (EST)`;
}

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

export async function GET(request) {
  try {
    verifyToken(request.headers);
    const tasks = await prisma.task.findMany();

    const tasksWithDurations = tasks.map((task) => ({
      ...task,
      createdAt: formatDate(task.createdAt),
      duration: calculateDuration(task.createdAt),
    }));

    return NextResponse.json(tasksWithDurations);
  } catch (error) {
    console.error('Error fetching tasks:', error.message);
    return NextResponse.json({ error: 'Failed to fetch tasks', details: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { title, description } = await request.json();
    if (!title || !description) {
      return NextResponse.json({ error: 'Title and description are required' }, { status: 400 });
    }

    const newTask = await prisma.task.create({
      data: { title, description },
    });

    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create task', details: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    verifyToken(request.headers);
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Task ID is required' }, { status: 400 });
    }
    await prisma.task.delete({
      where: { id: parseInt(id) },
    });
    return NextResponse.json({ message: 'Task deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete task', details: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const { id, title, description } = await request.json();
    verifyToken(request.headers);
    
    const updatedTask = await prisma.task.update({
      where: { id: parseInt(id) },
      data: { title, description }
    });

    return NextResponse.json({
      ...updatedTask,
      createdAt: formatDate(updatedTask.createdAt),
      duration: calculateDuration(updatedTask.createdAt)
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update task', details: error.message },
      { status: 500 }
    );
  }
}
