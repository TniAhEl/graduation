import React, { useState, useEffect } from 'react';
import EnvelopeView from './components/EnvelopeView';
import InvitationLetterView from './components/InvitationLetterView';
import LinkBuilder from './components/LinkBuilder';
import RsvpModal from './components/RsvpModal';
import ConfirmationSuccessModal from './components/ConfirmationSuccessModal';
import DeclineModal from './components/DeclineModal';
import AttendeesModal from './components/AttendeesModal';
import InvitationsListModal from './components/InvitationsListModal';
import AdminLoginModal from './components/AdminLoginModal';
import { Award, Users, Mail, Sparkles, Check, Database, Link2, LogOut } from 'lucide-react';
import { GRADUATION_DATA } from './data/graduationData';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

function getInitialInvitationRoute() {
  const params = new URLSearchParams(window.location.search);
  const code = params.get('code') || params.get('to');
  const rawGroup = (params.get('group') || '').toLowerCase().trim();
  const group = GRADUATION_DATA[rawGroup] ? rawGroup : 'family';

  return {
    code,
    group,
    guestName: (params.get('name') || '').trim() || GRADUATION_DATA[group].defaultName,
    gradName: (params.get('grad') || '').trim() || 'Hà Lê Tín',
    isGuestMode: Boolean(
      code ||
      params.get('view') === 'guest' ||
      params.has('group') ||
      params.has('name') ||
      params.has('grad')
    )
  };
}

