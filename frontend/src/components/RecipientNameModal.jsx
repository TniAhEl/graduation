import React, { useState } from 'react';
import { X, UserCheck } from 'lucide-react';

export default function RecipientNameModal({
  isOpen,
  onClose,
  currentName,
  onSave
}) {
  const [name, setName] = useState(currentName || "");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onSave(name.trim());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-sm bg-slate-900 border border-amber-500/30 rounded-2xl p-5 shadow-2xl text-slate-100">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-4 h-4" />
        </button>

        <h3 className="text-base font-serif font-bold text-white mb-2">
          Đổi Tên Người Được Mời
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          Nhập họ tên khách mời hiển thị trang trọng trên phong bì và thư mời:
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ví dụ: Anh Nguyễn Văn An & Gia Đình"
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
          />

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-lg text-slate-400 hover:text-white text-xs"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="gold-button px-4 py-2 rounded-lg text-xs font-bold"
            >
              Cập nhật tên
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

