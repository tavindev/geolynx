package tavindev.infra.dto;

public record UserInfoDTO(String id, String role, String fullName, String email, String phonePrimary,
		String phoneSecondary, String address,
		String postalCode, String dateOfBirth, String nationality, String residence) {
}