import React, { useState, useEffect, useRef } from 'react';
import { 
  Calendar, MapPin, Download, ExternalLink, Phone, 
  ChevronLeft, ChevronRight, Award, Clock, AlertCircle, 
  CheckCircle2, ArrowDown, ArrowUp, RotateCcw, MousePointerClick 
} from 'lucide-react';
import CampusMap from './CampusMap';
import { GRADUATION_DATA } from '../data/graduationData';

export default function InvitationLetterView({
  currentGroup = 'family',
  guestName = 'Ba Mẹ',
  gradName = 'Hà Lê Tín',
  customMessage = null,
  rsvpStatus = null,
  showTopNavigation = true,
  waitForScrollBoundary = false,
  onOpenRsvp,
  onBackToEnvelope,
  onShowToast
}) {
  // Current active step index: 0 (Mở đầu), 1 (Lời mời), 2 (Địa điểm), 3 (Gửi xe), 4 (Cảm ơn)
  const [currentStep, setCurrentStep] = useState(0);

  const data = GRADUATION_DATA[currentGroup] || GRADUATION_DATA.family;
  const displayName = guestName.trim() || data.defaultName;
  const displayGrad = gradName.trim() || 'Hà Lê Tín';

  const isWheelLocked = useRef(false);
  const touchStartY = useRef(null);
  const containerRef = useRef(null);

  // Steps definition
  const STEPS = [
    { id: 0, label: '01. Mở đầu', title: 'Mở đầu & Định danh' },
    { id: 1, label: '02. Lời mời', title: 'Lời ngỏ riêng' },
    { id: 2, label: '03. Địa điểm', title: 'Thời gian & Địa điểm' },
    { id: 3, label: '04. Gửi xe', title: 'Sơ đồ & Gửi xe' },
    { id: 4, label: '05. Cảm ơn', title: 'Lời cảm ơn & Tri ân' }
  ];

  const goToStep = (stepIndex) => {
    if (stepIndex >= 0 && stepIndex < STEPS.length) {
      setCurrentStep(stepIndex);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      goToStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      goToStep(currentStep - 1);
    }
  };

  // Wheel event listener for switching sections on mouse scroll
  useEffect(() => {
    const handleWheel = (e) => {
      // If modal is open, do not intercept wheel
      if (document.querySelector('#rsvp-modal:not(.hidden)') || document.querySelector('.fixed.inset-0.z-50')) {
        return;
      }

      if (isWheelLocked.current) return;
      const scrollElement = document.scrollingElement || document.documentElement;
      const maxScrollTop = scrollElement.scrollHeight - window.innerHeight;
      const atScrollBoundary = e.deltaY > 0
        ? scrollElement.scrollTop >= maxScrollTop - 24
        : scrollElement.scrollTop <= 24;
      if (waitForScrollBoundary && !atScrollBoundary) return;

      if (e.deltaY > 35) {
        // Scroll down -> next section
        if (currentStep < STEPS.length - 1) {
          isWheelLocked.current = true;
          setCurrentStep(currentStep + 1);
          window.scrollTo({ top: 0, behavior: 'smooth' });
          setTimeout(() => {
            isWheelLocked.current = false;
          }, 650);
        }
      } else if (e.deltaY < -35) {
        // Scroll up -> previous section
        if (currentStep > 0) {
          isWheelLocked.current = true;
          setCurrentStep(currentStep - 1);
          window.scrollTo({ top: 0, behavior: 'smooth' });
          setTimeout(() => {
            isWheelLocked.current = false;
          }, 650);
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [currentStep, STEPS.length, waitForScrollBoundary]);

  // Keyboard navigation (Arrow keys / Space)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore if user is typing in input or textarea
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;

      if (e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        if (currentStep < STEPS.length - 1) {
          e.preventDefault();
          nextStep();
        }
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft' || e.key === 'PageUp') {
        if (currentStep > 0) {
          e.preventDefault();
          prevStep();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStep]);

  // Touch swipe support on Mobile
  const handleTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    if (touchStartY.current === null) return;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(deltaY) > 50) {
      if (deltaY < 0) {
        // Swiped up -> next step
        nextStep();
      } else {
        // Swiped down -> prev step
        prevStep();
      }
    }
    touchStartY.current = null;
  };

  // Background click to advance (ignores clicks on buttons, links, inputs)
  const handleContainerClick = (e) => {
    if (
      e.target.closest('button') || 
      e.target.closest('a') || 
      e.target.closest('input') || 
      e.target.closest('select') || 
      e.target.closest('textarea') ||
      e.target.closest('.interactive-stop')
    ) {
      return;
    }

    if (currentStep < STEPS.length - 1) {
      nextStep();
    }
  };

  // Download .ics calendar event
  const handleDownloadIcs = (e) => {
    e?.stopPropagation();
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Graduation Invitation//Class of 2026//VI',
      'BEGIN:VEVENT',
      'DTSTART:20261122T013000Z',
      'DTEND:20261122T050000Z',
      `SUMMARY:Lễ Tốt Nghiệp Đại Học — Tân Cử Nhân ${displayGrad}`,
      'LOCATION:Hội trường A5 - 268 Lý Thường Kiệt, Phường Diên Hồng, TP.HCM',
      `DESCRIPTION:Thiệp mời dự Lễ Tốt Nghiệp dành riêng cho ${displayName}. Rất mong được đón tiếp và chụp ảnh kỷ niệm!`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'Le-Tot-Nghiep-2026.ics';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    onShowToast?.('Đã tải lịch Lễ Tốt Nghiệp (.ics) về máy!');
  };

  return (
    <div 
      ref={containerRef}
      onClick={handleContainerClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="w-full min-h-screen bg-cream text-navy font-sans antialiased flex flex-col justify-between select-none relative overflow-x-hidden cursor-pointer"
      title="Click chuột hoặc cuộn con lăn để chuyển mục tiếp theo"
    >
      
      {/* ===================================================================== */}
      {/* THANH ĐIỀU HƯỚNG & TIẾN TRÌNH 5 BƯỚC CỐ ĐỊNH (CLICKABLE STEP INDICATOR) */}
      {/* ===================================================================== */}
      {showTopNavigation && (
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm interactive-stop">
        {/* Dải gradient trang trí */}
        <div className="w-full h-1.5 bg-gradient-to-r from-navy via-champagne to-navy"></div>

        <div className="max-w-4xl mx-auto px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onBackToEnvelope();
              }}
              className="inline-flex items-center gap-1 text-xs text-navy font-semibold hover:text-champagne transition px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200"
              title="Quay lại phong bì"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Phong bì</span>
            </button>
            <span className="font-semibold text-navy text-xs hidden sm:inline">CLASS OF 2026</span>
          </div>

          {/* Trình chọn nhanh 5 bước (Click trực tiếp vào mục để nhảy tới) */}
          <div className="flex items-center gap-1 sm:gap-2">
            {STEPS.map((step) => {
              const isActive = currentStep === step.id;
              const isPast = currentStep > step.id;
              return (
                <button
                  key={step.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    goToStep(step.id);
                  }}
                  className={`text-[11px] sm:text-xs font-semibold px-2 sm:px-3 py-1 rounded-lg transition flex items-center gap-1 ${
                    isActive
                      ? 'bg-navy text-champagne shadow-sm scale-105'
                      : isPast
                        ? 'text-navy/70 hover:text-navy hover:bg-slate-100'
                        : 'text-slate-400 hover:text-slate-600'
                  }`}
                  title={`Đi đến ${step.title}`}
                >
                  <span>{step.label}</span>
                  {isPast && <span className="text-[10px] text-emerald-600 font-bold">✓</span>}
                </button>
              );
            })}
          </div>

          <span className="text-champagne font-bold text-xs hidden sm:inline">22.11.2026</span>
        </div>
      </div>
      )}

      {/* ===================================================================== */}
      {/* NỘI DUNG CHÍNH: TỪNG MỤC HIỂN THỊ KHI CUỘN HOẶC CLICK                 */}
      {/* ===================================================================== */}
      <div className="flex-1 flex items-center justify-center py-6 sm:py-10 px-4 w-full max-w-4xl mx-auto">
        
        {/* ==================== MỤC 01: MỞ ĐẦU (OPENING) ==================== */}
        {currentStep === 0 && (
          <div className="w-full max-w-3xl text-center animate-fade-in bg-academic-paper p-6 sm:p-12 rounded-3xl border border-slate-200 shadow-sm relative">
            {/* Biểu tượng Mũ Cử Nhân & Vòng Nguyệt Quế SVG */}
            <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-navy text-champagne flex items-center justify-center shadow-lg border-2 border-champagne/50 mb-5">
              <svg className="w-9 h-9 sm:w-11 sm:h-11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                <path d="M6 12v5c3 3 9 3 12 0v-5"/>
              </svg>
            </div>

            <p className="text-xs sm:text-sm uppercase tracking-[0.22em] text-navy font-semibold mb-2">
              LỄ TỐT NGHIỆP ĐẠI HỌC • NIÊN KHÓA 2022 – 2026
            </p>

            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-champagneLight/80 border border-champagne/40 text-navy text-xs font-semibold tracking-wide mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-champagne"></span>
              <span>{data.badge}</span>
            </div>

            {/* Lời chào cá nhân hóa */}
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-navy leading-[1.25] tracking-tight mb-5">
              {data.salutationHtml(displayName)}
            </h1>

            {/* Khung vinh danh Tân Cử Nhân */}
            <div className="inline-block bg-white/95 border border-slate-200 rounded-2xl px-6 py-3 shadow-sm mb-5">
              <p className="text-[10px] uppercase tracking-[0.2em] text-slateText font-medium mb-0.5">Tân Cử Nhân</p>
              <p className="font-serif text-xl sm:text-2xl font-bold text-navy">{displayGrad}</p>
              <p className="text-xs text-slateText mt-0.5">Chuyên ngành Công nghệ Thông tin • Khóa 2022 – 2026</p>
            </div>

            <p className="adaptive-body max-w-xl mx-auto text-base sm:text-lg text-slateText leading-relaxed mb-8">
              {data.subtitle}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-md mx-auto interactive-stop">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  nextStep();
                }}
                className="w-full sm:w-auto min-h-[48px] px-7 py-3 rounded-full bg-navy hover:bg-navyLight text-ivory font-semibold text-sm shadow-md transition active:scale-95 flex items-center justify-center gap-2 group"
              >
                <span>Đọc lời mời riêng (Bước 02)</span>
                <ChevronRight className="w-4 h-4 text-champagne group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenRsvp();
                }}
                className="w-full sm:w-auto min-h-[48px] px-6 py-3 rounded-full bg-white hover:bg-champagneLight/50 text-navy border border-navy/25 text-sm font-semibold transition active:scale-95 shadow-sm"
              >
                <span>Xác nhận tham dự (RSVP)</span>
              </button>
            </div>

            {/* Gợi ý cuộn hoặc click */}
            <div className="mt-8 pt-4 border-t border-slate-200/70 text-xs text-slate-400 flex items-center justify-center gap-1.5 animate-bounce">
              <MousePointerClick className="w-3.5 h-3.5 text-champagne" />
              <span>Lăn chuột hoặc nhấp chuột vào màn hình để xem Lời mời riêng</span>
              <ArrowDown className="w-3.5 h-3.5 text-champagne" />
            </div>
          </div>
        )}

        {/* ==================== MỤC 02: LỜI MỜI RIÊNG (MESSAGE) ==================== */}
        {currentStep === 1 && (
          <div className="w-full max-w-3xl animate-fade-in bg-ivory rounded-3xl p-6 sm:p-12 shadow-[0_8px_30px_rgb(15,35,66,0.06)] border border-slate-200 relative overflow-hidden">
            {/* Dấu ngoặc kép trang trí */}
            <div className="absolute top-4 right-6 font-serif text-7xl sm:text-8xl text-champagneLight select-none leading-none pointer-events-none">”</div>

            <div className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-widest text-champagne mb-3">
              <span>02 / Lời ngỏ dành riêng</span>
              <span className="h-px w-8 bg-champagne/60"></span>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-navy mb-5 leading-snug">
              {data.messageHeading}
            </h2>

            <div className="adaptive-body space-y-4 text-slateText text-base leading-relaxed">
              {customMessage ? (
                <>
                  <p>Kính thưa/Kính gửi <strong>{displayName}</strong>,</p>
                  <p className="whitespace-pre-line text-justify leading-relaxed">{customMessage}</p>
                </>
              ) : (
                data.messageParagraphs(displayName, displayGrad).map((para, index) => (
                  <p key={index}>{para}</p>
                ))
              )}
            </div>

            {/* Khu vực RSVP & Chuyển bước */}
            <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 interactive-stop">
              <div>
                <p className="text-sm font-bold text-navy">Xác nhận tham dự & Hẹn giờ chụp ảnh</p>
                <p className="text-xs sm:text-sm text-slateText mt-0.5">
                  {rsvpStatus?.attending ? (
                    <span className="text-emerald-700 font-semibold">
                      ✓ Đã xác nhận tham dự ({rsvpStatus.guestsCountDesc || '1 người'}) • Khung: {rsvpStatus.photoSlot || '09:30 – 13:30'}
                    </span>
                  ) : (
                    "Cho mình biết thời gian bạn/gia đình ghé qua để mình ra đón và chụp ảnh cùng nhé!"
                  )}
                </p>
              </div>
              <div className="flex items-center gap-2.5">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenRsvp();
                  }}
                  className="min-h-[46px] inline-flex items-center justify-center gap-2 bg-champagne hover:bg-amber-600 text-navy font-bold px-5 py-2.5 rounded-2xl text-xs sm:text-sm shadow-sm transition active:scale-95"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{rsvpStatus?.attending ? 'Cập nhật phản hồi' : 'Xác nhận tham dự'}</span>
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    nextStep();
                  }}
                  className="min-h-[46px] inline-flex items-center justify-center gap-1.5 bg-navy hover:bg-navyLight text-ivory font-semibold px-5 py-2.5 rounded-2xl text-xs sm:text-sm shadow-sm transition active:scale-95"
                >
                  <span>Địa điểm (03)</span>
                  <ChevronRight className="w-4 h-4 text-champagne" />
                </button>
              </div>
            </div>

            {/* Prompt cuộn */}
            <div className="mt-6 text-center text-xs text-slate-400 flex items-center justify-center gap-1.5 animate-bounce">
              <MousePointerClick className="w-3.5 h-3.5 text-champagne" />
              <span>Cuộn chuột hoặc nhấp để xem Thời gian & Địa điểm</span>
              <ArrowDown className="w-3.5 h-3.5 text-champagne" />
            </div>
          </div>
        )}

        {/* ==================== MỤC 03: THỜI GIAN & ĐỊA ĐIỂM (LOGISTICS) ==================== */}
        {currentStep === 2 && (
          <div className="w-full max-w-3xl animate-fade-in space-y-5">
            <div className="text-center sm:text-left mb-2">
              <div className="inline-flex items-center gap-2.5 text-xs font-bold uppercase tracking-widest text-champagne mb-1.5">
                <span>03 / Thông tin buổi lễ</span>
                <span className="h-px w-8 bg-champagne/60"></span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-navy">Thời gian & Địa điểm tổ chức</h2>
            </div>

            <div className="grid grid-cols-1 gap-5">
              {/* Thẻ Thời gian & Lịch trình */}
              <div className="bg-ivory rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm">
                <div className="flex items-start gap-3.5 mb-4">
                  <div className="w-11 h-11 rounded-2xl bg-navy text-champagne flex items-center justify-center shrink-0 shadow-sm">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-slateText font-semibold">Ngày diễn ra buổi lễ</p>
                    <h3 className="font-serif text-lg sm:text-xl font-bold text-navy mt-0.5">Thứ Bảy, 28 Tháng 11, 2026</h3>
                  </div>
                </div>

                <div className="space-y-2.5 bg-cream rounded-2xl p-4 border border-slate-200 text-xs sm:text-sm">
                  {data.schedule.map((item, idx) => (
                    <div 
                      key={idx} 
                      className={`flex items-start justify-between gap-3 ${idx > 0 ? 'border-t border-slate-200/80 pt-2.5' : ''}`}
                    >
                      <span className={`font-bold whitespace-nowrap ${item.highlight ? 'text-champagne font-extrabold' : 'text-navy'}`}>
                        {item.time}
                      </span>
                      <span className={`text-right ${item.highlight ? 'text-navy font-semibold' : 'text-slateText'}`}>
                        {item.desc}
                      </span>
                    </div>
                  ))}
                </div>

                {/* <div className="mt-4 interactive-stop">
                  <button 
                    onClick={handleDownloadIcs} 
                    className="w-full min-h-[44px] inline-flex items-center justify-center gap-2 bg-champagneLight/70 hover:bg-champagneLight text-navy font-semibold text-xs sm:text-sm py-2.5 px-4 rounded-xl border border-champagne/40 transition active:scale-95"
                  >
                    <Download className="w-4 h-4 text-navy" />
                    <span>Lưu lịch vào điện thoại (.ICS)</span>
                  </button>
                </div> */}
              </div>

              {/* Thẻ Địa điểm */}
              <div className="bg-ivory rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm">
                <div className="flex items-start gap-3.5 mb-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-navy text-champagne flex items-center justify-center shrink-0 shadow-sm">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-slateText font-semibold">Địa điểm tổ chức</p>
                    <h3 className="font-serif text-lg sm:text-xl font-bold text-navy mt-0.5">Hội trường A5</h3>
                    <p className="text-xs sm:text-sm text-slateText mt-1 leading-relaxed">
                      Khuôn viên Trường Đại học Bách Khoa — 268 Lý Thường Kiệt, P.Diên Hồng, TP.HCM.
                    </p>
                  </div>
                </div>

                <div className="bg-champagneLight/50 border border-champagne/40 rounded-xl p-3 text-xs text-navy leading-relaxed mb-4">
                  {data.venueNote(displayName, displayGrad)}
                </div>

                <div className="flex flex-col sm:flex-row gap-2.5 interactive-stop">
                  <a 
                    href="https://maps.google.com/?q=268+Ly+Thuong+Kiet+Quan+10+Ho+Chi+Minh" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 min-h-[44px] inline-flex items-center justify-center gap-2 bg-navy hover:bg-navyLight text-ivory font-semibold text-xs sm:text-sm py-2.5 px-4 rounded-xl shadow-sm transition active:scale-95"
                  >
                    <ExternalLink className="w-4 h-4 text-champagne" />
                    <span>Mở chỉ đường Google Maps</span>
                  </a>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      nextStep();
                    }}
                    className="min-h-[44px] inline-flex items-center justify-center gap-1.5 bg-champagne hover:bg-amber-500 text-navy font-bold text-xs sm:text-sm py-2.5 px-5 rounded-xl shadow-sm transition active:scale-95"
                  >
                    <span>Sơ đồ & Gửi xe (04)</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Prompt cuộn */}
            <div className="text-center text-xs text-slate-400 flex items-center justify-center gap-1.5 animate-bounce pt-1">
              <MousePointerClick className="w-3.5 h-3.5 text-champagne" />
              <span>Cuộn chuột hoặc nhấp để xem Sơ đồ & Bãi đỗ xe</span>
              <ArrowDown className="w-3.5 h-3.5 text-champagne" />
            </div>
          </div>
        )}

        {/* ==================== MỤC 04: SƠ ĐỒ & GỬI XE (CAMPUS MAP) ==================== */}
        {currentStep === 3 && (
          <div className="w-full max-w-3xl animate-fade-in bg-ivory rounded-3xl p-5 sm:p-9 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-champagne mb-1">
                  <span>04 / Hướng dẫn di chuyển</span>
                  <span className="h-px w-6 bg-champagne/60"></span>
                </div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-navy">Vị trí gửi xe & Lưu ý khi đến</h2>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextStep();
                }}
                className="interactive-stop inline-flex items-center gap-1.5 bg-navy hover:bg-navyLight text-ivory text-xs font-semibold px-4 py-2 rounded-xl transition"
              >
                <span>Xem lời cảm ơn (05)</span>
                <ChevronRight className="w-3.5 h-3.5 text-champagne" />
              </button>
            </div>

            {/* Sơ đồ Khuôn viên SVG */}
            <CampusMap />

            {/* 2 khối chi tiết */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
              {/* Khối 1: Gửi xe */}
              {/* <div>
                <div className="flex items-center gap-2 mb-2.5">
                  <span className="w-7 h-7 rounded-lg bg-navy text-champagne flex items-center justify-center font-bold text-xs">P</span>
                  <h3 className="font-serif text-base font-bold text-navy">Hướng dẫn vị trí gửi xe</h3>
                </div>
                <ul className="space-y-2 text-xs sm:text-sm text-slateText leading-relaxed">
                  {data.parkingList.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-champagne font-bold">•</span>
                      <span><strong>{item.title}</strong> {item.desc}</span>
                    </li>
                  ))}
                </ul>
              </div> */}

              {/* Khối 2: Lưu ý */}
              <div>
                <div className="flex items-center gap-2 mb-2.5">
                  <span className="w-7 h-7 rounded-lg bg-champagneLight text-navy border border-champagne/40 flex items-center justify-center font-bold text-xs">!</span>
                  <h3 className="font-serif text-base font-bold text-navy">Lưu ý khi đến dự lễ</h3>
                </div>
                <ul className="space-y-2 text-xs sm:text-sm text-slateText leading-relaxed">
                  {data.arrivalNotes.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-navy font-bold">•</span>
                      <span><strong>{item.title}</strong> {item.desc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Prompt cuộn */}
            <div className="text-center text-xs text-slate-400 flex items-center justify-center gap-1.5 animate-bounce pt-2 border-t border-slate-100">
              <MousePointerClick className="w-3.5 h-3.5 text-champagne" />
              <span>Cuộn chuột hoặc nhấp để xem Lời cảm ơn & Kết lại</span>
              <ArrowDown className="w-3.5 h-3.5 text-champagne" />
            </div>
          </div>
        )}

        {/* ==================== MỤC 05: LỜI CẢM ƠN (GRATITUDE & CLOSING) ==================== */}
        {currentStep === 4 && (
          <div className="w-full max-w-3xl animate-fade-in bg-navy text-cream rounded-3xl p-7 sm:p-14 text-center relative overflow-hidden shadow-2xl border border-champagne/30">
            {/* Ánh sáng vàng Champagne trang trí */}
            <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-champagne/10 blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-24 -right-24 w-64 h-64 rounded-full bg-champagne/10 blur-3xl pointer-events-none"></div>

            <p className="text-xs uppercase tracking-[0.25em] text-champagne font-bold mb-3">
              05 / Lời cảm ơn
            </p>

            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-white mb-4 leading-snug">
              {data.closingHeading}
            </h2>

            <p className="adaptive-body max-w-xl mx-auto text-slate-200 text-base leading-relaxed mb-8">
              {data.closingBody(displayName)}
            </p>

            {/* Chữ ký Tân Cử Nhân */}
            <div className="mb-8">
              <p className="font-serif italic text-xl sm:text-2xl text-champagne">Trân trọng & Biết ơn,</p>
              <p className="text-base font-bold text-white mt-1">Tân Cử Nhân {displayGrad}</p>
            </div>

            {/* Nút Xác nhận tham dự nổi bật */}
            <div className="mb-8 interactive-stop">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenRsvp();
                }}
                className="min-h-[50px] px-8 py-3.5 rounded-full bg-champagne hover:bg-amber-400 text-navy font-extrabold text-sm sm:text-base shadow-xl transition active:scale-95 inline-flex items-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>{rsvpStatus?.attending ? 'Cập nhật thông tin tham dự (RSVP)' : 'Xác nhận tham dự Lễ Tốt Nghiệp'}</span>
              </button>
            </div>

            {/* Kênh liên hệ nhanh */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 pt-6 border-t border-white/15 interactive-stop">
              <a 
                href="tel:0982046478" 
                onClick={(e) => e.stopPropagation()}
                className="min-h-[44px] inline-flex items-center justify-center gap-2 bg-navyLight hover:bg-white/15 text-cream text-xs sm:text-sm font-medium px-5 py-2.5 rounded-full border border-white/15 transition"
              >
                <Phone className="w-4 h-4 text-champagne shrink-0" />
                <span>Tân Cử Nhân: 0982046478</span>
              </a>
            </div>

            {/* Nút xem lại từ đầu */}
            <div className="mt-8 pt-4 border-t border-white/10 interactive-stop">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToStep(0);
                }}
                className="inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-white transition px-3 py-1.5 rounded-lg hover:bg-white/10"
              >
                <RotateCcw className="w-3.5 h-3.5 text-champagne" />
                <span>Xem lại từ đầu (Mở đầu)</span>
              </button>
            </div>
          </div>
        )}

      </div>

      {/* ===================================================================== */}
      {/* THANH ĐIỀU KHIỂN CHUYỂN BƯỚC NẰM Ở CUỐI TRANG (BOTTOM CONTROL BAR)    */}
      {/* ===================================================================== */}
      <footer className="w-full bg-white/90 backdrop-blur-md border-t border-slate-200/80 py-3 px-4 z-20 interactive-stop">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          
          {/* Nút Quay lại */}
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition ${
              currentStep === 0 
                ? 'opacity-30 cursor-not-allowed text-slate-400' 
                : 'bg-slate-100 hover:bg-slate-200 text-navy active:scale-95'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Quay lại</span>
          </button>

          {/* Chỉ báo các chấm tròn vị trí */}
          <div className="flex items-center gap-2">
            {STEPS.map((s) => (
              <button
                key={s.id}
                onClick={() => goToStep(s.id)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  currentStep === s.id 
                    ? 'w-7 bg-champagne shadow-sm' 
                    : 'w-2.5 bg-slate-300 hover:bg-slate-400'
                }`}
                title={s.title}
              />
            ))}
            <span className="text-xs font-mono text-slateText ml-1">
              {currentStep + 1} / {STEPS.length}
            </span>
          </div>

          {/* Nút Tiếp theo */}
          <button
            onClick={nextStep}
            disabled={currentStep === STEPS.length - 1}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition ${
              currentStep === STEPS.length - 1 
                ? 'opacity-30 cursor-not-allowed text-slate-400' 
                : 'bg-navy hover:bg-navyLight text-ivory active:scale-95 shadow-sm'
            }`}
          >
            <span>Tiếp theo</span>
            <ChevronRight className="w-4 h-4 text-champagne" />
          </button>

        </div>
      </footer>

    </div>
  );
}
