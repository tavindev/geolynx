package tavindev.core.entities;

import java.util.Optional;

public record PersonalInfo(
    String email,
    String username,
    String fullName,
    String phone,
    String password,
    Optional<String> photo
) {
    public static PersonalInfo empty() {
        return new PersonalInfo(
            "",
            "",
            "",
            "",
            "",
            Optional.empty()
        );
    }
}