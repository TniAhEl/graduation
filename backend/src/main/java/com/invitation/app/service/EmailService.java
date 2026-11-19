package com.invitation.app.service;

import com.invitation.app.entity.Attendee;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import jakarta.mail.internet.MimeUtility;

@Service
public class EmailService {

  private static final Logger log = LoggerFactory.getLogger(EmailService.class);

  @Autowired(required = false)
  private JavaMailSender mailSender;

  @Value("${spring.mail.username:}")
  private String senderEmail;

  @Value("${invitation.event-title:LỄ TỐT NGHIỆP ĐẠI HỌC • NIÊN KHÓA 2022 – 2026}")
  private String eventTitle;

  @Value("${invitation.event-date:Chủ Nhật, 22 Tháng 11, 2026}")
  private String eventDate;

  @Value("${invitation.event-time:08:30 – 12:30}")
  private String eventTime;

  @Value("${invitation.event-venue:Hội trường Lớn (Giảng đường Trung tâm)}")
  private String eventVenue;

  @Value("${invitation.event-address:268 Lý Thường Kiệt, Phường 14, Quận 10, TP. Hồ Chí Minh}")
  private String eventAddress;

  public boolean sendConfirmationEmail(Attendee attendee) {
    log.info("Preparing confirmation email for: {} <{}>", attendee.getFullName(), attendee.getEmail());

    if (mailSender == null || senderEmail == null || senderEmail.isBlank()
        || senderEmail.contains("your-email@gmail.com")) {
      log.warn(
          "Google Mail sender not configured yet (GOOGLE_MAIL_USERNAME / GOOGLE_MAIL_PASSWORD). Email dispatch simulated.");
      return false;
    }

    try {
      MimeMessage message = mailSender.createMimeMessage();
      MimeMessageHelper helper = new MimeMessageHelper(
          message,
          MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED,
          StandardCharsets.UTF_8.name());

      helper.setFrom(senderEmail,
          "Tân Cử Nhân " + repairUtf8(attendee.getGradName() != null ? attendee.getGradName() : "Hà Lê Tín"));
      helper.setTo(attendee.getEmail());
      helper.setSubject(MimeUtility.encodeText(
          "🎓 [XÁC NHẬN THAM DỰ] Lễ Tốt Nghiệp Đại Học — " + repairUtf8(attendee.getFullName()),
          StandardCharsets.UTF_8.name(),
          "B"));

      String htmlContent = buildHtmlEmailContent(attendee);
      helper.setText(htmlContent, true);

      mailSender.send(message);
      log.info("Google confirmation email sent successfully to {}", attendee.getEmail());
      return true;
    } catch (Exception e) {
      log.error("Failed to send email via Google SMTP: {}", e.getMessage());
      return false;
    }
  }

