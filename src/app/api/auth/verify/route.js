import jwt from 'jsonwebtoken';

const secret = process.env.AUTH_SECRET;

export async function POST(request) {
  try {
    const { token } = await request.json();
    if (!token) {
      return new Response(JSON.stringify({ error: 'Token is required' }), { status: 400 });
    }

    const decoded = jwt.verify(token, secret);
    return new Response(JSON.stringify({ message: 'Token is valid', user: decoded }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Invalid or expired token', details: error.message }), { status: 401 });
  }
}
