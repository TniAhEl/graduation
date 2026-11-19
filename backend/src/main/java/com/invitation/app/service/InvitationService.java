package com.invitation.app.service;

import com.invitation.app.dto.CreateInvitationRequest;
import com.invitation.app.dto.InvitationDto;
import com.invitation.app.dto.RsvpRequest;
import com.invitation.app.dto.RsvpResponse;
import com.invitation.app.entity.Attendee;
import com.invitation.app.entity.Invitation;
import com.invitation.app.repository.AttendeeRepository;
import com.invitation.app.repository.InvitationRepository;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.Normalizer;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.UUID;
import java.util.regex.Pattern;

@Service
public class InvitationService {

    private static final Logger log = LoggerFactory.getLogger(InvitationService.class);

    private final AttendeeRepository attendeeRepository;
    private final InvitationRepository invitationRepository;
    private final EmailService emailService;

    @Value("${invitation.sender-name:Hà Lê Tín}")
    private String senderName;

    @Value("${invitation.default-recipient:Ba Mẹ}")
    private String defaultRecipient;

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

    @Autowired
    public InvitationService(AttendeeRepository attendeeRepository,
            InvitationRepository invitationRepository,
            EmailService emailService) {
        this.attendeeRepository = attendeeRepository;
        this.invitationRepository = invitationRepository;
        this.emailService = emailService;
    }

    /**
     * Khởi tạo sẵn các nhóm thiệp mời đặc thù theo mẫu thiết kế
     */
    @PostConstruct
    public void initSampleInvitations() {
        if (invitationRepository.count() == 0) {
            log.info("Seeding initial customized graduation invitations into Database...");

            saveInvitationEntity("family", "Ba Mẹ", "Hà Lê Tín", "family",
                    "Suốt 4 năm giảng đường với biết bao nỗ lực, mỗi bước đi của con đều được nâng đỡ bởi tình yêu thương, sự hy sinh thầm lặng và niềm tin vững chắc từ Ba Mẹ cùng gia đình. Tấm bằng cử nhân sắp đón nhận không chỉ là thành quả học tập, mà là món quà tri ân chân thành nhất gửi tới Ba Mẹ!");

            saveInvitationEntity("friends", "Hội Bạn Thân", "Hà Lê Tín", "friends",
                    "Bốn năm đại học trôi qua nhanh như một cái chớp mắt, và điều rực rỡ nhất chính là được đồng hành, chia sẻ từng chiếc deadline và những trận cười sảng khoái cùng các bạn. Nhớ lên đồ thật đẹp ghé trường chụp với mình bộ ảnh kỷ yếu nhé!");

            saveInvitationEntity("mentors", "Thầy Cô & Người Hướng Dẫn", "Hà Lê Tín", "mentors",
                    "Nhìn lại suốt 4 năm học tập và nghiên cứu, em luôn khắc ghi những bài giảng tâm huyết, sự tận tình dìu dắt và truyền cảm hứng của Thầy/Cô. Em xin trân trọng kính mời Thầy/Cô dành chút thời gian quý báu đến chung vui cùng em!");

            saveInvitationEntity("thay-tuan", "Thầy PGS.TS Trần Văn Tuấn", "Hà Lê Tín", "mentors",
                    "Kính thưa Thầy, em xin bày tỏ lòng biết ơn sâu sắc nhất đến Thầy vì đã luôn tận tình hướng dẫn, dìu dắt và truyền cho em niềm đam mê nghiên cứu trong suốt thời gian thực hiện khóa luận tốt nghiệp.");
        }
    }

    private void saveInvitationEntity(String code, String recipientName, String senderName, String guestGroup,
            String customMessage) {
        Invitation inv = new Invitation(code, recipientName, senderName, guestGroup, customMessage);
        inv.setEventTitle(eventTitle);
        inv.setEventDate(eventDate);
        inv.setEventTime(eventTime);
        inv.setEventVenue(eventVenue);
        inv.setEventAddress(eventAddress);
        invitationRepository.save(inv);
    }

