// pages/api/auth/login.ts
import { NextApiRequest, NextApiResponse } from 'next';
import pool from '../../../src/lib/db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Missing fields' });
  }

  try {
    const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
    const users = rows as any[];

    if (users.length === 0) {
      return res.status(401).json({ message: 'Login failed' });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Login failed' });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, Name: user.nama, email: user.email, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: '1h' }
    );

    res.status(200).json({ message: 'Login successful', token, userId: user.id });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: (error as Error).message });
  }
}
