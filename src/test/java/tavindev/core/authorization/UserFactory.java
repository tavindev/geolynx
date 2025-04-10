package tavindev.core.authorization;

import tavindev.core.entities.User;
import tavindev.core.entities.UserRole;
import tavindev.core.entities.PersonalInfo;
import tavindev.core.entities.IdentificationInfo;
import tavindev.core.entities.ProfessionalInfo;
import tavindev.core.entities.UserProfile;
import tavindev.core.entities.AccountStatus;

import java.util.Optional;

public class UserFactory {
    public static User createUser(String username, UserRole role) {
        PersonalInfo personalInfo = new PersonalInfo(
            username + "@example.com",
            username,
            "Test User",
            "+351912345678",
            "password123",
            Optional.empty()
        );

        IdentificationInfo identificationInfo = new IdentificationInfo(
            Optional.empty(),
            Optional.empty(),
            Optional.empty()
        );

        ProfessionalInfo professionalInfo = new ProfessionalInfo(
            Optional.empty(),
            Optional.empty(),
            Optional.empty()
        );

        return new User(
            personalInfo,
            identificationInfo,
            professionalInfo,
            UserProfile.PRIVADO,
            role,
            AccountStatus.ATIVADA
        );
    }

    public static User createEndUser(String username) {
        return createUser(username, UserRole.ENDUSER);
    }

    public static User createBackOfficeUser(String username) {
        return createUser(username, UserRole.BACKOFFICE);
    }

    public static User createAdminUser(String username) {
        return createUser(username, UserRole.ADMIN);
    }

    public static User createPartnerUser(String username) {
        return createUser(username, UserRole.PARTNER);
    }
} 