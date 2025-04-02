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

export async function GET(request) {
  try {
    verifyToken(request.headers);
    const tasks = await prisma.task.findMany();
    return NextResponse.json(tasks);
  } catch (error) {
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
