import React, { useEffect } from 'react';
import { CheckCircle2, Award, Mail, Calendar, MapPin, Download, X, Clock } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ConfirmationSuccessModal({
  isOpen,
  onClose,
  rsvpResult,
  attendeeData,
  gradName = 'Hà Lê Tín',
}) {
  useEffect(() => {
    if (isOpen) {
      // Festive celebration confetti
      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.6 },
        colors: ['#C59B27', '#0F2342', '#1B365D', '#F6EED8']
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-ivory rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-navy">
        
        {/* Top Celebration Banner */}
        <div className="bg-navy p-6 sm:p-7 text-center relative text-cream">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="w-14 h-14 rounded-full bg-champagne/20 border-2 border-champagne/50 flex items-center justify-center mx-auto mb-2 text-champagne shadow-lg">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-champagne">
            LỄ TỐT NGHIỆP ĐẠI HỌC • NIÊN KHÓA 2022 – 2026
          </span>
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-white mt-1">
            Xác Nhận Tham Gia Thành Công!
          </h3>
          <p className="text-xs sm:text-sm text-slate-200 mt-1">
            {rsvpResult?.message || "Cảm ơn bạn đã nhận lời đến chung vui ngày nhận bằng tốt nghiệp!"}
          </p>
        </div>

        {/* Email notice box */}
        <div className="px-6 pt-5">
          <div className="p-3.5 rounded-2xl bg-champagneLight/70 border border-champagne/40 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-champagne/20 text-navy shrink-0">
              <Mail className="w-4 h-4 text-navy" />
            </div>
            <div className="text-xs text-navy">
              <p className="font-bold">Thông báo gửi mail Google:</p>
              <p className="text-slateText mt-0.5">
                {rsvpResult?.emailNotice || `Thư xác nhận đã được gửi tới email ${attendeeData?.email}.`}
              </p>
            </div>
          </div>
        </div>

        {/* Electronic Ticket Pass */}
        <div className="p-6">
          <div className="bg-cream rounded-2xl p-5 border border-slate-200 relative shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-champagne block">
                  VÉ MỜI ĐIỆN TỬ
                </span>
                <h4 className="font-serif font-bold text-navy text-base">
                  {attendeeData?.fullName || "Khách Mời"}
                </h4>
              </div>
            </div>

            {/* Event recap in ticket */}
            <div className="space-y-2 text-xs text-slateText mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-champagne" />
                <span>Chủ Nhật, 22 Tháng 11, 2026</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-navy" />
                <span>Khung giờ hẹn chụp ảnh: <strong>{attendeeData?.photoSlot || "09:30 – 13:30"}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-navy" />
                <span className="truncate">Hội trường Lớn — 268 Lý Thường Kiệt, Q.10, TP.HCM</span>
              </div>
            </div>

          </div>

          {/* Action buttons */}
          <div className="mt-5 flex gap-3">
            <button
              onClick={onClose}
              className="w-full py-3 px-4 rounded-xl bg-navy hover:bg-navyLight text-ivory text-xs font-semibold transition"
            >
              Đóng và xem thiệp
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
