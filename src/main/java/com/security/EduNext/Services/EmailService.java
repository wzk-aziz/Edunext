package com.security.EduNext.Services;

import com.security.EduNext.Entities.MailBody;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {


    private final JavaMailSender javamailSender;

    public EmailService(JavaMailSender javamailSender) {
        this.javamailSender = javamailSender;
    }


    public void sendSimpleMessage(MailBody mailBody){
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(mailBody.to());
        message.setFrom("raed.amri@esprit.tn");
        message.setSubject(mailBody.subject());
        message.setText(mailBody.text());

        javamailSender.send(message);

    }



    }

