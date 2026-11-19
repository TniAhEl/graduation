import React, { useState } from 'react';
import { LockKeyhole, X } from 'lucide-react';
import { createAdminAuthorization } from '../api/adminAuth';

export default function AdminLoginModal({
  isOpen,
  standalone = false,
  apiUrl = '',
  onClose,
  onLoginSuccess
}) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleClose = () => {
    setPassword('');
    setError('');
    onClose();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    const credentials = { username: username.trim(), password };
    try {
      const response = await fetch(`${apiUrl}/api/admin/auth`, {
        headers: {
          Authorization: createAdminAuthorization(credentials)
        },
        cache: 'no-store'
      });

      if (response.status === 401 || response.status === 403) {
        setError('Tên đăng nhập hoặc mật khẩu không đúng.');
        return;
      }
      if (!response.ok) {
        setError(`Không thể xác thực lúc này (HTTP ${response.status}).`);
        return;
      }

      onLoginSuccess(credentials);
      setPassword('');
    } catch (requestError) {
      console.error('Admin authentication request failed:', requestError);
      setError('Không kết nối được máy chủ. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={standalone
      ? 'min-h-screen flex items-center justify-center bg-gradient-to-br from-navy via-[#17324d] to-navy p-4'
      : 'fixed inset-0 z-[70] flex items-center justify-center bg-navy/70 p-4 backdrop-blur-sm'}>
      <div className="relative w-full max-w-sm rounded-3xl border border-slate-200 bg-ivory p-6 text-navy shadow-2xl">
        {!standalone && (
          <button
            type="button"
            onClick={handleClose}
            aria-label="Đóng"
            className="absolute right-4 top-4 rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-navy"
          >
            <X className="h-5 w-5" />
          </button>
        )}
        <div className="mb-5 flex items-center gap-3">
          <div className="rounded-xl bg-navy p-2.5 text-champagne">
            <LockKeyhole className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-serif text-xl font-bold">Đăng nhập quản trị</h2>
            <p className="text-xs text-slateText">Xác thực để quản lý dữ liệu thiệp mời</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm font-semibold">
            Tên đăng nhập
            <input
              autoComplete="username"
              required
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="mt-1.5 min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm outline-none focus:border-navy"
            />
          </label>
          <label className="block text-sm font-semibold">
            Mật khẩu
            <input
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-1.5 min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm outline-none focus:border-navy"
            />
          </label>
          {error && (
            <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-navy px-4 py-3 text-sm font-bold text-ivory transition hover:bg-navyLight disabled:opacity-60"
          >
            {loading ? 'Đang xác thực...' : 'Đăng nhập'}
          </button>
        </form>
        <p className="mt-4 text-center text-xs text-slateText">
          Thông tin đăng nhập chỉ được giữ trong tab hiện tại.
        </p>
      </div>
    </div>
  );
}
