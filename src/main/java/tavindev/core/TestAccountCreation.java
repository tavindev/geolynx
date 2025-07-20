package tavindev.core;

import jakarta.servlet.ServletContextEvent;
import jakarta.servlet.ServletContextListener;
import jakarta.servlet.annotation.WebListener;
import tavindev.core.entities.*;
import tavindev.core.utils.PasswordUtils;
import tavindev.infra.repositories.DatastoreUserRepository;

import java.time.LocalDate;

@WebListener
public class TestAccountCreation implements ServletContextListener {
    private final DatastoreUserRepository userRepository;

    public TestAccountCreation() {
        this.userRepository = new DatastoreUserRepository();
    }

    @Override
    public void contextInitialized(ServletContextEvent sce) {
        if (userRepository.findByIdentifier("admin") == null) {
            User adminUser = new User(
                    "admin@gmail.com",
                    "admin",
                    "Admin",
                    PasswordUtils.hashPassword("admin"),
                    UserRole.SYSADMIN,
                    AccountStatus.ATIVADA);
            userRepository.save(adminUser);
        }

        // Create 10 ENDUSER accounts (Role RU - Registered User)
        createUserIfNotExists("enduser1", "enduser1@gmail.com", "enduser1$A2025", "End User 1", UserRole.RU);
        createUserIfNotExists("enduser2", "enduser2@gmail.com", "Enduser2$A2025", "End User 2", UserRole.RU);
        createUserIfNotExists("enduser3", "enduser3@gmail.com", "Enduser3$A2025", "End User 3", UserRole.RU);
        createUserIfNotExists("enduser4", "enduser4@gmail.com", "Enduser4$A2025", "End User 4", UserRole.RU);
        createUserIfNotExists("enduser5", "enduser5@gmail.com", "Enduser5$A2025", "End User 5", UserRole.RU);
        createUserIfNotExists("enduser6", "enduser6@gmail.com", "Enduser6$A2025", "End User 6", UserRole.RU);
        createUserIfNotExists("enduser7", "enduser7@gmail.com", "Enduser7$A2025", "End User 7", UserRole.RU);
        createUserIfNotExists("enduser8", "enduser8@gmail.com", "Enduser8$A2025", "End User 8", UserRole.RU);
        createUserIfNotExists("enduser9", "enduser9@gmail.com", "Enduser9$A2025", "End User 9", UserRole.RU);
        createUserIfNotExists("enduser10", "enduser10@gmail.com", "enduser10$A2025", "End User 10", UserRole.RU);

        // Create 4 SYSADMIN accounts (Role SYSADMIN - System Administrator)
        createUserIfNotExists("sysadmin1", "sysadmin1@gmail.com", "sysadmin1$A2025", "System Admin 1",
                UserRole.SYSADMIN);
        createUserIfNotExists("sysadmin2", "sysadmin2@gmail.com", "sysmdin2$A2025", "System Admin 2",
                UserRole.SYSADMIN);
        createUserIfNotExists("sysadmin3", "sysadmin3@gmail.com", "sysadmin3$A2025", "System Admin 3",
                UserRole.SYSADMIN);
        createUserIfNotExists("sysadmin4", "sysadmin4@gmail.com", "sysadmin4$A2025", "System Admin 4",
                UserRole.SYSADMIN);

        // Create 4 SYSBO accounts (Role SYSBO - System BackOffice)
        createUserIfNotExists("sysbo1", "sysbo1@gmail.com", "sysbo1$A2025", "System BackOffice 1", UserRole.SYSBO);
        createUserIfNotExists("sysbo2", "sysbo2@gmail.com", "sysbo2$A2025", "System BackOffice 2", UserRole.SYSBO);
        createUserIfNotExists("sysbo3", "sysbo3@gmail.com", "sysbo3$A2025", "System BackOffice 3", UserRole.SYSBO);
        createUserIfNotExists("sysbo4", "sysbo4@gmail.com", "sysbo4$A2025", "System BackOffice 4", UserRole.SYSBO);

        // Create 2 SMBO accounts (Role SMBO - Sheet Manager Backoffice)
        createUserIfNotExists("smbo1", "smbo1@gmail.com", "smbo1$A2025", "Sheet Manager BackOffice 1", UserRole.SMBO);
        createUserIfNotExists("smbo2", "smbo2@gmail.com", "smbo2$A2025", "Sheet Manager BackOffice 2", UserRole.SMBO);

        // Create 2 SGVBO accounts (Role SGVBO - Sheet General Viewer BackOffice)
        createUserIfNotExists("sgvbo1", "sgvbo1@gmail.com", "sgvbo1$A2025", "Sheet General Viewer BackOffice 1",
                UserRole.SGVBO);
        createUserIfNotExists("sgvbo2", "sgvbo2@gmail.com", "sgvbo2$A2025", "Sheet General Viewer BackOffice 2",
                UserRole.SGVBO);

        // Create 2 SDVBO accounts (Role SDVBO - Sheet Detailed Viewer BackOffice)
        createUserIfNotExists("sdvbo1", "sdvbo1@gmail.com", "sdvbo1$A2025", "Sheet Detailed Viewer BackOffice 1",
                UserRole.SDVBO);
        createUserIfNotExists("sdvbo2", "sdvbo2@gmail.com", "sdvbo2$A2025", "Sheet Detailed Viewer BackOffice 2",
                UserRole.SDVBO);

        // Create 2 PRBO accounts (Role PRBO - Partner Representative BackOffice)
        createUserIfNotExists("prbo1", "prbo1@gmail.com", "prbo1$A2025", "Partner Representative BackOffice 1",
                UserRole.PRBO);
        createUserIfNotExists("prbo2", "prbo2@gmail.com", "prbo2$A2025", "Partner Representative BackOffice 2",
                UserRole.PRBO);

        // Create 4 PO accounts (Role PO - Partner Operator)
        createUserIfNotExists("po1", "po1@gmail.com", "po1$A2025", "Partner Operator 1", UserRole.PO);
        createUserIfNotExists("po2", "po2@gmail.com", "po2$A2025", "Partner Operator 2", UserRole.PO);
        createUserIfNotExists("po3", "po3@gmail.com", "po3$A2025", "Partner Operator 3", UserRole.PO);
        createUserIfNotExists("po4", "po4@gmail.com", "po4$A2025", "Partner Operator 4", UserRole.PO);

        // Create 4 ADLU accounts (Role ADLU - Adherent Landowner User)
        createUserIfNotExists("adlu1", "adlu1@gmail.com", "adlu1$A2025", "Adherent Landowner User 1", UserRole.ADLU);
        createUserIfNotExists("adlu2", "adlu2@gmail.com", "adlu2$A2025", "Adherent Landowner User 2", UserRole.ADLU);
        createUserIfNotExists("adlu3", "adlu3@gmail.com", "adlu3$A2025", "Adherent Landowner User 3", UserRole.ADLU);
        createUserIfNotExists("adlu4", "adlu4@gmail.com", "adlu4$A2025", "Adherent Landowner User 4", UserRole.ADLU);
    }

    private void createUserIfNotExists(String identifier, String email, String password, String name, UserRole role) {
        if (userRepository.findByIdentifier(identifier) == null) {
            User user = new User(
                    email,
                    identifier,
                    name,
                    PasswordUtils.hashPassword(password),
                    role,
                    AccountStatus.ATIVADA);
            userRepository.save(user);
        }
    }

    @Override
    public void contextDestroyed(ServletContextEvent sce) {
        // Cleanup code
    }
}