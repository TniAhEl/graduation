package com.invitation.app.controller;

import com.invitation.app.dto.CreateInvitationRequest;
import com.invitation.app.dto.InvitationDto;
import com.invitation.app.dto.RsvpRequest;
import com.invitation.app.dto.RsvpResponse;
import com.invitation.app.entity.Attendee;
import com.invitation.app.entity.Invitation;
import com.invitation.app.service.InvitationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class InvitationController {

    private final InvitationService invitationService;

    private static final Logger log = LoggerFactory.getLogger(InvitationController.class);

    @Autowired
    public InvitationController(InvitationService invitationService) {
        this.invitationService = invitationService;
    }

    @GetMapping("/admin/auth")
    public ResponseEntity<Void> verifyAdminAuthentication() {
        return ResponseEntity.noContent().build();
    }

    /**
     * Lấy thông tin thiệp mời theo mã liên kết (code) hoặc tên người nhận (to)
     */
    @GetMapping("/invitation")
    public ResponseEntity<InvitationDto> getInvitation(
            @RequestParam(value = "code", required = false) String code,
            @RequestParam(value = "to", required = false) String to) {
        String query = (code != null && !code.isBlank()) ? code : to;
        InvitationDto details = invitationService.getInvitation(query);
        return ResponseEntity.ok(details);
    }

    /**
     * Lấy danh sách toàn bộ các liên kết thiệp mời tùy biến trong Database
     */
    @GetMapping("/invitations")
    public ResponseEntity<List<Invitation>> getAllInvitations() {
        return ResponseEntity.ok(invitationService.getAllInvitations());
    }

    /**
     * Lấy thông tin thiệp mời theo mã đường dẫn: /api/invitations/{code}
     */
    @GetMapping("/invitations/{code}")
    public ResponseEntity<InvitationDto> getInvitationByPathCode(@PathVariable("code") String code) {
        InvitationDto details = invitationService.getInvitation(code);
        return ResponseEntity.ok(details);
    }

    /**
     * Tạo hoặc cập nhật thiệp mời tùy biến mới vào Database
     */
    @PostMapping("/invitations")
    public ResponseEntity<Invitation> createInvitation(@Valid @RequestBody CreateInvitationRequest request) {
        log.info("[INVITATION REQUEST] recipient={}, email={}, code={}", request.getRecipientName(),
                request.getRecipientEmail(), request.getCode());
        Invitation created = invitationService.createOrUpdateInvitation(request);
        log.info("[INVITATION CREATED] code={}, recipient={}, email={}, phone={}, group={}", created.getCode(),
                created.getRecipientName(), created.getRecipientEmail(), created.getRecipientPhone(),
                created.getGuestGroup());
        return ResponseEntity.ok(created);
    }

    /**
     * Xóa một thiệp mời theo ID
     */
    @DeleteMapping("/invitations/{id}")
    public ResponseEntity<Map<String, Object>> deleteInvitation(@PathVariable("id") Long id) {
        boolean deleted = invitationService.deleteInvitation(id);
        log.info("[INVITATION DELETED] id={}, deleted={}", id, deleted);
        Map<String, Object> res = new HashMap<>();
        res.put("success", deleted);
        return ResponseEntity.ok(res);
    }

    /**
     * Gửi xác nhận tham gia hoặc không tham gia (RSVP)
     */
    @PostMapping("/invitation/rsvp")
    public ResponseEntity<RsvpResponse> submitRsvp(@Valid @RequestBody RsvpRequest request) {
        log.info("[RSVP REQUEST] name={}, email={}, attending={}, invitationCode={}",
                request.getFullName(), request.getEmail(), request.getAttending(), request.getInvitationCode());
        RsvpResponse response = invitationService.processRsvp(request);
        log.info("[RSVP SAVED] name={}, confirmationCode={}", request.getFullName(), response.getConfirmationCode());
        return ResponseEntity.ok(response);
    }

    /**
     * Lấy danh sách toàn bộ khách mời và số liệu thống kê phản hồi
     */
    @GetMapping("/invitation/attendees")
    public ResponseEntity<Map<String, Object>> getAttendees() {
        List<Attendee> attendees = invitationService.getAllAttendees();
        long attendingCount = invitationService.getAttendingCount();
        long declinedCount = invitationService.getDeclinedCount();

        Map<String, Object> response = new HashMap<>();
        response.put("attendees", attendees);
        response.put("totalCount", attendees.size());
        response.put("attendingCount", attendingCount);
        response.put("declinedCount", declinedCount);

        return ResponseEntity.ok(response);
    }

    /**
     * Health check endpoint
     */
    @GetMapping("/invitation/health")
    public ResponseEntity<Map<String, String>> healthCheck() {
        Map<String, String> status = new HashMap<>();
        status.put("status", "UP");
        status.put("service", "invitation-backend");
        status.put("database", "configured");
        return ResponseEntity.ok(status);
    }
}
