// pages/api/news/[id].ts
import { NextApiRequest, NextApiResponse } from 'next';
import { getNewsById, updateNews } from '../../../src/lib/news';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const newsItem = await getNewsById(Number(id));
      if (newsItem) {
        res.status(200).json(newsItem);
      } else {
        res.status(404).json({ message: 'News item not found' });
      }
    } catch (error) {
      console.error('Failed to fetch news item:', error);
      res.status(500).json({ message: 'Failed to fetch news item' });
    }
  } else if (req.method === 'DELETE') {
    try {
      await getNewsById(Number(id));
      res.status(200).json({ message: 'News item deleted successfully' });
    } catch (error) {
      console.error('Failed to delete news item:', error);
      res.status(500).json({ message: 'Failed to delete news item' });
    }
  } else if (req.method === 'PUT') {
    try {
      const { title, content } = req.body;
      await updateNews(Number(id), { title, content});
      res.status(200).json({ message: 'News item updated successfully' });
    } catch (error) {
      console.error('Failed to update news item:', error);
      res.status(500).json({ message: 'Failed to update news item' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'DELETE', 'PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default handler;
