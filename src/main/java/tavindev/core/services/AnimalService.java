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
  private GeoHashService geoHashService;

  public List<Animal> findByGeohash(String geohash) {
    return animalRepository.findByGeohash(geohash);
  }

  public List<Animal> getAll() {
    return animalRepository.getAll();
  }

  public void create(Animal animal) {
    String geohash = geoHashService.calculateGeohash(animal.getLatitude(), animal.getLongitude());
    animal.setGeohash(geohash);
    animalRepository.save(animal);
  }
}
