import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-100 bg-black/90 backdrop-blur border-b-2 border-fire px-8 h-16 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 border-2 border-fire rounded-full flex items-center justify-center text-fire text-lg">
          ⚽
        </div>
        <h1 className="font-bold text-lg uppercase tracking-wider">
          <span className="text-fire">JASMANI</span> Tracker
        </h1>
      </div>

      <div className="flex gap-1">
        <button
          onClick={() => navigate('/')}
          className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-text-2 hover:text-gold hover:border-gold border border-transparent transition"
        >
          Dashboard
        </button>
        <button
          onClick={() => navigate('/members')}
          className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-text-2 hover:text-gold hover:border-gold border border-transparent transition"
        >
          Members
        </button>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm text-text-2">{user?.username}</span>
        <button
          onClick={handleLogout}
          className="btn btn-fire text-xs"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
