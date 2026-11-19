package com.invitation.app.repository;

import com.invitation.app.entity.Invitation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface InvitationRepository extends JpaRepository<Invitation, Long> {
    Optional<Invitation> findByCodeIgnoreCase(String code);
    boolean existsByCodeIgnoreCase(String code);
}
