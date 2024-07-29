import { NextApiRequest, NextApiResponse } from 'next';
import mysql from 'mysql2/promise';
import pool from '../../../src/lib/db';
import bcrypt from 'bcrypt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Log the entire request body to see what is being received
  console.log('Request body:', req.body);

  const { nama, email, password } = req.body;

  if (!nama || !email || !password) {
    return res.status(400).json({ message: 'Missing fields' });
  }

  try {
    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert user into the database with hashed password
    const [result] = await pool.execute(
      'INSERT INTO users (nama, email, password) VALUES (?, ?, ?)',
      [nama, email, hashedPassword]
    );

    const insertId = (result as mysql.ResultSetHeader).insertId;

    res.status(201).json({ message: 'User registered successfully', userId: insertId });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error: (error as Error).message });
  }
}
