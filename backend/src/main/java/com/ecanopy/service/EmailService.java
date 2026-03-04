package com.ecanopy.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Async
    public void sendVisitorAlert(String toEmail, String residentName, String visitorName, String purpose) {
        System.out.println("=================================================");
        System.out.println("EMAIL SERVICE: Attempting to send visitor alert");
        System.out.println("To: " + toEmail);
        System.out.println("Resident: " + residentName);
        System.out.println("Visitor: " + visitorName);
        System.out.println("Purpose: " + purpose);
        System.out.println("From Email: " + fromEmail);
        System.out.println("=================================================");

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("🔔 ECanopy: Visitor Arrival Alert - " + visitorName);

            String htmlContent = String.format(
                    "<html><body style='font-family: Arial, sans-serif; line-height: 1.6; color: #333;'>" +
                            "<div style='max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;'>"
                            +
                            "<h2 style='color: #4f46e5;'>Hello %s,</h2>" +
                            "<p>This is an automated alert from <strong>ECanopy Security</strong>.</p>" +
                            "<div style='background: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;'>" +
                            "<p style='margin: 5px 0;'><strong>Visitor:</strong> %s</p>" +
                            "<p style='margin: 5px 0;'><strong>Purpose:</strong> %s</p>" +
                            "<p style='margin: 5px 0;'><strong>Location:</strong> Society Main Gate</p>" +
                            "</div>" +
                            "<p>If you were not expecting this visitor, please contact the security gate immediately.</p>"
                            +
                            "<hr style='border: none; border-top: 1px solid #eee; margin: 20px 0;'>" +
                            "<p style='font-size: 12px; color: #999;'>Sent with ❤️ from ECanopy Society Management System.</p>"
                            +
                            "</div></body></html>",
                    residentName, visitorName, purpose);

            helper.setText(htmlContent, true);

            System.out.println("EMAIL SERVICE: Sending email via JavaMailSender...");
            mailSender.send(message);
            System.out.println("✅ SUCCESS: Visitor alert email sent successfully to: " + toEmail);
            System.out.println("=================================================");
        } catch (MessagingException e) {
            System.err.println("❌ ERROR: Failed to send visitor alert email");
            System.err.println("Error Message: " + e.getMessage());
            System.err.println("Stack Trace:");
            e.printStackTrace();
            System.err.println("=================================================");
        } catch (Exception e) {
            System.err.println("❌ UNEXPECTED ERROR in email service");
            System.err.println("Error: " + e.getMessage());
            e.printStackTrace();
            System.err.println("=================================================");
        }
    }

    @Async
    public void sendBookingStatusEmail(String toEmail, String residentName, String amenityName, String status,
            String date, String time) {
        System.out.println("=================================================");
        System.out.println("EMAIL SERVICE: Sending Amenity Booking Status");
        System.out.println("To: " + toEmail);
        System.out.println("Status: " + status);
        System.out.println("=================================================");

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            String subject = status.equalsIgnoreCase("APPROVED") ? "✅ Booking Confirmed: " + amenityName
                    : "❌ Booking Update: " + amenityName;
            helper.setSubject("ECanopy: " + subject);

            String statusColor = status.equalsIgnoreCase("APPROVED") ? "#10b981" : "#ef4444";

            String htmlContent = String.format(
                    "<html><body style='font-family: Arial, sans-serif; line-height: 1.6; color: #333;'>" +
                            "<div style='max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;'>"
                            +
                            "<h2 style='color: #4f46e5;'>Hello %s,</h2>" +
                            "<p>Your booking request for <strong>%s</strong> has been updated.</p>" +
                            "<div style='background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid %s;'>"
                            +
                            "<p style='margin: 5px 0;'><strong>Status:</strong> <span style='color: %s; font-weight: bold;'>%s</span></p>"
                            +
                            "<p style='margin: 5px 0;'><strong>Date:</strong> %s</p>" +
                            "<p style='margin: 5px 0;'><strong>Time:</strong> %s</p>" +
                            "</div>" +
                            "<p>%s</p>" +
                            "<hr style='border: none; border-top: 1px solid #eee; margin: 20px 0;'>" +
                            "<p style='font-size: 12px; color: #999;'>Sent with ❤️ from ECanopy Society Management System.</p>"
                            +
                            "</div></body></html>",
                    residentName, amenityName, statusColor, statusColor, status, date, time,
                    status.equalsIgnoreCase("APPROVED")
                            ? "Please ensure you follow the amenity rules during your visit."
                            : "If you have any questions, please contact the society office.");

            helper.setText(htmlContent, true);
            mailSender.send(message);
            System.out.println("✅ SUCCESS: Booking status email sent to: " + toEmail);
        } catch (Exception e) {
            System.err.println("❌ ERROR: Failed to send booking status email: " + e.getMessage());
        }
    }
}
