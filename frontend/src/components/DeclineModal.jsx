import React from 'react';
import { Heart, X, Check } from 'lucide-react';

export default function DeclineModal({
  isOpen,
  onClose,
  onReconsider
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-ivory rounded-3xl shadow-2xl border border-slate-200 p-6 sm:p-8 text-center text-navy">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-navy p-1.5 rounded-full hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-14 h-14 rounded-full bg-champagneLight flex items-center justify-center mx-auto mb-4 border border-champagne/40 text-champagne">
          <Heart className="w-7 h-7 fill-champagne text-champagne" />
        </div>

        <span className="text-xs font-bold uppercase tracking-widest text-champagne">
          Lời Cảm Ơn Chân Thành
        </span>

        <h3 className="font-serif text-2xl font-bold text-navy mt-1 mb-2">
          Rất Cảm Ơn Tấm Lòng Của Bạn!
        </h3>

        <p className="text-sm text-slateText leading-relaxed mb-6">
          Dù bạn không thể đến dự lễ trực tiếp do bận việc, Tân Cử Nhân vẫn rất trân quý những lời chúc tốt đẹp và sự đồng hành của bạn suốt chặng đường vừa qua.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-2xl bg-cream hover:bg-slate-100 text-slateText border border-slate-300 text-xs font-semibold transition"
          >
            Đóng thông báo
          </button>
          <button
            onClick={onReconsider}
            className="flex-1 py-3 px-4 rounded-2xl bg-navy hover:bg-navyLight text-ivory text-xs font-semibold transition"
          >
            Đổi ý tham gia
          </button>
        </div>
      </div>
    </div>
  );
}
