import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Mail, User, Phone, Clock, MessageSquare, Loader2 } from 'lucide-react';

export default function RsvpModal({
  isOpen,
  onClose,
  initialName,
  currentGroup,
  gradName,
  invitationCode,
  onSubmitRsvp
}) {
  const [attendance, setAttendance] = useState('yes'); // 'yes' | 'no'
  const [formData, setFormData] = useState({
    fullName: initialName || '',
    email: '',
    phone: '',
    photoSlot: '09:30 – 13:30',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initialName) {
      setFormData(prev => ({ ...prev, fullName: initialName }));
    }
  }, [initialName]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName.trim()) {
      setError("Vui lòng nhập tên của bạn");
      return;
    }

    if (attendance === 'yes') {
      if (!formData.email.trim() || !formData.email.includes('@')) {
        setError("Vui lòng nhập địa chỉ email hợp lệ để nhận xác nhận qua Google Mail");
        return;
      }
    }

    setError(null);
    setLoading(true);

    try {
      const payload = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim() || 'guest-decline@invitation.local',
        phone: formData.phone.trim(),
        attending: attendance === 'yes',
        guestsCount: 1,
        guestsCountDesc: '1 người',
        guestGroup: currentGroup || 'family',
        photoSlot: formData.photoSlot,
        gradName: gradName || 'Hà Lê Tín',
        notes: formData.notes.trim(),
        invitationCode: invitationCode || null
      };

      await onSubmitRsvp(payload);
    } catch (err) {
      setError(err.message || "Có lỗi xảy ra khi gửi thông tin xác nhận. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/70 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-ivory rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative max-h-[92vh] overflow-y-auto">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-navy p-2 rounded-full hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <span className="text-xs font-bold uppercase tracking-widest text-champagne">
          Phản hồi lời mời
        </span>
        <h3 className="font-serif text-2xl font-bold text-navy mt-1 mb-1.5">
          Xác nhận tham dự Lễ Tốt Nghiệp
        </h3>
        <p className="text-sm text-slateText mb-5">
          Khách mời: <strong className="text-navy">{formData.fullName || initialName || 'Quý khách'}</strong>
        </p>

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Trạng thái tham dự */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slateText mb-2">
              Bạn có thể tham dự không?
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <label className="cursor-pointer">
                <input
                  type="radio"
                  name="attendance"
                  value="yes"
                  checked={attendance === 'yes'}
                  onChange={() => setAttendance('yes')}
                  className="peer sr-only"
                />
                <div className="min-h-[48px] flex items-center justify-center p-3 rounded-2xl border border-slate-200 peer-checked:border-navy peer-checked:bg-champagneLight/70 text-center text-sm font-semibold text-navy transition">
                  Sẽ đến chung vui
                </div>
              </label>
              <label className="cursor-pointer">
                <input
                  type="radio"
                  name="attendance"
                  value="no"
                  checked={attendance === 'no'}
                  onChange={() => setAttendance('no')}
                  className="peer sr-only"
                />
                <div className="min-h-[48px] flex items-center justify-center p-3 rounded-2xl border border-slate-200 peer-checked:border-slate-600 peer-checked:bg-slate-100 text-center text-sm font-semibold text-slateText transition">
                  Rất tiếc bận việc
                </div>
              </label>
            </div>
          </div>

          {/* Họ và tên */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slateText mb-1.5">
              Tên người phản hồi <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                placeholder="Nhập tên của bạn hoặc gia đình..."
                className="w-full min-h-[46px] rounded-xl border border-slate-300 pl-10 pr-3.5 py-2.5 text-sm text-navy bg-white focus:border-navy outline-none"
              />
            </div>
          </div>

          {/* Email & Phone (chỉ bắt buộc khi tham dự để gửi Google Mail) */}
          {attendance === 'yes' && (
            <>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slateText">
                    Email nhận vé xác nhận <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-[10px] bg-champagneLight text-navy font-semibold px-2 py-0.5 rounded-full border border-champagne/40">
                    Google Mail
                  </span>
                </div>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="example@gmail.com"
                    className="w-full min-h-[46px] rounded-xl border border-slate-300 pl-10 pr-3.5 py-2.5 text-sm text-navy bg-white focus:border-navy outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slateText mb-1.5">
                  Số điện thoại liên hệ
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="09xx xxx xxx (để hỗ trợ đón tại cổng)"
                    className="w-full min-h-[46px] rounded-xl border border-slate-300 pl-10 pr-3.5 py-2.5 text-sm text-navy bg-white focus:border-navy outline-none"
                  />
                </div>
              </div>

              {/* Khung giờ dự kiến tới chụp ảnh */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slateText mb-1.5">
                  Khung giờ dự kiến tới chụp ảnh
                </label>
                <select
                  name="photoSlot"
                  value={formData.photoSlot}
                  onChange={handleChange}
                  className="w-full min-h-[46px] rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-navy bg-white focus:border-navy outline-none"
                >
                  <option value="09:30 – 13:30">09:30 – 13:30</option>
                </select>
              </div>
            </>
          )}

          {/* Lời nhắn gửi Tân Cử Nhân */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slateText mb-1.5">
              Lời nhắn
            </label>
            <textarea
              name="notes"
              rows={2}
              value={formData.notes}
              onChange={handleChange}
              placeholder="Nhập lời nhắn của bạn..."
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-navy focus:border-navy outline-none"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="min-h-[50px] w-full bg-navy hover:bg-navyLight text-ivory font-semibold text-sm py-3.5 rounded-2xl shadow transition active:scale-95 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-champagne" />
                <span>Đang gửi thông tin...</span>
              </>
            ) : (
              <span>Gửi phản hồi tới Tân Cử Nhân</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
