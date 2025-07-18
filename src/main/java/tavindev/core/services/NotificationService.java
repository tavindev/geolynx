package tavindev.core.services;

import javax.mail.*;
import javax.mail.internet.*;
import java.util.Properties;

public class NotificationService {
    // This service will handle notifications for users
    // It can include methods to send notifications, fetch user notifications, etc.

    private final String fromEmail = System.getenv("SMTP_USER");
    private final String password = System.getenv("SMTP_PASSWORD");// Use environment variables or secure vaults in production
    private final Properties properties;

    public NotificationService() {
        // Initialize properties for email sending
        properties = new Properties();
        // Set up mail server properties
        properties.put("mail.smtp.auth", "true");
        properties.put("mail.smtp.starttls.enable", "true");
        properties.put("mail.smtp.host", "smtp.gmail.com");
        properties.put("mail.smtp.port", "587");
    }

    // Example method to send a notification
    public void sendNotification(String toEmail, String message) {
        if (fromEmail == null || password == null) {
            System.err.println("Error: SMTP_USER and/or SMTP_PASSWORD environment variables are not set.");
            System.err.println("Please set them before running the application.");
            return; // Stop the method from continuing
        }

        // Logic to send email notification
        Session session = Session.getInstance(properties, new Authenticator() {
            @Override
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(fromEmail, password);
            }
        });

        try {
            Message msg = new MimeMessage(session);
            msg.setFrom(new InternetAddress(fromEmail));
            msg.setRecipients(Message.RecipientType.TO, InternetAddress.parse(toEmail));
            msg.setSubject("Notification");
            msg.setText(message);
            Transport.send(msg);
            System.out.println("Notification sent successfully to " + toEmail);
        } catch (MessagingException e) {
            e.printStackTrace();
        }

    }
}
