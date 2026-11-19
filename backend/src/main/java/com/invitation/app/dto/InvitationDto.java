package com.invitation.app.dto;

import java.util.List;

public class InvitationDto {

    private String code;
    private String recipientName;
    private String senderName;
    private String guestGroup; // "family", "friends", "mentors"
    private String customMessage;
    private String eventTitle;
    private String eventDate;
    private String eventTime;
    private String eventVenue;
    private String eventAddress;
    private String description;
    private String dressCode;
    private List<TimelineItem> timeline;

    public static class TimelineItem {
        private String time;
        private String title;
        private String description;

        public TimelineItem() {}

        public TimelineItem(String time, String title, String description) {
            this.time = time;
            this.title = title;
            this.description = description;
        }

        public String getTime() {
            return time;
        }
        public void setTime(String time) {
            this.time = time;
        }
        public String getTitle() {
            return title;
        }
        public void setTitle(String title) {
            this.title = title;
        }
        public String getDescription() {
            return description;
        }
        public void setDescription(String description) {
            this.description = description;
        }
    }

    public InvitationDto() {}

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
    public String getEventTitle() {
        return eventTitle;
    }
    public void setEventTitle(String eventTitle) {
        this.eventTitle = eventTitle;
    }
    public String getEventDate() {
        return eventDate;
    }
    public void setEventDate(String eventDate) {
        this.eventDate = eventDate;
    }
    public String getEventTime() {
        return eventTime;
    }
    public void setEventTime(String eventTime) {
        this.eventTime = eventTime;
    }
    public String getEventVenue() {
        return eventVenue;
    }
    public void setEventVenue(String eventVenue) {
        this.eventVenue = eventVenue;
    }
    public String getEventAddress() {
        return eventAddress;
    }
    public void setEventAddress(String eventAddress) {
        this.eventAddress = eventAddress;
    }
    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }
    public String getDressCode() {
        return dressCode;
    }
    public void setDressCode(String dressCode) {
        this.dressCode = dressCode;
    }
    public List<TimelineItem> getTimeline() {
        return timeline;
    }
    public void setTimeline(List<TimelineItem> timeline) {
        this.timeline = timeline;
    }
}
