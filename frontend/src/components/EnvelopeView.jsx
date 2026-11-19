import React, { useState } from 'react';
import { Mail, Award, Sparkles, ArrowRight, Heart } from 'lucide-react';

export default function EnvelopeView({
  recipientName,
  senderName,
  guestGroup,
  gradName,
  onOpenLetter,
  onCustomizeRecipient
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isOpening, setIsOpening] = useState(false);

  const handleOpenClick = () => {
    setIsOpening(true);
    setTimeout(() => {
      onOpenLetter();
    }, 700);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] px-4 py-8 relative w-full">
      {/* Background ambient lighting */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-champagne/10 blur-[130px] pointer-events-none -top-20"></div>
      <div className="absolute w-[450px] h-[450px] rounded-full bg-navyLight/20 blur-[100px] pointer-events-none -bottom-20"></div>

      {/* Header title */}
      <div className="text-center mb-8 max-w-xl animate-fade-in">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-champagneLight/80 border border-champagne/40 text-navy text-xs font-semibold tracking-wide mb-3">
          <span className="w-2 h-2 rounded-full bg-champagne animate-pulse"></span>
          <span>CLASS OF 2026 • LỄ TỐT NGHIỆP ĐẠI HỌC</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-navy tracking-tight mb-2">
          Thiệp Mời
        </h1>
        <p className="text-slateText text-sm sm:text-base font-normal">
          Chạm vào phong thư hoặc nhấn con dấu vàng bên dưới để mở lời mời chính thức
        </p>
      </div>

      {/* 3D Envelope Presentation */}
      <div
        className={`relative w-full max-w-md sm:max-w-lg cursor-pointer transition-all duration-700 ease-out ${
          isOpening ? 'scale-105 opacity-80 -translate-y-6' : 'hover:-translate-y-2'
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleOpenClick}
      >
        {/* Glowing border effect */}
        <div
          className={`absolute -inset-1 rounded-3xl bg-gradient-to-r from-champagne/30 via-champagneLight/40 to-champagne/30 blur-xl opacity-60 transition duration-500 ${
            isHovered ? 'opacity-100 scale-[1.02]' : ''
          }`}
        ></div>

        {/* Envelope Outer Body */}
        <div className="relative rounded-3xl overflow-hidden shadow-envelope border border-champagne/40 bg-gradient-to-br from-[#0F2342] via-[#1B365D] to-[#0A172C] p-6 sm:p-9 min-h-[340px] flex flex-col justify-between text-cream">
          {/* Subtle gold foil border pattern */}
          <div className="absolute inset-3 rounded-2xl border border-champagne/30 pointer-events-none"></div>
          <div className="absolute inset-4 rounded-xl border border-dashed border-champagne/20 pointer-events-none"></div>

          {/* Top Decorative Header */}
          <div className="flex items-center justify-between text-xs tracking-widest text-champagne uppercase z-10">
            <span className="flex items-center gap-1.5 font-semibold">
              <svg className="w-4 h-4 text-champagne" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                <path d="M6 12v5c3 3 9 3 12 0v-5"/>
              </svg>
              GRADUATION INVITATION
            </span>
            <span className="text-champagneLight/80 font-mono text-[11px]">2022 – 2026</span>
          </div>

          {/* Center: Recipient & Sender Information */}
          <div className="my-6 text-center z-10 space-y-3">
            {/* Recipient badge */}
            <div className="inline-block">
              <p className="text-[11px] uppercase tracking-[0.25em] text-champagneLight/70 mb-1.5 font-semibold">
                — Trân Trọng Kính Mời —
              </p>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-wide px-5 py-2 rounded-xl bg-white/10 border border-champagne/40 shadow-inner">
                {recipientName || "Quý Khách Quý"}
              </h2>
            </div>

            {/* Sender / Graduate */}
            <div className="pt-2">
              <p className="text-[11px] uppercase tracking-wider text-slate-300 mb-0.5">
                Tân Cử Nhân
              </p>
              <p className="text-lg sm:text-xl font-serif font-bold text-champagne">
                {gradName || senderName || "Hà Lê Tín"}
              </p>
              <p className="text-xs text-slate-300">
                Chuyên ngành Khoa học Máy Tính 
              </p>
            </div>
          </div>

          {/* Wax Seal in center */}
          <div className="flex justify-center -my-2 z-20">
            <div
              className={`wax-seal w-16 h-16 sm:w-20 sm:h-20 rounded-full flex flex-col items-center justify-center text-navy font-bold border-2 border-champagne/70 transition-transform duration-500 ${
                isHovered ? 'scale-110 rotate-6 shadow-2xl' : ''
              }`}
            >
              <Mail className="w-6 h-6 text-navy" />
              <span className="text-[9px] font-extrabold tracking-wider uppercase text-navy mt-0.5">
                MỞ THIỆP
              </span>
            </div>
          </div>

          {/* Envelope Bottom Info */}
          <div className="flex items-center justify-between text-xs text-slate-300 pt-3 border-t border-white/10 z-10">
            <span>Thứ Bảy, 28.11.2026</span>
            <span className="flex items-center gap-1 text-champagne font-medium hover:underline">
              <span>Chạm để mở</span> <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </div>

      {/* Button to quickly open */}
      <div className="mt-8 flex items-center justify-center gap-4">
        <button
          onClick={handleOpenClick}
          className="min-h-[48px] px-8 py-3 rounded-full bg-navy hover:bg-navyLight text-ivory font-semibold text-sm shadow-md transition active:scale-95 flex items-center gap-2 border border-champagne/30"
        >
          <Mail className="w-4 h-4 text-champagne" />
          <span>Mở thư mời chi tiết</span>
        </button>
      </div>
    </div>
  );
}
