package com.example.forum.service;

import com.example.forum.entity.Event;
import com.example.forum.entity.Forum;
import com.example.forum.entity.Blog;
import com.example.forum.entity.Reservation;
import com.example.forum.repository.EventRepository;
import com.example.forum.repository.ForumRepository;
import com.example.forum.repository.BlogRepository;
import com.example.forum.repository.ReservationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;
@Service
@RequiredArgsConstructor
public class ReservationService {
    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private EventRepository eventRepository;

    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }

    public List<Reservation> getReservationsByEventId(Long eventId) {
        return reservationRepository.findByEventId(eventId);
    }

    public List<Reservation> getReservationsByStudentEmail(String studentEmail) {
        return reservationRepository.findByStudentEmail(studentEmail);
    }

    public Optional<Reservation> getReservationById(Long id) {
        return reservationRepository.findById(id);
    }


    public Reservation updateReservation(Reservation reservation) {
        return reservationRepository.save(reservation);
    }

    public void deleteReservation(Long id) {
        Optional<Reservation> reservationOpt = reservationRepository.findById(id);
        if (reservationOpt.isPresent()) {
            Reservation reservation = reservationOpt.get();
            Event event = reservation.getEvent();
            // Décrémenter le nombre de participants
            if (event != null && event.getNumberParticipants() > 0) {
                event.setNumberParticipants(event.getNumberParticipants() - 1);
                eventRepository.save(event);
            }
            reservationRepository.deleteById(id);
        }
    }


    @Autowired
    private EmailService emailService;

    // Other methods remain the same

    public Reservation createReservation(Reservation reservation, Long eventId) {
        Optional<Event> eventOpt = eventRepository.findById(eventId);
        if (eventOpt.isPresent()) {
            Event event = eventOpt.get();
            // Vérifier s'il reste des places
            if (event.getNumberParticipants() < event.getMaxParticipants()) {
                // Set current date if not provided
                if (reservation.getReservationDate() == null) {
                    reservation.setReservationDate(new Date());
                }

                reservation.setEvent(event);
                // Incrémenter le nombre de participants
                event.setNumberParticipants(event.getNumberParticipants() + 1);
                eventRepository.save(event);

                // Save the reservation
                Reservation savedReservation = reservationRepository.save(reservation);

                // Send confirmation email
                try {
                    emailService.sendReservationConfirmation(
                            reservation.getStudentEmail(),
                            event.getEventTitle(),
                            event.getEventDate().toString()
                    );
                } catch (Exception e) {
                    // Log the error but don't fail the reservation
                    System.err.println("Failed to send email: " + e.getMessage());
                }

                return savedReservation;
            }
        }
        return null;
    }
}
