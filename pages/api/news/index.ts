import { NextApiRequest, NextApiResponse } from 'next';
import pool from '../../../src/lib/db';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const [rows] = await pool.execute('SELECT * FROM news ORDER BY createdAt DESC');
    return res.status(200).json(rows);
  } catch (error) {
    console.error('Failed to fetch news:', error);
    return res.status(500).json({ message: 'Failed to fetch news', error: (error as Error).message });
  }
};

export default handler;
