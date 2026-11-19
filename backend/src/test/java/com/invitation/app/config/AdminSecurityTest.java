package com.invitation.app.config;

import com.invitation.app.controller.InvitationController;
import com.invitation.app.dto.CreateInvitationRequest;
import com.invitation.app.entity.Invitation;
import com.invitation.app.service.InvitationService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

import java.nio.charset.StandardCharsets;
import java.util.Base64;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(InvitationController.class)
@Import(SecurityConfig.class)
@TestPropertySource(properties = {
        "admin.username=test-admin",
        "admin.password=test-password"
})
class AdminSecurityTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private InvitationService invitationService;

    @Test
    void protectsAdminEndpointsAndKeepsPublicHealthCheckOpen() throws Exception {
        mockMvc.perform(get("/api/admin/auth"))
                .andExpect(status().isUnauthorized());
        mockMvc.perform(get("/api/invitations"))
                .andExpect(status().isUnauthorized());
        mockMvc.perform(get("/api/invitation/attendees"))
                .andExpect(status().isUnauthorized());
        mockMvc.perform(post("/api/invitations"))
                .andExpect(status().isUnauthorized());
        mockMvc.perform(delete("/api/invitations/1"))
                .andExpect(status().isUnauthorized());
        mockMvc.perform(get("/api/invitation/health"))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/admin/auth")
                        .header("Authorization", basicAuthorization("test-admin", "test-password")))
                .andExpect(status().isNoContent());

        Invitation invitation = new Invitation("ba-me", "Ba Mẹ", "Tân Cử Nhân", "family", null);
        when(invitationService.createOrUpdateInvitation(any(CreateInvitationRequest.class)))
                .thenReturn(invitation);

        mockMvc.perform(post("/api/invitations")
                        .header("Authorization", basicAuthorization("test-admin", "test-password"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "recipientName": "Ba Mẹ",
                                  "senderName": "Tân Cử Nhân",
                                  "guestGroup": "family"
                                }
                                """))
                .andExpect(status().isOk());
    }

    private String basicAuthorization(String username, String password) {
        String credentials = username + ":" + password;
        return "Basic " + Base64.getEncoder().encodeToString(credentials.getBytes(StandardCharsets.UTF_8));
    }
}
