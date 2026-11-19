import React, { useState, useEffect } from 'react';
import { X, Link2, Copy, Trash2, ExternalLink, RefreshCw, Plus, Check } from 'lucide-react';
import { createAdminAuthorization } from '../api/adminAuth';

export default function InvitationsListModal({
  isOpen,
  onClose,
  apiUrl = '',
  credentials,
  onUnauthorized,
  onSelectInvitation,
  onShowToast
}) {
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [copiedCode, setCopiedCode] = useState(null);
  const [error, setError] = useState('');

  const fetchInvitations = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${apiUrl}/api/invitations`, {
        headers: { Authorization: createAdminAuthorization(credentials) },
        cache: 'no-store'
      });
      if (res.status === 401 || res.status === 403) {
        onUnauthorized?.();
        return;
      }
      if (res.ok) {
        const data = await res.json();
        setInvitations(data);
      } else {
        setError(`Không tải được danh sách liên kết (HTTP ${res.status}).`);
      }
    } catch (requestError) {
      console.error("Failed to load invitations:", requestError);
      setError('Không kết nối được máy chủ. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && credentials) {
      fetchInvitations();
    }
  }, [isOpen, credentials]);

  if (!isOpen) return null;

  const handleCopyLink = (code, recipientName) => {
    const fullUrl = `${window.location.origin}${window.location.pathname}?code=${encodeURIComponent(code)}`;
    navigator.clipboard.writeText(fullUrl).then(() => {
      setCopiedCode(code);
      onShowToast?.(`Đã sao chép liên kết cho "${recipientName}"!`);
      setTimeout(() => setCopiedCode(null), 2500);
    }).catch(() => {
      onShowToast?.(`Đã sao chép liên kết: ${fullUrl}`);
    });
  };

  const handleDelete = async (id, recipientName) => {
    if (!window.confirm(`Bạn có chắc muốn xóa liên kết của "${recipientName}"?`)) {
      return;
    }
    try {
      const res = await fetch(`${apiUrl}/api/invitations/${id}`, {
        method: 'DELETE',
        headers: { Authorization: createAdminAuthorization(credentials) }
      });
      if (res.status === 401 || res.status === 403) {
        onUnauthorized?.();
        return;
      }
      if (res.ok) {
        setInvitations(prev => prev.filter(inv => inv.id !== id));
        onShowToast?.(`Đã xóa liên kết của "${recipientName}"!`);
      } else {
        setError(`Không thể xóa liên kết (HTTP ${res.status}).`);
      }
    } catch (requestError) {
      console.error("Failed to delete invitation:", requestError);
      setError('Không kết nối được máy chủ. Vui lòng thử lại.');
    }
  };

  const getGroupLabel = (group) => {
    switch (group) {
      case 'friends': return 'Bạn bè & Đồng môn';
      case 'mentors': return 'Thầy Cô & Hướng dẫn';
      default: return 'Gia đình & Người thân';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-3xl bg-ivory rounded-3xl shadow-2xl border border-slate-200 flex flex-col max-h-[85vh] overflow-hidden text-navy">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-cream">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-navy text-champagne flex items-center justify-center shadow-sm">
              <Link2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-navy">
                Quản Lý Liên Kết Thiệp Mời (Database)
              </h3>
              <p className="text-xs text-slateText">
                Danh sách các liên kết duy nhất được tạo và lưu vĩnh viễn trong cơ sở dữ liệu
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchInvitations}
              disabled={loading}
              className="p-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slateText transition"
              title="Làm mới"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-navy hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body / Table */}
        <div className="p-5 overflow-y-auto flex-1 space-y-3">
          {error && (
            <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
              {error}
            </p>
          )}
          {invitations.length === 0 ? (
            <div className="text-center py-12 text-slateText text-sm">
              Chưa có liên kết tùy biến nào trong Database. Hãy dùng công cụ bên dưới để tạo liên kết đầu tiên!
            </div>
          ) : (
            invitations.map((inv) => {
              const fullUrl = `${window.location.origin}${window.location.pathname}?code=${encodeURIComponent(inv.code)}`;
              const isCopied = copiedCode === inv.code;

              return (
                <div
                  key={inv.id || inv.code}
                  className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:border-champagne/60 transition"
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-base text-navy font-serif">
                        {inv.recipientName}
                      </span>
                      <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-champagneLight text-navy border border-champagne/40">
                        {getGroupLabel(inv.guestGroup)}
                      </span>
                      <span className="text-[10px] font-mono text-slateText bg-slate-100 px-2 py-0.5 rounded-md">
                        Mã: {inv.code}
                      </span>
                    </div>

                    {inv.customMessage && (
                      <p className="text-xs text-slate-600 line-clamp-1 italic bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                        "{inv.customMessage}"
                      </p>
                    )}

                    <div className="text-[11px] font-mono text-slateText truncate max-w-full">
                      <span className="text-navy font-semibold">Link: </span>
                      <span className="text-champagne-dark">{fullUrl}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <button
                      onClick={() => handleCopyLink(inv.code, inv.recipientName)}
                      className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold shadow-sm transition active:scale-95 ${
                        isCopied 
                          ? 'bg-emerald-600 text-white' 
                          : 'bg-champagne hover:bg-amber-500 text-navy'
                      }`}
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{isCopied ? 'Đã sao chép' : 'Sao chép link'}</span>
                    </button>

                    <button
                      onClick={() => {
                        onSelectInvitation?.(inv);
                        onClose();
                      }}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-navy hover:text-white text-navy border border-slate-200 transition"
                      title="Mở xem trước thiệp mời này"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>

                    {inv.id && (
                      <button
                        onClick={() => handleDelete(inv.id, inv.recipientName)}
                        className="p-2 rounded-xl bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-600 border border-rose-200 transition"
                        title="Xóa liên kết này"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slateText">
          <span>Tổng số liên kết đã lưu: <strong>{invitations.length}</strong></span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-navy text-ivory font-semibold hover:bg-navyLight transition"
          >
            Đóng
          </button>
        </div>

      </div>
    </div>
  );
}
