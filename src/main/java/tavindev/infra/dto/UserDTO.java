package tavindev.infra.dto;

import java.time.LocalDate;

public record UserDTO(
                String username,
                String email,
                String fullName,
                String phone,
                String accountStatus,
                String profile,
                String role,
                String nationality,
                String residence,
                String address,
                String postalCode,
                LocalDate birthDate,
                String citizenCard,
                String taxId,
                String employer,
                String jobTitle,
                String employerTaxId) {
}