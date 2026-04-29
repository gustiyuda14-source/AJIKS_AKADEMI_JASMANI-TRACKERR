import { VercelRequest, VercelResponse } from '@vercel/node';
import { query } from '../db';
import { extractToken, verifyToken } from '../auth';
import PolriEngine from '../polriEngine';

export default async function handler(req: VercelRequest, res: VercelResponse) {
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
    // Create entries table if it doesn't exist
    await query(
      `CREATE TABLE IF NOT EXISTS training_entries (
        id SERIAL PRIMARY KEY,
        member_id INT REFERENCES members(id),
        entry_date DATE NOT NULL,
        run12_meters INT,
        fig8_seconds DECIMAL(4,1),
        pushup_reps INT,
        situp_reps INT,
        pullup_reps INT,
        score INT,
        grade VARCHAR(5),
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(member_id, entry_date)
      )`
    );

    if (req.method === 'POST') {
      const {
        memberId,
        entryDate,
        run12Meters,
        fig8Seconds,
        pushupReps,
        situpReps,
        pullupReps,
        notes,
      } = req.body;

      if (!memberId || !entryDate) {
        return res.status(400).json({
          success: false,
          error: { code: 'INVALID_INPUT', message: 'Missing required fields' },
        });
      }

      // Get member to determine gender
      const memberResult = await query(
        'SELECT gender FROM members WHERE id = $1',
        [memberId]
      );

      if (memberResult.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: { code: 'NOT_FOUND', message: 'Member not found' },
        });
      }

      const { gender } = memberResult.rows[0];

      // Calculate score using POLRI Engine
      const scoring = PolriEngine.calculateFinalScore(
        gender as 'L' | 'P',
        run12Meters || 0,
        fig8Seconds || 0,
        pushupReps || 0,
        situpReps || 0,
        pullupReps || 0
      );

      const result = await query(
        `INSERT INTO training_entries (member_id, entry_date, run12_meters, fig8_seconds, pushup_reps, situp_reps, pullup_reps, score, grade, notes)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         RETURNING id, member_id as "memberId", entry_date as "entryDate", run12_meters as "run12Meters",
                   fig8_seconds as "fig8Seconds", pushup_reps as "pushupReps", situp_reps as "situpReps",
                   pullup_reps as "pullupReps", score, grade`,
        [
          memberId,
          entryDate,
          run12Meters || null,
          fig8Seconds || null,
          pushupReps || null,
          situpReps || null,
          pullupReps || null,
          scoring.finalScore,
          scoring.grade,
          notes || null,
        ]
      );

      return res.status(201).json({
        success: true,
        data: {
          ...result.rows[0],
          scoring,
        },
      });
    }

    if (req.method === 'GET') {
      const { memberId } = req.query;

      let sql = 'SELECT * FROM training_entries ORDER BY entry_date DESC LIMIT 50';
      const params = [];

      if (memberId) {
        sql = 'SELECT * FROM training_entries WHERE member_id = $1 ORDER BY entry_date DESC LIMIT 50';
        params.push(memberId);
      }

      const result = await query(sql, params);

      return res.status(200).json({
        success: true,
        data: result.rows,
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Entries error:', error);
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Internal server error' },
    });
  }
}
