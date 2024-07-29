// types/next.d.ts
import 'next';
import { Multer } from 'multer';

declare module 'next' {
  interface NextApiRequest {
    file?: Multer.File; // Add file property for multer
  }
}
