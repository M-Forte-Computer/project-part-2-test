import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = global.prisma || new PrismaClient();
if (process.env.NODE_ENV === 'development') global.prisma = prisma;

const secret = process.env.AUTH_SECRET;

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return new Response(JSON.stringify({ error: 'Email and password are required' }), { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return new Response(JSON.stringify({ error: 'Invalid email or password' }), { status: 401 });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, secret, { expiresIn: '1h' });
    return new Response(JSON.stringify({ message: 'Login successful', token }), { status: 200 });
  } catch (error) {
    if (error.code === 'P2021') {
      return new Response(JSON.stringify({ error: 'Database table does not exist. Please apply migrations.' }), { status: 500 });
    }
    if (error.code === 'P1001') {
      return new Response(JSON.stringify({ error: 'Database connection error. Please check your database connection.' }), { status: 500 });
    }
    return new Response(JSON.stringify({ error: 'Login failed', details: error.message }), { status: 500 });
  }
}
