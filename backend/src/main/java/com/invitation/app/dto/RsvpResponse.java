package com.invitation.app.dto;

public class RsvpResponse {

    private boolean success;
    private String message;
    private String confirmationCode;
    private boolean emailSent;
    private String emailNotice;

    public RsvpResponse() {}

    public RsvpResponse(boolean success, String message, String confirmationCode, boolean emailSent, String emailNotice) {
        this.success = success;
        this.message = message;
        this.confirmationCode = confirmationCode;
        this.emailSent = emailSent;
        this.emailNotice = emailNotice;
    }

    public boolean isSuccess() {
        return success;
    }
    public void setSuccess(boolean success) {
        this.success = success;
    }
    public String getMessage() {
        return message;
    }
    public void setMessage(String message) {
        this.message = message;
    }
    public String getConfirmationCode() {
        return confirmationCode;
    }
    public void setConfirmationCode(String confirmationCode) {
        this.confirmationCode = confirmationCode;
    }
    public boolean isEmailSent() {
        return emailSent;
    }
    public void setEmailSent(boolean emailSent) {
        this.emailSent = emailSent;
    }
    public String getEmailNotice() {
        return emailNotice;
    }
    public void setEmailNotice(String emailNotice) {
        this.emailNotice = emailNotice;
    }
}

