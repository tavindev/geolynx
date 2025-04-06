package tavindev.core.entities;

import java.util.Optional;

public record ProfessionalInfo(
    Optional<String> employer,
    Optional<String> jobTitle,
    Optional<String> employerTaxId
) {
    public static ProfessionalInfo empty() {
        return new ProfessionalInfo(Optional.empty(), Optional.empty(), Optional.empty());
    }
}