package tavindev.core.entities;

import java.util.Optional;

public record ProfessionalInfo(
    String employer,
    String jobTitle,
    String employerTaxId
) { }