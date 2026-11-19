package com.invitation.app.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "attendees")
public class Attendee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column(name = "email", nullable = false)
    private String email;

    @Column(name = "phone")
    private String phone;

    @Column(name = "attending", nullable = false)
    private Boolean attending = true;

    @Column(name = "guests_count")
    private Integer guestsCount = 0;

    @Column(name = "guests_count_desc")
    private String guestsCountDesc;

    @Column(name = "guest_group")
    private String guestGroup; // "family", "friends", "mentors"

    @Column(name = "photo_slot")
    private String photoSlot; // "08:30 – 09:30...", "11:00 – 12:00..."

    @Column(name = "grad_name")
    private String gradName; // Tân Cử Nhân

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @Column(name = "confirmation_code", unique = true)
    private String confirmationCode;

    @Column(name = "email_sent")
    private Boolean emailSent = false;

    @Column(name = "invitation_code")
    private String invitationCode;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public Attendee() {
        this.createdAt = LocalDateTime.now();
    }

    public Attendee(String fullName, String email, String phone, Boolean attending, Integer guestsCount, String notes) {
        this.fullName = fullName;
        this.email = email;
        this.phone = phone;
        this.attending = attending != null ? attending : true;
        this.guestsCount = guestsCount != null ? guestsCount : 0;
        this.notes = notes;
        this.createdAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public Boolean getAttending() {
        return attending;
    }

    public void setAttending(Boolean attending) {
        this.attending = attending;
    }

    public Integer getGuestsCount() {
        return guestsCount;
    }

    public void setGuestsCount(Integer guestsCount) {
        this.guestsCount = guestsCount;
    }

    public String getGuestsCountDesc() {
        return guestsCountDesc;
    }

    public void setGuestsCountDesc(String guestsCountDesc) {
        this.guestsCountDesc = guestsCountDesc;
    }

    public String getGuestGroup() {
        return guestGroup;
    }

    public void setGuestGroup(String guestGroup) {
        this.guestGroup = guestGroup;
    }

    public String getPhotoSlot() {
        return photoSlot;
    }

    public void setPhotoSlot(String photoSlot) {
        this.photoSlot = photoSlot;
    }

    public String getGradName() {
        return gradName;
    }

    public void setGradName(String gradName) {
        this.gradName = gradName;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public String getConfirmationCode() {
        return confirmationCode;
    }

    public void setConfirmationCode(String confirmationCode) {
        this.confirmationCode = confirmationCode;
    }

    public Boolean getEmailSent() {
        return emailSent;
    }

    public void setEmailSent(Boolean emailSent) {
        this.emailSent = emailSent;
    }

    public String getInvitationCode() {
        return invitationCode;
    }

    public void setInvitationCode(String invitationCode) {
        this.invitationCode = invitationCode;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
