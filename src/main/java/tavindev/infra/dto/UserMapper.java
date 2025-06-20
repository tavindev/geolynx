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
                user.getPersonalInfo().nationality(),
                user.getPersonalInfo().residence(),
                user.getPersonalInfo().address(),
                user.getPersonalInfo().postalCode(),
                user.getPersonalInfo().birthDate(),
                user.getIdentificationInfo() != null ? user.getIdentificationInfo().citizenCard() : null,
                user.getIdentificationInfo() != null ? user.getIdentificationInfo().taxId() : null,
                user.getProfessionalInfo() != null ? user.getProfessionalInfo().employer() : null,
                user.getProfessionalInfo() != null ? user.getProfessionalInfo().jobTitle() : null,
                user.getProfessionalInfo() != null ? user.getProfessionalInfo().employerTaxId() : null);
    }
}