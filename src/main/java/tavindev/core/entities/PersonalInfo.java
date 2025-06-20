package tavindev.core.entities;

import java.time.LocalDate;
import java.util.Optional;

public record PersonalInfo(
        String email,
        String username,
        String fullName,
        String phone,
        String password,
        String nationality,
        String residence,
        String address,
        String postalCode,
        LocalDate birthDate) {
}