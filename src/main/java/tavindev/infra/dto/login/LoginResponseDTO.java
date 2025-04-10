
package tavindev.infra.dto.login;

import tavindev.core.entities.AuthToken;

public record LoginResponseDTO(
    TokenDTO token
) {
    public record TokenDTO(
        String user,
        String role,
        ValidityDTO validity
    ) {}

    public record ValidityDTO(
        long valid_from,
        long valid_to,
        String verificador
    ) {}

    public static LoginResponseDTO fromAuthToken(AuthToken token) {
        return new LoginResponseDTO(
            new TokenDTO(
                token.getUsername(),
                token.getUserRole().toString(),
                new ValidityDTO(
                        token.getCreationData(),
                        token.getExpirationData(),
                        token.getTokenId()
                )
            )
        );
    }
} 