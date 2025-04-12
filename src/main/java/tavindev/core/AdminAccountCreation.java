package tavindev.core;

import jakarta.servlet.ServletContextEvent;
import jakarta.servlet.ServletContextListener;
import jakarta.servlet.annotation.WebListener;
import tavindev.core.entities.*;
import tavindev.core.repositories.UserRepository;
import tavindev.infra.repositories.DatastoreUserRepository;


@WebListener
public class AdminAccountCreation implements ServletContextListener {
    private final UserRepository userRepository;

    public AdminAccountCreation() {
        this.userRepository = new DatastoreUserRepository();
    }

    @Override
    public void contextInitialized(ServletContextEvent sce) {
        try {
            PersonalInfo personalInfo = new PersonalInfo(
                    "admin@gmail.com",
                    "admin",
                    "Admin",
                    "registerUserDTO.phoneNumber()",
                    "admin"
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
                    UserRole.ADMIN,
                    AccountStatus.ATIVADA
            );

            userRepository.save(user);
        } catch (Exception e) {
            e.printStackTrace();
        }

    }

    @Override
    public void contextDestroyed(ServletContextEvent sce) {
        // Cleanup code
    }
}