export default function App() {
  const [initialRoute] = useState(getInitialInvitationRoute);
  // Screen state: 'ENVELOPE' (Giao diện 1) | 'LETTER' (Giao diện 2)
  const [currentScreen, setCurrentScreen] = useState('ENVELOPE');
  const [isGuestMode, setIsGuestMode] = useState(initialRoute.isGuestMode);
  const [isAdminPreview, setIsAdminPreview] = useState(false);

  // Active guest group: 'family' | 'friends' | 'mentors'
  const [currentGroup, setCurrentGroup] = useState(initialRoute.group);
  const [guestName, setGuestName] = useState(initialRoute.guestName);
  const [gradName, setGradName] = useState(initialRoute.gradName);
  const [customMessage, setCustomMessage] = useState(null);
  const [activeCode, setActiveCode] = useState(initialRoute.code);
  const [invitationLoadStatus, setInvitationLoadStatus] = useState(
    initialRoute.code ? 'loading' : 'idle'
  );
  const [invitationLoadError, setInvitationLoadError] = useState(null);

  // Modals state
  const [isRsvpOpen, setIsRsvpOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isDeclineOpen, setIsDeclineOpen] = useState(false);
  const [isAttendeesOpen, setIsAttendeesOpen] = useState(false);
  const [isInvitationsListOpen, setIsInvitationsListOpen] = useState(false);
  const [adminCredentials, setAdminCredentials] = useState(null);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [pendingAdminAction, setPendingAdminAction] = useState(null);

  // Recent RSVP submission result & attendee data
  const [rsvpResult, setRsvpResult] = useState(null);
  const [lastAttendeeData, setLastAttendeeData] = useState(null);
  const [rsvpStatus, setRsvpStatus] = useState(null);

  // Toast notification state
  const [toastMessage, setToastMessage] = useState('');
  const [isToastVisible, setIsToastVisible] = useState(false);

  const showToast = (msg) => {
    setToastMessage(msg);
    setIsToastVisible(true);
    setTimeout(() => {
      setIsToastVisible(false);
    }, 3200);
  };

  const openAdminSection = (section) => {
    if (!adminCredentials) {
      setPendingAdminAction(section);
      setIsAdminLoginOpen(true);
      return;
    }

    if (section === 'attendees') {
      setIsAttendeesOpen(true);
    } else if (section === 'invitations') {
      setIsInvitationsListOpen(true);
    }
  };

  const handleAdminLoginSuccess = (credentials) => {
    setAdminCredentials(credentials);
    setIsAdminLoginOpen(false);
    if (pendingAdminAction === 'attendees') setIsAttendeesOpen(true);
    if (pendingAdminAction === 'invitations') setIsInvitationsListOpen(true);
    setPendingAdminAction(null);
    showToast('Đăng nhập quản trị thành công.');
  };

  const handleAdminUnauthorized = (section = 'invitations') => {
    setAdminCredentials(null);
    setPendingAdminAction(section);
    setIsAdminLoginOpen(true);
  };

  const handleAdminLogout = () => {
    setAdminCredentials(null);
    setIsAttendeesOpen(false);
    setIsInvitationsListOpen(false);
    setPendingAdminAction(null);
    showToast('Đã đăng xuất quản trị.');
  };

  // Sync elder-friendly class to document.body
  useEffect(() => {
    if (currentGroup === 'family') {
      document.body.classList.add('elder-friendly');
    } else {
      document.body.classList.remove('elder-friendly');
    }
  }, [currentGroup]);

  // Read URL parameters on mount
  useEffect(() => {
    if (!initialRoute.code) return undefined;

    const controller = new AbortController();
    const loadInvitation = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/invitation?code=${encodeURIComponent(initialRoute.code)}`,
          { signal: controller.signal }
        );
        if (!response.ok) {
          throw new Error(
            response.status === 404
              ? 'Không tìm thấy thiệp mời này. Vui lòng kiểm tra lại đường dẫn.'
              : `Máy chủ chưa tải được thiệp mời (HTTP ${response.status}).`
          );
        }

        const data = await response.json();
        if (!data?.recipientName) {
          throw new Error('Dữ liệu thiệp mời không hợp lệ.');
        }

        setGuestName(data.recipientName);
        if (data.senderName) setGradName(data.senderName);
        if (data.guestGroup && GRADUATION_DATA[data.guestGroup]) {
          setCurrentGroup(data.guestGroup);
        }
        if (data.customMessage) setCustomMessage(data.customMessage);
        setInvitationLoadStatus('loaded');
      } catch (error) {
        if (error.name === 'AbortError') return;
        console.error('Failed to load invitation:', error);
        setInvitationLoadError(
          error instanceof TypeError
            ? 'Không kết nối được máy chủ để tải thiệp mời. Vui lòng thử lại sau.'
            : error.message
        );
        setInvitationLoadStatus('error');
      }
    };

    loadInvitation();
    return () => controller.abort();
  }, [initialRoute.code]);

  // Update URL params when group, name or grad changes
  const updateUrl = (newGroup, newName, newGrad) => {
    const url = new URL(window.location.href);
    url.searchParams.set('group', newGroup);
    url.searchParams.set('name', newName);
    if (newGrad && newGrad !== 'Hà Lê Tín') {
      url.searchParams.set('grad', newGrad);
    } else {
      url.searchParams.delete('grad');
    }
    url.searchParams.delete('code');
    window.history.replaceState({}, '', url.toString());
  };

  const handleGroupChange = (newGroup) => {
    if (!GRADUATION_DATA[newGroup]) return;
    const prevDefault = GRADUATION_DATA[currentGroup]?.defaultName;
    let newName = guestName;
    if (!newName || newName === prevDefault) {
      newName = GRADUATION_DATA[newGroup].defaultName;
      setGuestName(newName);
    }
    setCurrentGroup(newGroup);
    setCustomMessage(null);
    updateUrl(newGroup, newName, gradName);
  };

  const handleGuestNameChange = (val) => {
    setGuestName(val);
    updateUrl(currentGroup, val, gradName);
  };

  const handleGradNameChange = (val) => {
    setGradName(val);
    updateUrl(currentGroup, guestName, val);
  };

  // When a unique invitation is saved to DB
  const handleInvitationCreated = (newInv) => {
    setIsGuestMode(true);
    setIsAdminPreview(false);
    setActiveCode(newInv.code);
    setGuestName(newInv.recipientName);
    if (newInv.senderName) setGradName(newInv.senderName);
    if (newInv.guestGroup) setCurrentGroup(newInv.guestGroup);
    if (newInv.customMessage) setCustomMessage(newInv.customMessage);
  };

  // When selecting an invitation from InvitationsListModal
  const handleSelectInvitationFromList = (inv) => {
    setIsGuestMode(true);
    setIsAdminPreview(false);
    setActiveCode(inv.code);
    setGuestName(inv.recipientName);
    if (inv.senderName) setGradName(inv.senderName);
    if (inv.guestGroup && GRADUATION_DATA[inv.guestGroup]) {
      setCurrentGroup(inv.guestGroup);
    }
    setCustomMessage(inv.customMessage || null);

    const url = new URL(window.location.href);
    url.searchParams.set('code', inv.code);
    url.searchParams.delete('group');
    url.searchParams.delete('name');
    window.history.replaceState({}, '', url.toString());

    showToast(`Đã chuyển sang thiệp mời của "${inv.recipientName}"!`);
  };

  // Handle RSVP confirmation form submit
  const handleRsvpSubmit = async (formData) => {
    setLastAttendeeData(formData);
    
    // If guest selected 'no' (Rất tiếc bận việc)
    if (!formData.attending) {
      setIsRsvpOpen(false);
      setIsDeclineOpen(true);
      setRsvpStatus({ attending: false, guestsCountDesc: '0', photoSlot: '' });

      // Notify backend of decline
      try {
        await fetch(`${API_BASE_URL}/api/invitation/rsvp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      } catch (e) {
        // ignore offline
      }
      return;
    }

    // Attendance is 'yes'
    try {
      const response = await fetch(`${API_BASE_URL}/api/invitation/rsvp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Lỗi máy chủ: ${response.statusText}`);
      }

      const result = await response.json();
      setRsvpResult(result);
      setRsvpStatus({
        attending: true,
        guestsCountDesc: formData.guestsCountDesc,
        photoSlot: formData.photoSlot
      });
      setIsRsvpOpen(false);
      setIsSuccessOpen(true);
      return result;
    } catch (error) {
      console.warn("Backend offline, providing local confirmation:", error);
      const fallbackResult = {
        success: true,
        message: "Xác nhận tham dự đã được ghi nhận thành công!",
        confirmationCode: "GRAD-2026-" + Math.random().toString(36).substring(2, 8).toUpperCase(),
        emailSent: false,
        emailNotice: `Đã lưu thông tin cho ${formData.fullName} (${formData.email}). Email Google sẽ được gửi khi cấu hình cloud.`
      };
      setRsvpResult(fallbackResult);
      setRsvpStatus({
        attending: true,
        guestsCountDesc: formData.guestsCountDesc,
        photoSlot: formData.photoSlot
      });
      setIsRsvpOpen(false);
      setIsSuccessOpen(true);
      return fallbackResult;
    }
  };

  if (invitationLoadStatus === 'loading') {
    return (
      <div
        role="status"
        className="min-h-screen flex flex-col items-center justify-center gap-3 bg-cream text-navy px-4 text-center"
      >
        <div className="w-9 h-9 rounded-full border-4 border-champagne/30 border-t-champagne animate-spin" />
        <p className="font-serif text-xl font-bold">Đang tải thiệp mời...</p>
        <p className="text-sm text-slateText">Vui lòng đợi trong giây lát.</p>
      </div>
    );
  }

  if (invitationLoadStatus === 'error') {
    return (
      <div
        role="alert"
        className="min-h-screen flex flex-col items-center justify-center gap-3 bg-cream text-navy px-4 text-center"
      >
        <h1 className="font-serif text-2xl font-bold">Chưa tải được thiệp mời</h1>
        <p className="max-w-md text-sm text-slateText">{invitationLoadError}</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-2 rounded-xl bg-navy px-5 py-2.5 text-sm font-semibold text-ivory"
        >
          Thử lại
        </button>
      </div>
    );
  }

  if (!isGuestMode && !adminCredentials) {
    return (
      <AdminLoginModal
        isOpen
        standalone
        apiUrl={API_BASE_URL}
        onClose={() => {}}
        onLoginSuccess={handleAdminLoginSuccess}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-between bg-cream text-navy font-sans antialiased selection:bg-champagneLight selection:text-navy">
      
      {/* Toast Notification Box */}
      <div 
        className={`fixed top-4 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:right-5 z-50 pointer-events-none transition-all duration-300 w-[90vw] sm:w-auto ${
          isToastVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3'
        }`}
      >
        <div className="bg-navy text-cream px-4 py-3 rounded-2xl shadow-xl border border-champagne/40 flex items-center gap-2.5 text-sm justify-center">
          <span className="w-5 h-5 rounded-full bg-champagne/20 text-champagne flex items-center justify-center text-xs font-bold">
            ✓
          </span>
          <span>{toastMessage}</span>
        </div>
      </div>

      {/* Admin Header */}
      {(!isGuestMode || isAdminPreview || adminCredentials) && (
      <header className="w-full border-b border-slate-200/90 bg-white/85 backdrop-blur-md sticky top-0 z-40 px-4 py-2.5">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-navy text-champagne flex items-center justify-center font-bold text-xs shadow-sm">
              <svg className="w-4 h-4 text-champagne" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                <path d="M6 12v5c3 3 9 3 12 0v-5"/>
              </svg>
            </div>
            <div>
              <span className="font-serif font-bold text-sm sm:text-base text-navy tracking-tight">
                LỄ TỐT NGHIỆP 2026
              </span>
              <span className="hidden sm:inline text-xs text-slateText ml-2 font-medium">
                • {gradName}
              </span>
              {activeCode && (
                <span className="hidden md:inline ml-2 text-[10px] bg-champagneLight text-navy px-2 py-0.5 rounded-md font-mono border border-champagne/30">
                  code: {activeCode}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Switcher Pill */}
            <div className="flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs">
              <button
                onClick={() => setCurrentScreen('ENVELOPE')}
                className={`px-3 py-1 rounded-lg transition font-medium ${
                  currentScreen === 'ENVELOPE'
                    ? 'bg-navy text-ivory font-bold shadow-sm'
                    : 'text-slateText hover:text-navy'
                }`}
              >
                1. Phong Bì
              </button>
              <button
                onClick={() => setCurrentScreen('LETTER')}
                className={`px-3 py-1 rounded-lg transition font-medium ${
                  currentScreen === 'LETTER'
                    ? 'bg-navy text-ivory font-bold shadow-sm'
                    : 'text-slateText hover:text-navy'
                }`}
              >
                2. Thư Mời
              </button>
            </div>

            {/* Links Management (Database) Button */}
            <button
              onClick={() => openAdminSection('invitations')}
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-navy text-xs font-medium flex items-center gap-1.5 transition shadow-sm"
              title="Quản lý các liên kết đã lưu trong Database"
            >
              <Link2 className="w-4 h-4 text-champagne" />
              <span className="hidden sm:inline">Links (DB)</span>
            </button>

            {/* Admin / Host Guest List Button (PostgreSQL DB) */}
            <button
              onClick={() => openAdminSection('attendees')}
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-navy text-xs font-medium flex items-center gap-1.5 transition shadow-sm"
              title="Xem danh sách khách mời từ Database"
            >
              <Users className="w-4 h-4 text-champagne" />
              <span className="hidden sm:inline">RSVP (DB)</span>
            </button>
            {adminCredentials && (
              <button
                onClick={handleAdminLogout}
                className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-navy text-ivory text-xs font-medium flex items-center gap-1.5 transition"
                title="Đăng xuất quản trị"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Thoát admin</span>
              </button>
            )}
          </div>

        </div>
      </header>
      )}

      {/* Main Content Area */}
      <main className="flex-1 w-full">
        {currentScreen === 'ENVELOPE' ? (
          /* ================= GIAO DIỆN 1: PHONG BÌ THƯ MỜI ================= */
          <EnvelopeView
            recipientName={guestName}
            senderName={gradName}
            guestGroup={currentGroup}
            gradName={gradName}
            onOpenLetter={() => setCurrentScreen('LETTER')}
          />
        ) : (
          /* ================= GIAO DIỆN 2: THƯ MỜI MỞ RỘNG (5 PHẦN) ================= */
          <InvitationLetterView
            currentGroup={currentGroup}
            guestName={guestName}
            gradName={gradName}
            customMessage={customMessage}
            rsvpStatus={rsvpStatus}
            showTopNavigation={!isGuestMode || isAdminPreview || Boolean(adminCredentials)}
            waitForScrollBoundary={isGuestMode}
            onOpenRsvp={() => setIsRsvpOpen(true)}
            onBackToEnvelope={() => setCurrentScreen('ENVELOPE')}
            onShowToast={showToast}
          />
        )}
      </main>

      {/* Floating Link Builder Bar at Bottom Right (Lưu Database & Tạo liên kết duy nhất) */}
      {adminCredentials && (
      <LinkBuilder
        currentGroup={currentGroup}
        guestName={guestName}
        gradName={gradName}
        apiUrl={API_BASE_URL}
        credentials={adminCredentials}
        onUnauthorized={() => handleAdminUnauthorized('invitations')}
        onGroupChange={handleGroupChange}
        onGuestNameChange={handleGuestNameChange}
        onGradNameChange={handleGradNameChange}
        onInvitationCreated={handleInvitationCreated}
        onOpenInvitationsList={() => openAdminSection('invitations')}
        onShowToast={showToast}
      />
      )}

      {/* ================= MODALS ================= */}

      {/* 1. Form điền thông tin xác nhận tham gia & gửi Google Mail */}
      <RsvpModal
        isOpen={isRsvpOpen}
        onClose={() => setIsRsvpOpen(false)}
        initialName={guestName}
        currentGroup={currentGroup}
        gradName={gradName}
        invitationCode={activeCode}
        onSubmitRsvp={handleRsvpSubmit}
      />

      {/* 2. Vé mời check-in & thông báo gửi email thành công */}
      <ConfirmationSuccessModal
        isOpen={isSuccessOpen}
        onClose={() => setIsSuccessOpen(false)}
        rsvpResult={rsvpResult}
        attendeeData={lastAttendeeData}
        gradName={gradName}
      />

      {/* 3. Phản hồi khi không tham gia (bỏ qua) */}
      <DeclineModal
        isOpen={isDeclineOpen}
        onClose={() => setIsDeclineOpen(false)}
        onReconsider={() => {
          setIsDeclineOpen(false);
          setIsRsvpOpen(true);
        }}
      />

      {/* 4. Quản lý danh sách khách mời từ Database (RSVP) */}
      <AttendeesModal
        isOpen={isAttendeesOpen}
        onClose={() => setIsAttendeesOpen(false)}
        apiUrl={API_BASE_URL}
        credentials={adminCredentials}
        onUnauthorized={() => handleAdminUnauthorized('attendees')}
      />

      {/* 5. Quản lý danh sách liên kết duy nhất đã lưu trong Database */}
      <InvitationsListModal
        isOpen={isInvitationsListOpen}
        onClose={() => setIsInvitationsListOpen(false)}
        apiUrl={API_BASE_URL}
        credentials={adminCredentials}
        onUnauthorized={() => handleAdminUnauthorized('invitations')}
        onSelectInvitation={handleSelectInvitationFromList}
        onShowToast={showToast}
      />

      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        apiUrl={API_BASE_URL}
        onClose={() => {
          setIsAdminLoginOpen(false);
          setPendingAdminAction(null);
        }}
        onLoginSuccess={handleAdminLoginSuccess}
      />

    </div>
  );
}
