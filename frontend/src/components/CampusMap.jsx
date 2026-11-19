import React from 'react';

export default function CampusMap() {
  return (
    <div className="bg-cream rounded-2xl p-3.5 sm:p-5 border border-slate-200/80">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <span className="text-xs font-bold uppercase tracking-wider text-navy">
          Bản đồ khuôn viên & hướng di chuyển
        </span>
      </div>

      <img
        src="/map.jpg"
        alt="Sơ đồ khuôn viên Trường Đại học Bách Khoa"
        className="w-full h-auto rounded-[22px] border border-slate-300 bg-white shadow-inner object-contain"
      />
{/* 
      <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 rounded-2xl border border-slate-300 bg-white divide-y sm:divide-y-0 sm:divide-x divide-slate-300 overflow-hidden">
        <div className={`flex items-center gap-2.5 px-3 py-3 ${isCar ? 'bg-champagneLight/60' : ''}`}>
          <span className="text-xl">🚗</span>
          <div><p className="text-xs font-bold text-navy">Gửi xe ô tô</p><p className="text-[10px] text-slateText">Cổng Lý Thường Kiệt</p></div>
        </div>
        <div className={`flex items-center gap-2.5 px-3 py-3 ${isBike ? 'bg-champagneLight/60' : ''}`}>
          <span className="text-xl">🚶</span>
          <div><p className="text-xs font-bold text-navy">Gửi xe máy / Đi bộ</p><p className="text-[10px] text-slateText">Cổng Tô Hiến Thành</p></div>
        </div>
        <div className={`flex items-center gap-2.5 px-3 py-3 ${isPhoto ? 'bg-champagneLight/60' : ''}`}>
          <span className="text-xl">📍</span>
          <div><p className="text-xs font-bold text-navy">Điểm đón</p><p className="text-[10px] text-slateText">Khuôn viên trường</p></div>
        </div> */}
      {/* </div> */}
    </div>
  );

  /* Bản đồ SVG cũ đã được thay bằng ảnh map.jpg */
}
