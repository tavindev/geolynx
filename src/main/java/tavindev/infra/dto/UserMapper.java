package tavindev.infra.dto;

import tavindev.core.entities.User;
import java.util.Optional;

public class UserMapper {
    public static UserDTO toDTO(User user) {
        return new UserDTO(
            user.getUsername(),
            user.getEmail(),
            user.getPersonalInfo().fullName(),
            user.getPersonalInfo().phone(),
            user.getAccountStatus().name(),
            user.getProfile().name(),
            user.getRole().name(),
            user.getIdentificationInfo().address(),
            user.getIdentificationInfo().taxId(),
            user.getProfessionalInfo().employer(),
            user.getProfessionalInfo().jobTitle(),
            user.getProfessionalInfo().employerTaxId(),
            user.getPersonalInfo().photo()
        );
    }
} 