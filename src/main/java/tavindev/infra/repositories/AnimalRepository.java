package tavindev.infra.repositories;

import com.google.cloud.datastore.*;
import com.google.cloud.Timestamp;
import tavindev.core.entities.Animal;

import org.jvnet.hk2.annotations.Service;

import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;

@Service
public class AnimalRepository {
  private static final String ANIMAL_KIND = "Animal";
  private final Datastore datastore = DatastoreManager.getInstance();

  public Animal save(Animal animal) {
    KeyFactory keyFactory = datastore.newKeyFactory().setKind(ANIMAL_KIND);
    Key animalKey = keyFactory.newKey(animal.getId());

    Entity.Builder entityBuilder = Entity.newBuilder(animalKey);

    entityBuilder.set("name", animal.getName());
    entityBuilder.set("description", animal.getDescription());
    if (animal.getImage() != null) {
      entityBuilder.set("image", animal.getImage());
    }
    entityBuilder.set("latitude", animal.getLatitude());
    entityBuilder.set("longitude", animal.getLongitude());
    entityBuilder.set("createdAt",
        Timestamp.of(java.util.Date.from(animal.getCreatedAt().atZone(ZoneOffset.UTC).toInstant())));
    if (animal.getUserId() != null) {
      entityBuilder.set("userId", animal.getUserId());
    }

    if (animal.getGeohash() != null) {
      entityBuilder.set("geohash", animal.getGeohash());
    }

    Entity animalEntity = entityBuilder.build();
    datastore.put(animalEntity);

    return animal;
  }

  public Animal get(String id) {
    KeyFactory keyFactory = datastore.newKeyFactory().setKind(ANIMAL_KIND);
    Key animalKey = keyFactory.newKey(id);
    Entity animalEntity = datastore.get(animalKey);

    if (animalEntity == null) {
      return null;
    }

    String name = animalEntity.getString("name");
    String description = animalEntity.getString("description");
    String image = animalEntity.contains("image") ? animalEntity.getString("image") : null;
    Double latitude = animalEntity.getDouble("latitude");
    Double longitude = animalEntity.getDouble("longitude");
    String geohash = animalEntity.contains("geohash") ? animalEntity.getString("geohash") : null;
    String userId = animalEntity.getString("userId");
    Timestamp createdAt = animalEntity.getTimestamp("createdAt");

    return new Animal(id, name, description, image, latitude, longitude, geohash,
        createdAt.toDate().toInstant().atZone(ZoneOffset.UTC).toLocalDateTime(), userId);
  }

  public List<Animal> findByGeohash(String geohash) {
    // For geohash prefix matching (contains), use range query
    // This finds all geohashes that start with the given prefix
    Query<Entity> query = Query.newEntityQueryBuilder()
        .setKind(ANIMAL_KIND)
        .setFilter(StructuredQuery.CompositeFilter.and(
            StructuredQuery.PropertyFilter.ge("geohash", geohash),
            StructuredQuery.PropertyFilter.lt("geohash", geohash + "\uffff")))
        .build();

    QueryResults<Entity> results = datastore.run(query);
    List<Animal> animals = new ArrayList<>();

    while (results.hasNext()) {
      Entity animalEntity = results.next();

      String id = animalEntity.getKey().getName();
      String name = animalEntity.getString("name");
      String description = animalEntity.getString("description");
      String image = animalEntity.contains("image") ? animalEntity.getString("image") : null;
      Double latitude = animalEntity.getDouble("latitude");
      Double longitude = animalEntity.getDouble("longitude");
      String storedGeohash = animalEntity.contains("geohash") ? animalEntity.getString("geohash") : null;
      String userId = animalEntity.getString("userId");
      Timestamp createdAt = animalEntity.getTimestamp("createdAt");

      Animal animal = new Animal(id, name, description, image, latitude, longitude, storedGeohash,
          createdAt.toDate().toInstant().atZone(ZoneOffset.UTC).toLocalDateTime(), userId);

      animals.add(animal);
    }

    return animals;
  }

  public List<Animal> findByLocation(Double lat, Double lng, Double radiusKm) {
    // Get all animals (for now, we'll filter by distance in memory)
    // In a production system, you'd want to use geospatial queries
    Query<Entity> query = Query.newEntityQueryBuilder()
        .setKind(ANIMAL_KIND)
        .build();

    QueryResults<Entity> results = datastore.run(query);
    List<Animal> animals = new ArrayList<>();

    while (results.hasNext()) {
      Entity animalEntity = results.next();

      String id = animalEntity.getKey().getName();
      String name = animalEntity.getString("name");
      String description = animalEntity.getString("description");
      String image = animalEntity.contains("image") ? animalEntity.getString("image") : null;
      Double latitude = animalEntity.getDouble("latitude");
      Double longitude = animalEntity.getDouble("longitude");
      String geohash = animalEntity.contains("geohash") ? animalEntity.getString("geohash") : null;
      String userId = animalEntity.getString("userId");
      Timestamp createdAt = animalEntity.getTimestamp("createdAt");

      Animal animal = new Animal(id, name, description, image, latitude, longitude, geohash,
          createdAt.toDate().toInstant().atZone(ZoneOffset.UTC).toLocalDateTime(), userId);

      animals.add(animal);
    }

    return animals;
  }

  public List<Animal> getAll() {
    Query<Entity> query = Query.newEntityQueryBuilder()
        .setKind(ANIMAL_KIND)
        .build();

    QueryResults<Entity> results = datastore.run(query);
    List<Animal> animals = new ArrayList<>();

    while (results.hasNext()) {
      Entity animalEntity = results.next();

      String id = animalEntity.getKey().getName();
      String name = animalEntity.getString("name");
      String description = animalEntity.getString("description");
      String image = animalEntity.contains("image") ? animalEntity.getString("image") : null;
      Double latitude = animalEntity.getDouble("latitude");
      Double longitude = animalEntity.getDouble("longitude");
      String geohash = animalEntity.contains("geohash") ? animalEntity.getString("geohash") : null;
      String userId = animalEntity.getString("userId");
      Timestamp createdAt = animalEntity.getTimestamp("createdAt");

      Animal animal = new Animal(id, name, description, image, latitude, longitude, geohash,
          createdAt.toDate().toInstant().atZone(ZoneOffset.UTC).toLocalDateTime(), userId);

      animals.add(animal);
    }

    return animals;
  }
}
