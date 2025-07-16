package tavindev.infra.dto;

public record UserInfoDTO(String id, String role, String fullName, String email, String phone, String address,
		String postalCode, String birthDate, String nationality, String residence) {
}