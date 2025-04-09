package com.example.forum.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendReservationConfirmation(String to, String eventTitle, String eventDate) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Confirmation de réservation: " + eventTitle);
        message.setText("Bonjour,\n\nVotre réservation pour l'événement '" + eventTitle +
                "' prévu le " + eventDate + " a été confirmée.\n\nMerci pour votre réservation !");

        mailSender.send(message);
    }
}