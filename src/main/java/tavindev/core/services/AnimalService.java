package tavindev.core.services;

import java.util.List;

import jakarta.inject.Inject;
import tavindev.core.entities.Animal;
import tavindev.infra.repositories.AnimalRepository;

import org.jvnet.hk2.annotations.Service;

@Service
public class AnimalService {
  @Inject
  private AnimalRepository animalRepository;

  @Inject
  private GeohashService geohashService;

  public List<Animal> findByGeohash(String geohash) {
    return animalRepository.findByGeohash(geohash);
  }

  public void create(Animal animal) {
    animal.setGeohash(geohashService.encode(animal.getLatitude(), animal.getLongitude()));
    animalRepository.save(animal);
  }
}