    /**
     * Tạo slug liên kết duy nhất từ tên khách mời, loại bỏ dấu tiếng Việt và ký tự
     * đặc biệt
     */
    public String generateUniqueSlug(String recipientName) {
        String baseSlug = "khach-moi";
        if (recipientName != null && !recipientName.isBlank()) {
            String normalized = Normalizer.normalize(recipientName.trim(), Normalizer.Form.NFD);
            Pattern pattern = Pattern.compile("\\p{InCombiningDiacriticalMarks}+");
            baseSlug = pattern.matcher(normalized).replaceAll("")
                    .replaceAll("đ", "d").replaceAll("Đ", "d")
                    .toLowerCase(Locale.ROOT)
                    .replaceAll("[^a-z0-9\\s-]", "")
                    .trim()
                    .replaceAll("\\s+", "-");
            if (baseSlug.isBlank()) {
                baseSlug = "khach-moi";
            }
        }

        // Nếu slug chưa tồn tại, dùng luôn slug thân thiện này
        if (!invitationRepository.findByCodeIgnoreCase(baseSlug).isPresent()) {
            return baseSlug;
        }

        // Nếu đã tồn tại, tạo thêm mã hậu tố ngẫu nhiên 4 ký tự để đảm bảo duy nhất
        for (int i = 0; i < 20; i++) {
            String suffix = UUID.randomUUID().toString().substring(0, 4);
            String candidate = baseSlug + "-" + suffix;
            if (!invitationRepository.findByCodeIgnoreCase(candidate).isPresent()) {
                return candidate;
            }
        }

        return baseSlug + "-" + UUID.randomUUID().toString().substring(0, 8);
    }

    /**
     * Lấy thông tin thiệp mời theo mã liên kết (code) hoặc tên người nhận
     */
    public InvitationDto getInvitation(String codeOrRecipient) {
        InvitationDto dto = new InvitationDto();
        dto.setEventTitle(eventTitle);
        dto.setEventDate(eventDate);
        dto.setEventTime(eventTime);
        dto.setEventVenue(eventVenue);
        dto.setEventAddress(eventAddress);
        dto.setDressCode("Trang phục lịch sự, thoải mái (gợi ý tông Trắng, Kem, Be hoặc Xanh Navy)");
        dto.setTimeline(List.of(
                new InvitationDto.TimelineItem("08:15 – 09:15", "Đón Tiếp & Chụp Ảnh Kỷ Niệm",
                        "Đón tiếp khách mời tại Sân Đài Phun Nước, chụp ảnh kỷ niệm trước lễ"),
                new InvitationDto.TimelineItem("09:30 – 11:00", "Nghi Thức Lễ Trao Bằng Chính Thức",
                        "Nghi thức trao bằng tốt nghiệp trang trọng tại Hội trường Lớn"),
                new InvitationDto.TimelineItem("11:00 – 12:30", "Chụp Ảnh Đại Gia Đình & Hội Bạn",
                        "Chụp ảnh lưu niệm cùng lễ phục cử nhân tại các photobooth và sân trường")));

        if (codeOrRecipient != null && !codeOrRecipient.isBlank()) {
            Optional<Invitation> opt = invitationRepository.findByCodeIgnoreCase(codeOrRecipient.trim());
            if (opt.isPresent()) {
                Invitation inv = opt.get();
                dto.setCode(inv.getCode());
                dto.setRecipientName(inv.getRecipientName());
                dto.setSenderName(inv.getSenderName() != null ? inv.getSenderName() : senderName);
                dto.setGuestGroup(inv.getGuestGroup() != null ? inv.getGuestGroup() : "family");
                dto.setCustomMessage(inv.getCustomMessage());
                dto.setDescription(inv.getCustomMessage());
                return dto;
            } else {
                dto.setCode(codeOrRecipient.trim().toLowerCase().replaceAll("[^a-z0-9]", "-"));
                dto.setRecipientName(codeOrRecipient.trim());
                dto.setGuestGroup("family");
            }
        } else {
            dto.setCode("family");
            dto.setRecipientName(defaultRecipient);
            dto.setGuestGroup("family");
        }

        dto.setSenderName(senderName);
        dto.setCustomMessage(
                "Cột mốc trưởng thành sau 4 năm đại học sẽ chỉ thật sự trọn vẹn khi có sự hiện diện, ánh mắt tự hào và những lời chúc phúc của bạn trong ngày trọng đại này.");
        dto.setDescription(dto.getCustomMessage());
        return dto;
    }

    /**
     * Tạo hoặc cập nhật thiệp mời duy nhất trong cơ sở dữ liệu
     */
    @Transactional
    public Invitation createOrUpdateInvitation(CreateInvitationRequest req) {
        String code = req.getCode();
        if (code == null || code.trim().isBlank()) {
            code = generateUniqueSlug(req.getRecipientName());
        } else {
            code = code.trim().toLowerCase(Locale.ROOT).replaceAll("[^a-z0-9\\-_]", "-");
        }

        Invitation inv = invitationRepository.findByCodeIgnoreCase(code)
                .orElse(new Invitation());

        inv.setCode(code);
        inv.setRecipientName(req.getRecipientName().trim());
        inv.setSenderName(req.getSenderName() != null && !req.getSenderName().isBlank() ? req.getSenderName().trim()
                : senderName);
        inv.setGuestGroup(
                req.getGuestGroup() != null && !req.getGuestGroup().isBlank() ? req.getGuestGroup().trim() : "family");
        inv.setCustomMessage(req.getCustomMessage());
        inv.setRecipientEmail(req.getRecipientEmail() != null && !req.getRecipientEmail().isBlank()
                ? req.getRecipientEmail().trim().toLowerCase(Locale.ROOT)
                : null);
        inv.setRecipientPhone(req.getRecipientPhone() != null && !req.getRecipientPhone().isBlank()
                ? req.getRecipientPhone().trim()
                : null);
        inv.setEventTitle(eventTitle);
        inv.setEventDate(eventDate);
        inv.setEventTime(eventTime);
        inv.setEventVenue(eventVenue);
        inv.setEventAddress(eventAddress);

        return invitationRepository.save(inv);
    }

