package tavindev.core.entities;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDateTime;
import java.util.UUID;

@JsonIgnoreProperties(ignoreUnknown = true)
public class HistoricalCuriosity {
	private String id;
	private String title;
	private String description;
	private Double latitude;
	private Double longitude;
	private LocalDateTime createdAt;
	private String geohash;
	private String userId;

	@JsonCreator
	public HistoricalCuriosity(
			@JsonProperty("title") String title,
			@JsonProperty("description") String description,
			@JsonProperty("lat") Double latitude,
			@JsonProperty("long") Double longitude) {
		this.id = UUID.randomUUID().toString();
		this.title = title;
		this.description = description;
		this.latitude = latitude;
		this.longitude = longitude;
		this.createdAt = LocalDateTime.now();
	}

	public HistoricalCuriosity(String id, String title, String description, Double latitude, Double longitude,
			String geohash,
			LocalDateTime createdAt, String userId) {
		this.id = id;
		this.title = title;
		this.description = description;
		this.latitude = latitude;
		this.longitude = longitude;
		this.createdAt = createdAt;
		this.geohash = geohash;
		this.userId = userId;
	}

	public void setGeohash(String geohash) {
		this.geohash = geohash;
	}

	public String getId() {
		return id;
	}

	public String getTitle() {
		return title;
	}

	public String getDescription() {
		return description;
	}

	public Double getLatitude() {
		return latitude;
	}

	public Double getLongitude() {
		return longitude;
	}

	public String getGeohash() {
		return geohash;
	}

	public String getCreatedAt() {
		return createdAt.toString();
	}

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

}
