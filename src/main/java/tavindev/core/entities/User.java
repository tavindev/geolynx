package tavindev.core.entities;

import java.util.regex.Pattern;
import java.util.Optional;

public record User(
    PersonalInfo personalInfo,
    IdentificationInfo identificationInfo,
    ProfessionalInfo professionalInfo,
    UserProfile profile,
    UserRole role,
    AccountStatus accountStatus
) {
    public static User create(
        String email,
        String username,
        String fullName,
        String phone,
        String password,
        UserProfile profile
    ) {
        return new User(
            new PersonalInfo(email, username, fullName, phone, password, Optional.empty()),
            IdentificationInfo.empty(),
            ProfessionalInfo.empty(),
            profile,
            UserRole.ENDUSER,
            AccountStatus.DESATIVADA
        );
    }
} 