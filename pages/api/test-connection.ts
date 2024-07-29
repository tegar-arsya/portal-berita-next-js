import { NextApiRequest, NextApiResponse } from 'next';
import pool from '../../src/lib/db';



export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const [rows] = await pool.query('SELECT 1');
    res.status(200).json({ message: 'Database connection successful', data: rows });
  } catch (error) {
    const typedError = error as Error; // Type assertion to tell TypeScript that error is of type Error
    res.status(500).json({ message: 'Database connection failed', error: typedError.message });
  }
}
