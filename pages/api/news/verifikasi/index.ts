import { NextApiRequest, NextApiResponse } from 'next';
import pool from '../../../../src/lib/db';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
  res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all origins
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  try {
    const [rows] = await pool.execute('SELECT * FROM news WHERE status = ? ORDER BY createdAt DESC', ['verifikasi']);
  
    if (Array.isArray(rows)) {
      const newsWithImageUrl = rows.map((news: any) => {
        const images = news.image ? news.image.replace(/^\[|\]$/g, '').replace(/"/g, '').split(',') : [];
        return {
          ...news,
          mainImage: images.length > 0 ? `/uploads/${images[0]}` : null,
          aboveContentImage: images.length > 1 ? `/uploads/${images[1]}` : null,
          belowContentImage: images.length > 2 ? `/uploads/${images[2]}` : null,
          otherImages: images.slice(3).map((img: string) => `/uploads/${img}`)
        };
      });
  
      return res.status(200).json(newsWithImageUrl);
    } else {
      console.error('Invalid result type:', rows);
      return res.status(500).json({ message: 'Invalid result type', error: 'Invalid result type' });
    }
  } catch (error) {
    console.error('Failed to fetch verified news:', error);
    return res.status(500).json({ message: 'Failed to fetch verified news', error: (error as Error).message });
  }
};

export default handler;
