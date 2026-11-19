import React, { useState } from 'react';
import { 
  Link2, ChevronDown, Check, Copy, Share2, 
  Database, Sparkles, MessageSquare, Loader2, ListOrdered 
} from 'lucide-react';
import { GRADUATION_DATA } from '../data/graduationData';
import { createAdminAuthorization } from '../api/adminAuth';

export default function LinkBuilder({
  currentGroup,
  guestName,
  gradName,
  apiUrl = '',
  credentials,
  onUnauthorized,
  onGroupChange,
  onGuestNameChange,
  onGradNameChange,
  onInvitationCreated,
  onOpenInvitationsList,
  onShowToast
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [customMessage, setCustomMessage] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedLink, setLastSavedLink] = useState(null);

  // Create unique permanent link and save into Database
  const handleCreateAndSaveToDb = async () => {
    if (!guestName || !guestName.trim()) {
      onShowToast?.("Vui lòng nhập tên khách mời trước khi tạo liên kết!");
      return;
    }

    setIsSaving(true);
    let unauthorized = false;
    try {
      const payload = {
        recipientName: guestName.trim(),
        senderName: gradName.trim() || 'Hà Lê Tín',
        guestGroup: currentGroup || 'family',
        customMessage: customMessage.trim() || null,
        recipientEmail: recipientEmail.trim() || null,
        recipientPhone: recipientPhone.trim() || null,
        code: customCode.trim() || null
      };

      const res = await fetch(`${apiUrl}/api/invitations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: createAdminAuthorization(credentials)
        },
        body: JSON.stringify(payload)
      });

      if (res.status === 401 || res.status === 403) {
        unauthorized = true;
        onUnauthorized?.();
        throw new Error('Phiên quản trị đã hết hạn.');
      }
      if (!res.ok) {
        throw new Error(`Lỗi máy chủ (${res.status}): ${res.statusText}`);
      }

      const savedInvitation = await res.json();
      const uniqueCode = savedInvitation.code;
      const uniqueUrl = `${window.location.origin}${window.location.pathname}?code=${encodeURIComponent(uniqueCode)}`;

      setLastSavedLink({
        code: uniqueCode,
        url: uniqueUrl,
        recipientName: savedInvitation.recipientName
      });

      // Update browser URL
      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.set('code', uniqueCode);
      currentUrl.searchParams.delete('group');
      currentUrl.searchParams.delete('name');
      window.history.replaceState({}, '', currentUrl.toString());

      // Copy to clipboard
      navigator.clipboard.writeText(uniqueUrl).then(() => {
        onShowToast?.(`Đã lưu DB & sao chép link duy nhất cho "${savedInvitation.recipientName}"!`);
      }).catch(() => {
        onShowToast?.(`Đã lưu DB: ${uniqueUrl}`);
      });

      onInvitationCreated?.(savedInvitation);

    } catch (err) {
      if (unauthorized) {
        onShowToast?.('Vui lòng đăng nhập lại để tiếp tục thao tác quản trị.');
        return;
      }
      console.error("Failed to save invitation link:", err);
      const errorMessage = err instanceof TypeError
        ? 'Không kết nối được backend. Kiểm tra backend rồi thử lại.'
        : err.message;
      onShowToast?.(`Không thể tạo link mời: ${errorMessage}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 transition-all duration-300 max-w-[calc(100vw-2rem)]">
      {/* Compact toggle button when collapsed */}
      {!isExpanded && (
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenInvitationsList}
            title="Xem danh sách liên kết đã lưu trong DB"
            className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 text-navy px-3.5 py-2.5 rounded-full shadow-lg border border-slate-300 text-xs font-semibold transition active:scale-95"
          >
            <Database className="w-4 h-4 text-champagne" />
            <span className="hidden sm:inline">Liên kết đã lưu (DB)</span>
          </button>

          <button
            onClick={() => setIsExpanded(true)}
            title="Tùy chỉnh & Tạo link thiệp mời duy nhất"
            className="inline-flex items-center gap-2 bg-navy/95 hover:bg-navy backdrop-blur-md text-cream px-4 py-2.5 rounded-full shadow-lg border border-champagne/40 text-xs font-medium transition active:scale-95"
          >
            <Link2 className="w-4 h-4 text-champagne" />
            <span className="font-semibold">Tạo link mời riêng (Lưu DB)</span>
          </button>
        </div>
      )}

      {/* Expanded Builder Panel */}
      {isExpanded && (
        <div className="w-[92vw] sm:w-[680px] lg:w-[820px] bg-navy/95 backdrop-blur-md text-cream rounded-2xl shadow-2xl border border-champagne/30 p-4 sm:p-5 animate-fade-in max-h-[90vh] overflow-y-auto">
          
          {/* Header */}
          <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-champagne animate-pulse"></span>
              <span className="text-xs font-bold uppercase tracking-wider text-champagne">
                Tạo Liên Kết Thiệp Mời Duy Nhất & Lưu Database
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenInvitationsList}
                className="inline-flex items-center gap-1 text-xs bg-navyLight hover:bg-white/15 text-champagne px-2.5 py-1 rounded-lg border border-champagne/30 transition"
                title="Xem toàn bộ liên kết trong Database"
              >
                <Database className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Quản lý link DB</span>
              </button>

              <button
                onClick={() => setIsExpanded(false)}
                className="inline-flex items-center gap-1 text-xs text-slate-300 hover:text-white px-2 py-1 rounded-lg hover:bg-white/10 transition"
              >
                <span>Thu gọn</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 3 Guest Group Tabs */}
          <div className="grid grid-cols-3 gap-1.5 bg-navyLight/80 p-1.5 rounded-xl mb-3">
            {Object.values(GRADUATION_DATA).map((group) => {
              const isActive = currentGroup === group.key;
              return (
                <button
                  key={group.key}
                  type="button"
                  onClick={() => onGroupChange(group.key)}
                  className={`py-2 px-2 rounded-lg text-xs font-medium transition text-center ${
                    isActive
                      ? 'bg-champagne text-navy font-bold shadow'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {group.label}
                </button>
              );
            })}
          </div>

          {/* Input Guest Name, Grad Name & Action */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                Tên khách mời <span className="text-champagne">*</span>
              </label>
              <input
                type="text"
                value={guestName}
                onChange={(e) => onGuestNameChange(e.target.value)}
                placeholder="VD: Ba Mẹ, Thầy Hùng, Bạn Linh..."
                className="w-full bg-navyLight border border-white/20 focus:border-champagne rounded-xl px-3 py-2 text-xs text-white placeholder-slate-400 outline-none transition"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                Tên Tân Cử Nhân
              </label>
              <input
                type="text"
                value={gradName}
                onChange={(e) => onGradNameChange(e.target.value)}
                placeholder="VD: Hà Lê Tín..."
                className="w-full bg-navyLight border border-white/20 focus:border-champagne rounded-xl px-3 py-2 text-xs text-white placeholder-slate-400 outline-none transition"
              />
            </div>
          </div>

          {/* Toggle Advanced: Custom Wish & Custom Slug */}
          <div className="mb-3">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-xs text-champagneLight hover:text-white inline-flex items-center gap-1 transition"
            >
              <span>{showAdvanced ? '▲ Ẩn tùy chỉnh lời chúc & mã link' : '▼ Tùy chỉnh lời chúc riêng & mã liên kết (Tùy chọn)'}</span>
            </button>

            {showAdvanced && (
              <div className="mt-2 space-y-2 bg-navyLight/60 p-3 rounded-xl border border-white/10 animate-fade-in">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Lời chúc / Tâm thư riêng biệt cho người này (Lưu vào DB):
                  </label>
                  <textarea
                    rows={2}
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    placeholder="Nhập lời chúc hoặc kỷ niệm riêng với khách mời này..."
                    className="w-full bg-navyLight border border-white/20 focus:border-champagne rounded-xl px-3 py-2 text-xs text-white placeholder-slate-400 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Mã đường dẫn riêng (slug tùy chọn, để trống sẽ tự tạo tự động):
                  </label>
                  <input
                    type="text"
                    value={customCode}
                    onChange={(e) => setCustomCode(e.target.value)}
                    placeholder="VD: ba-me, thay-tuan, hoi-ban-than..."
                    className="w-full bg-navyLight border border-white/20 focus:border-champagne rounded-xl px-3 py-2 text-xs text-white placeholder-slate-400 outline-none transition font-mono"
                  />
                </div>

                {/* New fields for email and phone */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Email người nhận (nếu có):
                  </label>
                  <input
                    type="email"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    placeholder="VD: email@domain.com"
                    className="w-full bg-navyLight border border-white/20 focus:border-champagne rounded-xl px-3 py-2 text-xs text-white placeholder-slate-400 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Số điện thoại người nhận (nếu có):
                  </label>
                  <input
                    type="tel"
                    value={recipientPhone}
                    onChange={(e) => setRecipientPhone(e.target.value)}
                    placeholder="VD: 0123456789"
                    className="w-full bg-navyLight border border-white/20 focus:border-champagne rounded-xl px-3 py-2 text-xs text-white placeholder-slate-400 outline-none transition"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Button: Create & Save to Database */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-white/10">
            <button
              onClick={handleCreateAndSaveToDb}
              disabled={isSaving}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-champagne hover:bg-amber-500 text-navy font-bold text-xs py-2.5 px-5 rounded-xl shadow-md transition active:scale-95"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-navy" />
                  <span>Đang lưu vào Database...</span>
                </>
              ) : (
                <>
                  <Database className="w-4 h-4" />
                  <span>Tạo liên kết duy nhất & Lưu vào Database</span>
                </>
              )}
            </button>
          </div>

          {/* Recently Saved Link Banner */}
          {lastSavedLink && (
            <div className="mt-3 p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 animate-fade-in">
              <div className="truncate flex-1">
                <span className="font-bold text-white block">✓ Đã lưu thành công cho {lastSavedLink.recipientName}:</span>
                <span className="font-mono text-[11px] text-champagneLight truncate">{lastSavedLink.url}</span>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(lastSavedLink.url);
                  onShowToast?.("Đã sao chép liên kết duy nhất!");
                }}
                className="inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-3 py-1.5 rounded-lg text-xs shrink-0 transition"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Sao chép</span>
              </button>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
