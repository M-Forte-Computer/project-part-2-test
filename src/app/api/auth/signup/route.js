import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = global.prisma || new PrismaClient();
if (process.env.NODE_ENV === 'development') global.prisma = prisma;

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return new Response(JSON.stringify({ error: 'Email and password are required' }), { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return new Response(JSON.stringify({ error: 'Email is already in use' }), { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashedPassword },
    });

    return new Response(JSON.stringify({ message: 'User created successfully', user }), { status: 201 });
  } catch (error) {
    if (error.code === 'P2021') {
      return new Response(JSON.stringify({ error: 'Database table does not exist. Please apply migrations.' }), { status: 500 });
    }
    return new Response(JSON.stringify({ error: 'Signup failed', details: error.message }), { status: 500 });
  }
}
