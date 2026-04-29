import { VercelRequest, VercelResponse } from '@vercel/node';
import { query } from '../db';
import { verifyPassword, generateToken } from '../auth';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_INPUT', message: 'Username and password required' },
      });
    }

    // First, create users table if it doesn't exist
    await query(
      `CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        username VARCHAR(100) UNIQUE NOT NULL,
        email VARCHAR(255),
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(20) DEFAULT 'coach',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`
    );

    const result = await query(
      'SELECT id, username, email, role FROM users WHERE username = $1',
      [username]
    );

    if (result.rows.length === 0) {
      // Try demo user
      if (username === 'coach' && password === 'password') {
        const token = generateToken('demo-user-id', 'coach');
        return res.status(200).json({
          success: true,
          data: {
            token,
            user: {
              id: 'demo-user-id',
              username: 'coach',
              email: 'coach@ajiks.local',
              role: 'coach',
            },
          },
        });
      }
      return res.status(401).json({
        success: false,
        error: { code: 'INVALID_CREDENTIALS', message: 'Invalid credentials' },
      });
    }

    const user = result.rows[0];
    const passwordResult = await query(
      'SELECT password_hash FROM users WHERE id = $1',
      [user.id]
    );

    if (
      passwordResult.rows.length === 0 ||
      !verifyPassword(password, passwordResult.rows[0].password_hash)
    ) {
      return res.status(401).json({
        success: false,
        error: { code: 'INVALID_CREDENTIALS', message: 'Invalid credentials' },
      });
    }

    const token = generateToken(user.id, user.username);

    return res.status(200).json({
      success: true,
      data: {
        token,
        user,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Internal server error' },
    });
  }
}
