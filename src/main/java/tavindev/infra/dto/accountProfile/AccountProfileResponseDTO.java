package tavindev.infra.dto.accountProfile;

import tavindev.infra.dto.accountStatus.AccountStatusResponseDTO;

public record AccountProfileResponseDTO (
    String message,
    String identificador,
    String status) {
        public static AccountProfileResponseDTO success(String identificador, String profile) {
            return new AccountProfileResponseDTO(
                    "Estado da conta consultado com sucesso",
                    identificador,
                    profile);
        }


        public static AccountProfileResponseDTO error(String message) {
            return new AccountProfileResponseDTO(message, null, null);
        }
}
