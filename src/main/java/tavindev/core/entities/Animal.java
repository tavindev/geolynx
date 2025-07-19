package tavindev.core.entities;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

public class Animal {
  private String id;
  private String name;
  private String description;
  private String image;
  private String createdAt;

  @JsonCreator
  public Animal(
      @JsonProperty("id") String id,
      @JsonProperty("name") String name,
      @JsonProperty("description") String description,
      @JsonProperty("image") String image,
      @JsonProperty("createdAt") String createdAt) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.image = image;
    this.createdAt = createdAt;
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

  public String getCreatedAt() {
    return createdAt;
  }
}