  private String buildHtmlEmailContent(Attendee attendee) {
    String gradName = (attendee.getGradName() != null && !attendee.getGradName().isBlank())
        ? escapeHtml(repairUtf8(attendee.getGradName()))
        : "Hà Lê Tín";

    String guestCountDisplay = attendee.getGuestsCountDesc() != null && !attendee.getGuestsCountDesc().isBlank()
        ? escapeHtml(repairUtf8(attendee.getGuestsCountDesc()))
        : (attendee.getGuestsCount() != null ? attendee.getGuestsCount() + " người" : "1 người");

    String photoSlotDisplay = attendee.getPhotoSlot() != null && !attendee.getPhotoSlot().isBlank()
        ? escapeHtml(repairUtf8(attendee.getPhotoSlot()))
        : "09:30 – 13:00";

    String notesContent = (attendee.getNotes() != null && !attendee.getNotes().isBlank())
        ? "<div style='margin-top: 10px; padding: 10px; background: #fff; border-radius: 8px; font-style: italic; color: #475569;'><strong>Lời nhắn / Ghi chú:</strong> \""
            + escapeHtml(repairUtf8(attendee.getNotes())) + "\"</div>"
        : "";

    return """
        <!DOCTYPE html>
        <html lang="vi">
        <head>
          <meta charset="UTF-8">
          <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body, table, td, div, p, a, span { font-family: Arial, 'Segoe UI', Tahoma, 'Helvetica Neue', sans-serif; }
            body { background-color: #FAF8F3; margin: 0; padding: 24px; color: #0F2342; }
            .container { max-width: 620px; margin: 0 auto; background: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 12px 35px rgba(15,35,66,0.08); border: 1px solid #E2E8F0; }
            .top-stripe { height: 6px; background: linear-gradient(90deg, #0F2342, #C59B27, #0F2342); }
            .header { background: #0F2342; color: #FAF8F3; padding: 36px 24px; text-align: center; }
            .header h1 { margin: 10px 0 6px 0; font-size: 22px; font-family: Georgia, serif; font-weight: 700; color: #FFFFFF; letter-spacing: 0.5px; }
            .header p { margin: 0; font-size: 13px; color: #F6EED8; text-transform: uppercase; letter-spacing: 2px; }
            .badge { display: inline-block; background-color: #C59B27; color: #0F2342; padding: 6px 18px; border-radius: 9999px; font-weight: 700; font-size: 12px; margin-top: 16px; text-transform: uppercase; }
            .content { padding: 32px 28px; }
            .greeting { font-size: 18px; font-weight: 700; color: #0F2342; margin-bottom: 12px; }
            .ticket-card { background-color: #FAF8F3; border: 1px solid #E2E8F0; border-left: 5px solid #C59B27; border-radius: 16px; padding: 20px; margin: 20px 0; }
            .ticket-title { font-size: 13px; font-weight: 700; color: #C59B27; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 14px; }
            .detail-row { margin-bottom: 10px; font-size: 14px; line-height: 1.5; color: #334155; }
            .detail-label { font-weight: 600; color: #64748B; display: inline-block; min-width: 140px; }
            .footer { background-color: #F8FAFC; padding: 22px; text-align: center; font-size: 13px; color: #64748B; border-top: 1px solid #E2E8F0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="top-stripe"></div>
            <div class="header">
              <p>NIÊN KHÓA 2022 – 2026</p>
              <h1>🎓 %s</h1>
              <div class="badge">✓ ĐÃ XÁC NHẬN THAM DỰ</div>
            </div>

            <div class="content">
              <div class="greeting">Kính gửi: %s,</div>
              <p style="color: #475569; line-height: 1.7; margin: 0 0 16px 0; font-size: 15px;">
                Tân Cử Nhân <strong>%s</strong> xin chân thành cảm ơn bạn đã nhận lời tham dự và xác nhận có mặt trong ngày Lễ Tốt Nghiệp trọng đại này. Sự hiện diện của bạn là niềm vinh dự và niềm vui to lớn nhất đối với mình và gia đình!
              </p>

              <div class="ticket-card">
                <div class="ticket-title">📍 THÔNG TIN CHI TIẾT BUỔI LỄ</div>
                <div class="detail-row"><span class="detail-label">Thời gian:</span><strong>%s (%s)</strong></div>
                <div class="detail-row"><span class="detail-label">Địa điểm:</span><strong>%s</strong></div>
                <div class="detail-row"><span class="detail-label">Địa chỉ:</span>%s</div>
                <div class="detail-row"><span class="detail-label">Số người tham dự:</span><strong>%s</strong></div>
                <div class="detail-row"><span class="detail-label">Khung giờ hẹn chụp:</span><strong>%s</strong></div>
                %s
              </div>

              <p style="color: #475569; font-size: 14px; line-height: 1.6;">
                Rất mong sớm được gặp bạn tại khuôn viên trường! Nếu cần hỗ trợ thêm thông tin vị trí gửi xe hoặc đón tiếp tại sảnh, vui lòng gọi cho mình : 0982046478</strong>.
              </p>
            </div>

            <div class="footer">
              <p style="margin: 0 0 4px 0; font-style: italic; color: #C59B27; font-weight: 600;">Trân trọng & Biết ơn,</p>
              <p style="margin: 0; font-weight: 700; color: #0F2342; font-size: 15px;">Tân Cử Nhân %s</p>
            </div>
          </div>
        </body>
        </html>
        """
        .formatted(
            repairUtf8(eventTitle),
            escapeHtml(repairUtf8(attendee.getFullName())),
            gradName,
            repairUtf8(eventDate),
            repairUtf8(eventTime),
            repairUtf8(eventVenue),
            repairUtf8(eventAddress),
            guestCountDisplay,
            photoSlotDisplay,
            notesContent,
            gradName);
  }

  private String repairUtf8(String text) {
    if (text == null || text.isEmpty()) {
      return "";
    }

    String result = text;
    if (result.contains("Ã") || result.contains("Â")
        || result.contains("Ä") || result.contains("áº")
        || result.contains("á»") || result.contains("â")) {
      try {
        for (int i = 0; i < 3; i++) {
          String repaired = new String(
              result.getBytes(StandardCharsets.ISO_8859_1),
              StandardCharsets.UTF_8);
          if (repaired.equals(result) || repaired.contains("\uFFFD")) {
            break;
          }
          result = repaired;
          if (!(result.contains("Ã") || result.contains("Â")
              || result.contains("Ä") || result.contains("áº")
              || result.contains("á»") || result.contains("â"))) {
            break;
          }
        }
      } catch (Exception ignored) {
        return text;
      }
    }
    return result;
  }

  private String escapeHtml(String text) {
    if (text == null)
      return "";
    return text.replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace("\"", "&quot;")
        .replace("'", "&#39;");
  }
}
