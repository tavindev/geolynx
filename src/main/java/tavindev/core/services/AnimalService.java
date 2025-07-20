package tavindev.core.services;

import java.util.List;

import jakarta.inject.Inject;
import tavindev.core.entities.Animal;
import tavindev.core.entities.User;
import tavindev.core.utils.AuthUtils;
import tavindev.infra.repositories.AnimalRepository;

import org.jvnet.hk2.annotations.Service;

@Service
public class AnimalService {
  @Inject
  private AnimalRepository animalRepository;

  @Inject
  private GeoHashService geoHashService;

  @Inject
  private AuthUtils authUtils;

  public List<Animal> findByGeohash(String geohash) {
    return animalRepository.findByGeohash(geohash);
  }

  public List<Animal> getAll() {
    return animalRepository.getAll();
  }

  public void create(Animal animal, String sessionId) {
    User user = authUtils.validateAndGetUser(sessionId);
    animal.setUserId(user.getId());

    String geohash = geoHashService.calculateGeohash(animal.getLatitude(), animal.getLongitude());
    animal.setGeohash(geohash);
    animalRepository.save(animal);
  }
}
