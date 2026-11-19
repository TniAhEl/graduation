package com.invitation.app.dto;

import jakarta.validation.constraints.NotBlank;

public class CreateInvitationRequest {

    /**
     * Mã liên kết duy nhất (tùy chọn).
     * Nếu bỏ trống, backend sẽ tự động tạo slug duy nhất dựa trên tên người nhận.
     */
    private String code;

    @NotBlank(message = "Tên người được mời không được để trống")
    private String recipientName;

    private String senderName;

    private String guestGroup = "family"; // "family", "friends", "mentors"

    private String customMessage;

    private String recipientEmail;

    private String recipientPhone;

    public CreateInvitationRequest() {
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getRecipientName() {
        return recipientName;
    }

    public void setRecipientName(String recipientName) {
        this.recipientName = recipientName;
    }

    public String getSenderName() {
        return senderName;
    }

    public void setSenderName(String senderName) {
        this.senderName = senderName;
    }

    public String getGuestGroup() {
        return guestGroup;
    }

    public void setGuestGroup(String guestGroup) {
        this.guestGroup = guestGroup;
    }

    public String getCustomMessage() {
        return customMessage;
    }

    public void setCustomMessage(String customMessage) {
        this.customMessage = customMessage;
    }

    public String getRecipientEmail() {
        return recipientEmail;
    }

    public void setRecipientEmail(String recipientEmail) {
        this.recipientEmail = recipientEmail;
    }

    public String getRecipientPhone() {
        return recipientPhone;
    }

    public void setRecipientPhone(String recipientPhone) {
        this.recipientPhone = recipientPhone;
    }
}
