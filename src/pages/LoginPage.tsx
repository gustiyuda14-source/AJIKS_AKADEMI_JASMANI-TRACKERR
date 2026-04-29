import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading, error } = useAuthStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    try {
      await login(username, password);
      navigate('/');
    } catch {
      setLocalError(error || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-fire/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">🏃</span>
          </div>
          <h1 className="text-4xl font-bold uppercase tracking-wider mb-2">
            <span className="text-fire">JASMANI</span>
          </h1>
          <p className="text-text-2">Physical Fitness Tracker</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-surface border border-border-2 rounded p-8 space-y-6"
        >
          <div>
            <label className="block text-xs font-bold uppercase text-text-2 mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-text-2 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              required
              disabled={isLoading}
            />
          </div>

          {localError && (
            <div className="bg-fire/20 border border-fire text-fire text-sm p-3 rounded">
              {localError}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-fire w-full"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>

          <div className="text-center text-text-2 text-sm">
            Demo: username: <code className="text-gold">coach</code> |
            password: <code className="text-gold">password</code>
          </div>
        </form>
      </div>
    </div>
  );
}
