import { VercelRequest, VercelResponse } from '@vercel/node';
import { query } from '../db';
import { extractToken, verifyToken } from '../auth';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const token = extractToken(req.headers.authorization);
  if (!token || !verifyToken(token)) {
    return res.status(401).json({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'Unauthorized' },
    });
  }

  try {
    // Create members table if it doesn't exist
    await query(
      `CREATE TABLE IF NOT EXISTS members (
        id SERIAL PRIMARY KEY,
        member_id VARCHAR(20) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        gender VARCHAR(1) NOT NULL,
        height_cm INT,
        weight_init_kg DECIMAL(5,2),
        weight_current_kg DECIMAL(5,2),
        status VARCHAR(20) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`
    );

    if (req.method === 'GET') {
      const result = await query(
        'SELECT id, member_id, name, gender, weight_current_kg as "weightCurrent", height_cm as "heightCm", status FROM members WHERE status = $1 ORDER BY name',
        ['active']
      );

      return res.status(200).json({
        success: true,
        data: result.rows,
      });
    }

    if (req.method === 'POST') {
      const { name, gender, heightCm, weightInitKg, weightCurrentKg } = req.body;

      if (!name || !gender || !heightCm || !weightInitKg || !weightCurrentKg) {
        return res.status(400).json({
          success: false,
          error: { code: 'INVALID_INPUT', message: 'Missing required fields' },
        });
      }

      // Generate member ID
      const countResult = await query('SELECT COUNT(*) FROM members');
      const count = parseInt(countResult.rows[0].count) + 1;
      const memberId = `M${String(count).padStart(3, '0')}`;

      const result = await query(
        `INSERT INTO members (member_id, name, gender, height_cm, weight_init_kg, weight_current_kg)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id, member_id as "memberId", name, gender, height_cm as "heightCm", weight_current_kg as "weightCurrent"`,
        [memberId, name, gender, heightCm, weightInitKg, weightCurrentKg]
      );

      return res.status(201).json({
        success: true,
        data: result.rows[0],
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Members error:', error);
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Internal server error' },
    });
  }
}
