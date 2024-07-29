// src/lib/news.ts
import pool from '../../src/lib/db';

export const getNewsById = async (id: number): Promise<any> => {
  const [rows] = await pool.execute('SELECT * FROM news WHERE id = ?', [id]);
  if (Array.isArray(rows) && rows.length > 0) {
    return rows[0];
  }
  return null;
};

export const updateNews = async (id: number, newsItem: { title: string; content: string}) => {
  const { title, content} = newsItem;
  await pool.execute(
    'UPDATE news SET title = ?, content = ? WHERE id = ?',
    [title, content,  id]
  );
};

export const verifyNews = async (id: number, verifierName: string) => {
  await pool.execute(
    'UPDATE news SET status = ?, nama_verifikator = ?, tanggal_verifikasi = NOW() WHERE id = ?',
    ['verifikasi',verifierName, id]
  );
};