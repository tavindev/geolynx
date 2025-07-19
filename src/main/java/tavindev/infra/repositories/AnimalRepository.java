package tavindev.infra.repositories;

import com.google.cloud.datastore.Datastore;
import com.google.cloud.datastore.DatastoreOptions;
import com.google.cloud.datastore.KeyFactory;
import com.google.cloud.datastore.Key;
import com.google.cloud.datastore.Entity;
import tavindev.core.entities.Animal;

import org.jvnet.hk2.annotations.Service;

@Service
public class AnimalRepository {
  private static final String ANIMAL_KIND = "Animal";
  private final Datastore datastore = DatastoreOptions.getDefaultInstance().getService();

  public void save(Animal animal) {
    KeyFactory keyFactory = datastore.newKeyFactory().setKind(ANIMAL_KIND);
    Key animalKey = keyFactory.newKey(animal.getId());

    Entity animalEntity = Entity.newBuilder(animalKey)
        .set("name", animal.getName())
        .set("description", animal.getDescription())
        .set("image", animal.getImage())
        .set("createdAt", animal.getCreatedAt())
        .build();

    datastore.put(animalEntity);
  }
}
