package tavindev.core.entities;

import java.util.Optional;

public record IdentificationInfo(
    String citizenCard,
    String taxId,
    String address
) { }
