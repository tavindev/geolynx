package tavindev.core.entities;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDateTime;
import java.util.UUID;

@JsonIgnoreProperties(ignoreUnknown = true)
public class Animal {
  private String id;
  private String name;
  private String description;
  private String image;
  private Long latitude;
  private Long longitude;
  private String geohash;
  private LocalDateTime createdAt;
  private String userId;

  @JsonCreator
  public Animal(
      @JsonProperty("name") String name,
      @JsonProperty("description") String description,
      @JsonProperty("image") String image,
      @JsonProperty("lat") Long latitude,
      @JsonProperty("long") Long longitude,
      @JsonProperty("userId") String userId) {
    this.id = UUID.randomUUID().toString();
    this.name = name;
    this.description = description;
    this.image = image;
    this.latitude = latitude;
    this.longitude = longitude;
    this.userId = userId;
    this.createdAt = LocalDateTime.now();
  }

  public Animal(String id, String name, String description, String image, Long latitude, 
      Long longitude, String geohash, LocalDateTime createdAt, String userId) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.image = image;
    this.latitude = latitude;
    this.longitude = longitude;
    this.geohash = geohash;
    this.createdAt = createdAt;
    this.userId = userId;
  }

  public void setGeohash(String geohash) {
    this.geohash = geohash;
  }

  public String getId() {
    return id;
  }

  public String getName() {
    return name;
  }

  public String getDescription() {
    return description;
  }

  public String getImage() {
    return image;
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

  public String getCreatedAt() {
    return createdAt.toString();
  }

  public String getUserId() {
    return userId;
  }
}
