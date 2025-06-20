package tavindev.core;

import jakarta.servlet.ServletContextEvent;
import jakarta.servlet.ServletContextListener;
import jakarta.servlet.annotation.WebListener;
import tavindev.core.entities.*;
import tavindev.infra.repositories.DatastoreUserRepository;

import java.time.LocalDate;


@WebListener
public class AdminAccountCreation implements ServletContextListener {
    private final DatastoreUserRepository userRepository;

    public AdminAccountCreation() {
        this.userRepository = new DatastoreUserRepository();
    }

    @Override
    public void contextInitialized(ServletContextEvent sce) {
        if (userRepository.findByIdentifier("admin") != null) return;

        PersonalInfo personalInfo = new PersonalInfo(
                "admin@gmail.com",
                "admin",
                "Admin",
                "NOT DEFINED",
                "admin",
                "",
                "",
                "",
                "",
                LocalDate.now()
        );

        IdentificationInfo identificationInfo = new IdentificationInfo(
                "NOT DEFINED",
                "NOT DEFINED",
                "NOT DEFINED"
        );

        ProfessionalInfo professionalInfo = new ProfessionalInfo(
                "NOT DEFINED",
                "NOT DEFINED",
                "NOT DEFINED"
        );

        User user = new User(
                personalInfo,
                identificationInfo,
                professionalInfo,
                UserProfile.PRIVADO,
                UserRole.SYSADMIN,
                AccountStatus.ATIVADA
        );

        userRepository.save(user);
    }

    @Override
    public void contextDestroyed(ServletContextEvent sce) {
        // Cleanup code
    }
}