// pages/api/news/upload-image.ts

import { NextApiRequest, NextApiResponse } from 'next';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

// Configure Multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // limit file size to 100MB
}).single('upload'); // Allow single file upload with field name 'upload'

const multerMiddleware = (req: NextApiRequest, res: NextApiResponse, next: Function) => {
  upload(req as any, res as any, (err: any) => {
    if (err) return next(err);
    next();
  });
};

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
    await runMiddleware(req, res, multerMiddleware);

    const file = (req as any).file; // Type assertion to access file

    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, file.originalname);
    fs.writeFileSync(filePath, file.buffer);

    const imageUrl = `/uploads/${file.originalname}`;

    return res.status(201).json({ url: imageUrl });
  } catch (error) {
    console.error('Error uploading image:', error);
    return res.status(500).json({ message: 'Failed to upload image', error: (error as Error).message });
  }
};

export default handler;

export const config = {
  api: {
    bodyParser: false // Disable body parsing, so multer can handle the request
  }
};
