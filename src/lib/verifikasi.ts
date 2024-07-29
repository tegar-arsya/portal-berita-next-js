// src/lib/news.ts
import pool from '../../src/lib/db';

export const getNewsById = async (id: number): Promise<any> => {
  const [rows] = await pool.execute('SELECT * FROM verifikasi_berita WHERE id = ?', [id]);
  if (Array.isArray(rows) && rows.length > 0) {
    return rows[0];
  }
  return null;
};

