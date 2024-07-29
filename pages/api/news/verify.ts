// src/pages/api/news/verify.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { verifyNews } from '../../../src/lib/news';
import jwt from 'jsonwebtoken';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { id } = req.body;
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
      const verifierName = decoded.Name;

      await verifyNews(id, verifierName);
      res.status(200).json({ message: 'News item verified successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to verify news item' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};

export default handler;
