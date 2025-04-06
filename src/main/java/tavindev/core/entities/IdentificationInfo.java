package tavindev.core.entities;

import java.util.Optional;

public record IdentificationInfo(
    Optional<String> citizenCard,
    Optional<String> taxId,
    Optional<String> address
) {
    public static IdentificationInfo empty() {
        return new IdentificationInfo(Optional.empty(), Optional.empty(), Optional.empty());
    }
}
