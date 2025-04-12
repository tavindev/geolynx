package tavindev.core.entities;

import java.util.UUID;

public class AuthToken {
	public static final long EXPIRATION_TIME = 1000 * 60 * 60 * 2;

	private final String userId;
	private final String username;
	private final UserRole userRole;
	private final TokenData tokenData;

	public record TokenData(String id, long creationData, long expirationData) {}
	
	public AuthToken(String userId, String username, UserRole role) {
		this(userId, username, role, new TokenData(UUID.randomUUID().toString(), System.currentTimeMillis(), System.currentTimeMillis() + EXPIRATION_TIME));
	}

	public AuthToken(String userId, String username, UserRole role, TokenData tokenData) {
		this.userId = userId;
		this.username = username;
		this.userRole = role;
		this.tokenData = tokenData;
	}

	public String getUserId() {
		return userId;
	}

	public boolean isExpired() {
		return System.currentTimeMillis() > tokenData.expirationData;
	}

	public String getUsername() {
		return username;
	}

	public UserRole getUserRole() {
		return userRole;
	}
	
	public String getTokenId() {
		return tokenData.id;
	}

	public long getCreationData() {
		return tokenData.creationData;
	}

	public long getExpirationData() {
		return tokenData.expirationData;
	}
}
