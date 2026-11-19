package com.invitation.app.repository;

import com.invitation.app.entity.Attendee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AttendeeRepository extends JpaRepository<Attendee, Long> {
    Optional<Attendee> findByEmail(String email);
    Optional<Attendee> findByConfirmationCode(String confirmationCode);
    List<Attendee> findAllByOrderByCreatedAtDesc();
    long countByAttendingTrue();
    long countByAttendingFalse();
}

