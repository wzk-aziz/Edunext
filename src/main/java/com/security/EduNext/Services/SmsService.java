package com.security.EduNext.Services;

import com.security.EduNext.Twilio.TwilioConfig;
import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class SmsService {
    private static final Logger logger = LoggerFactory.getLogger(SmsService.class);
    private final TwilioConfig twilioConfig;

    public SmsService(TwilioConfig twilioConfig) {
        this.twilioConfig = twilioConfig;
        Twilio.init(twilioConfig.getAccountSid(), twilioConfig.getAuthToken());
    }

    public void sendPasswordResetSMS(String phoneNumber, String token) {
        try {
            if (phoneNumber == null || phoneNumber.trim().isEmpty()) {
                logger.warn("No phone number provided, skipping SMS sending");
                return;
            }

            String message = "Your EduNext password reset token is: " + token;

            Message.creator(
                    new PhoneNumber(phoneNumber),
                    new PhoneNumber(twilioConfig.getSenderPhoneNumber()),
                    message
            ).create();

            logger.info("SMS sent successfully to {}", phoneNumber);
        } catch (Exception e) {
            logger.error("Failed to send SMS to {}: {}", phoneNumber, e.getMessage());
            // You might want to throw a custom exception here if you want to handle it upstream
        }
    }
}