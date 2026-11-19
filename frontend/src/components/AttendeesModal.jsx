import React, { useState, useEffect } from 'react';
import { X, Users, CheckCircle, XCircle, Mail, RefreshCw, Calendar, Clock } from 'lucide-react';
import { createAdminAuthorization } from '../api/adminAuth';

export default function AttendeesModal({
  isOpen,
  onClose,
  apiUrl,
  credentials,
  onUnauthorized
}) {
  const [data, setData] = useState({ attendees: [], totalCount: 0, attendingCount: 0, declinedCount: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchAttendees = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${apiUrl}/api/invitation/attendees`, {
        headers: { Authorization: createAdminAuthorization(credentials) },
        cache: 'no-store'
      });
      if (res.status === 401 || res.status === 403) {
        onUnauthorized?.();
        return;
      }
      if (res.ok) {
        const json = await res.json();
        setData(json);
      } else {
        setError(`Không tải được danh sách (HTTP ${res.status}).`);
      }
    } catch (requestError) {
      console.error("Failed to load attendees:", requestError);
      setError('Không kết nối được máy chủ. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && credentials) {
      fetchAttendees();
    }
  }, [isOpen, credentials]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-ivory border border-slate-200 rounded-3xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden text-navy">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-cream">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-navy text-champagne">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold font-serif text-navy">
                Danh Sách Khách Mời & Phản Hồi (Database)
              </h3>
              <p className="text-xs text-slateText">Dữ liệu đồng bộ trực tiếp từ cơ sở dữ liệu PostgreSQL / H2</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchAttendees}
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

        {/* Stats Summary Bar */}
        <div className="grid grid-cols-3 gap-3 p-4 bg-slate-50 border-b border-slate-200 text-center text-xs">
          <div className="p-2.5 rounded-xl bg-white border border-slate-200">
            <span className="text-slateText block text-[10px] uppercase font-semibold">Tổng phản hồi</span>
            <span className="text-lg font-bold text-navy">{data.totalCount}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200">
            <span className="text-emerald-700 block text-[10px] uppercase font-semibold">Xác nhận tham gia</span>
            <span className="text-lg font-bold text-emerald-700">{data.attendingCount}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-100 border border-slate-200">
            <span className="text-slateText block text-[10px] uppercase font-semibold">Bận việc</span>
            <span className="text-lg font-bold text-slateText">{data.declinedCount}</span>
          </div>
        </div>

        {/* Attendee List Table */}
        <div className="overflow-y-auto p-4 flex-1">
          {error && (
            <p role="alert" className="mb-3 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
              {error}
            </p>
          )}
          {data.attendees.length === 0 ? (
            <div className="text-center py-12 text-slateText text-sm">
              Chưa có phản hồi nào được ghi nhận. Hãy gửi thư mời và xác nhận đầu tiên!
            </div>
          ) : (
            <div className="space-y-2.5">
              {data.attendees.map((attendee) => (
                <div
                  key={attendee.id}
                  className="p-3.5 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs shadow-sm"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-navy">{attendee.fullName}</span>
                      {attendee.attending ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-semibold">
                          <CheckCircle className="w-3 h-3" /> Sẽ tham dự
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-semibold">
                          <XCircle className="w-3 h-3" /> Bận việc
                        </span>
                      )}
                      {attendee.guestGroup && (
                        <span className="px-2 py-0.5 rounded-full bg-champagneLight text-navy text-[10px] font-medium border border-champagne/40">
                          {attendee.guestGroup}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-slateText text-[11px]">
                      <span>Email: {attendee.email}</span>
                      {attendee.phone && <span>SĐT: {attendee.phone}</span>}
                      {attendee.photoSlot && <span>Khung giờ: {attendee.photoSlot}</span>}
                    </div>
                    {attendee.notes && (
                      <p className="text-[11px] text-slate-600 italic bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                        "{attendee.notes}"
                      </p>
                    )}
                  </div>
                  <div className="shrink-0 text-right">
                    <span className="font-mono text-[10px] text-slateText block">
                      {attendee.confirmationCode || 'Chưa cấp'}
                    </span>
                    <span className="text-[11px] font-medium text-navy">
                      {attendee.guestsCountDesc || `${attendee.guestsCount || 1} người`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
