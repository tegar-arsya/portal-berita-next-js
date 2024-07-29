import { NextApiRequest, NextApiResponse } from 'next';
import pool from '../../../src/lib/db';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

// Configure Multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // batasan ukuran file 10MB
  });

// Middleware to handle file upload
const multerMiddleware = upload.array('images', 10); // Accept up to 10 files

// Helper to run middleware in Next.js
const runMiddleware = (req: NextApiRequest, res: NextApiResponse, fn: Function) => {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    // Run Multer middleware
    await runMiddleware(req, res, multerMiddleware);

    const { title, content } = req.body;
    const files = (req as any).files; // Type assertion to access files
    const token = req.headers.authorization?.split(' ')[1];

    if (!title || !content || !files || files.length === 0 || !token) {
      console.error('Missing fields or files');
      return res.status(400).json({ message: 'Missing fields or files' });
    }

    // Verify token
    let decodedToken;
    try {
      decodedToken = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string, Name: string };
    } catch (error) {
      console.error('Token verification failed:', error);
      return res.status(401).json({ message: 'Invalid token' });
    }

    const userId = decodedToken.userId;
    const Name = decodedToken.Name;
    // Log to debug
    console.log('User ID:', userId);

    // Save files to public/uploads directory
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const imagePaths: string[] = [];
    files.forEach((file: any) => {
      const filePath = path.join(uploadDir, file.originalname);
      fs.writeFileSync(filePath, file.buffer);
      imagePaths.push(file.originalname);
    });

    // Save data to database
    try {
      await pool.execute(
        'INSERT INTO news (title, image, content, userName) VALUES (?, ?, ?, ?)',
        [title, JSON.stringify(imagePaths), content, Name]
      );
    } catch (error) {
      console.error('Database insert failed:', error);
      return res.status(500).json({ message: 'Database insert failed', error: (error as Error).message });
    }

    return res.status(201).json({ message: 'News posted successfully' });
  } catch (error) {
    console.error('Error posting news:', error);
    return res.status(500).json({ message: 'Failed to post news', error: (error as Error).message });
  }
};

export default handler;
export const config = {
  api: {
    bodyParser: false // Disable body parsing, so multer can handle the request
  }
};