    public List<Invitation> getAllInvitations() {
        return invitationRepository.findAll();
    }

    @Transactional
    public boolean deleteInvitation(Long id) {
        if (invitationRepository.existsById(id)) {
            invitationRepository.deleteById(id);
            return true;
        }
        return false;
    }

    @Transactional
    public RsvpResponse processRsvp(RsvpRequest request) {
        boolean isAttending = request.getAttending() == null || request.getAttending();

        if (!isAttending) {
            log.info("Attendee {} opted NOT to attend (declined).", request.getFullName());
            Attendee declinedAttendee = attendeeRepository
                    .findByEmail(request.getEmail().trim().toLowerCase(Locale.ROOT))
                    .orElse(new Attendee());
            declinedAttendee.setFullName(request.getFullName().trim());
            declinedAttendee.setEmail(request.getEmail().trim().toLowerCase(Locale.ROOT));
            declinedAttendee.setPhone(request.getPhone());
            declinedAttendee.setAttending(false);
            declinedAttendee.setGuestsCount(0);
            declinedAttendee.setGuestGroup(request.getGuestGroup());
            declinedAttendee.setGradName(request.getGradName() != null ? request.getGradName() : senderName);
            declinedAttendee.setNotes(request.getNotes());
            declinedAttendee.setInvitationCode(request.getInvitationCode());
            attendeeRepository.save(declinedAttendee);

            return new RsvpResponse(
                    true,
                    "Cảm ơn bạn đã phản hồi! Mình rất tiếc vì bạn bận và hy vọng sẽ có dịp gặp lại bạn sớm nhất.",
                    null,
                    false,
                    "Không gửi email do bạn đã chọn không tham gia.");
        }

        String confirmationCode = "GRAD-2026-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        Attendee attendee = attendeeRepository.findByEmail(request.getEmail().trim().toLowerCase(Locale.ROOT))
                .orElse(new Attendee());

        attendee.setFullName(request.getFullName().trim());
        attendee.setEmail(request.getEmail().trim().toLowerCase(Locale.ROOT));
        attendee.setPhone(request.getPhone());
        attendee.setAttending(true);
        attendee.setGuestsCount(request.getGuestsCount() != null ? request.getGuestsCount() : 1);
        attendee.setGuestsCountDesc(request.getGuestsCountDesc());
        attendee.setGuestGroup(request.getGuestGroup());
        attendee.setPhotoSlot(request.getPhotoSlot());
        attendee.setGradName(request.getGradName() != null ? request.getGradName() : senderName);
        attendee.setNotes(request.getNotes());
        attendee.setConfirmationCode(confirmationCode);
        attendee.setEmailSent(false);

        Attendee saved = attendeeRepository.save(attendee);
        log.info("Saved attendee RSVP successfully: id={}, email={}, code={}", saved.getId(), saved.getEmail(),
                confirmationCode);

        boolean emailSent = false;
        String emailNotice;
        try {
            emailSent = emailService.sendConfirmationEmail(saved);
            if (emailSent) {
                saved.setEmailSent(true);
                attendeeRepository.save(saved);
                emailNotice = "Thư xác nhận chính thức & vé mời đã được gửi tới " + saved.getEmail()
                        + " qua Google Mail.";
            } else {
                emailNotice = "Đã lưu phản hồi vào hệ thống. Email xác nhận đang ở chế độ chờ cấu hình Google Mail App Password.";
            }
        } catch (Exception e) {
            log.error("Error dispatching email: {}", e.getMessage());
            emailNotice = "Đã lưu phản hồi. Email xác nhận chưa thể gửi qua Google Mail (" + e.getMessage() + ").";
        }

        return new RsvpResponse(
                true,
                "Xác nhận tham dự thành công! Rất mong được đón tiếp và chụp ảnh cùng bạn tại lễ tốt nghiệp.",
                confirmationCode,
                emailSent,
                emailNotice);
    }

    public List<Attendee> getAllAttendees() {
        return attendeeRepository.findAllByOrderByCreatedAtDesc();
    }

    public long getAttendingCount() {
        return attendeeRepository.countByAttendingTrue();
    }

    public long getDeclinedCount() {
        return attendeeRepository.countByAttendingFalse();
    }
}
