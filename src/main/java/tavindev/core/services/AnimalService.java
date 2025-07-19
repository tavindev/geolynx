package tavindev.core.services;

import java.util.List;

import jakarta.inject.Inject;
import tavindev.core.entities.Animal;
import tavindev.infra.repositories.AnimalRepository;
import ch.hsr.geohash.GeoHash;

import org.jvnet.hk2.annotations.Service;

@Service
public class AnimalService {
  @Inject
  private AnimalRepository animalRepository;

  public List<Animal> findByGeohash(String geohash) {
    return animalRepository.findByGeohash(geohash);
  }

  public void create(Animal animal) {
    GeoHash geoHash = GeoHash.withCharacterPrecision(animal.getLatitude(), animal.getLongitude(), 6);
    animal.setGeohash(geoHash.toBase32());
    animalRepository.save(animal);
  }
}
