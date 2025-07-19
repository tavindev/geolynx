package tavindev.core.entities;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDateTime;
import java.util.UUID;

@JsonIgnoreProperties(ignoreUnknown = true)
public class HistoricalCuriosity {
	private String id;
	private String description;
	private Long latitude;
	private Long longitude;
	private LocalDateTime createdAt;
	private String geohash;

	@JsonCreator
	public HistoricalCuriosity(
			@JsonProperty("description") String description,
			@JsonProperty("lat") Long latitude,
			@JsonProperty("long") Long longitude) {
		this.id = UUID.randomUUID().toString();
		this.description = description;
		this.latitude = latitude;
		this.longitude = longitude;
		this.createdAt = LocalDateTime.now();
	}

	public HistoricalCuriosity(String id, String description, Long latitude, Long longitude, String geohash,
			LocalDateTime createdAt) {
		this.id = id;
		this.description = description;
		this.latitude = latitude;
		this.longitude = longitude;
		this.createdAt = createdAt;
		this.geohash = geohash;
	}

	public void setGeohash(String geohash) {
		this.geohash = geohash;
	}

	public String getId() {
		return id;
	}

	public String getDescription() {
		return description;
	}

	public Long getLatitude() {
		return latitude;
	}

	public Long getLongitude() {
		return longitude;
	}

	public String getGeohash() {
		return geohash;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

}
