package tavindev.core.services;

import java.util.ArrayList;
import java.util.List;

import jakarta.inject.Inject;
import tavindev.core.entities.Animal;
import tavindev.infra.repositories.AnimalRepository;

import org.jvnet.hk2.annotations.Service;

@Service
public class AnimalService {
  @Inject
  private AnimalRepository animalRepository;

  public List<Animal> getNearby(String geohash) {
    return new ArrayList<>();
  }

  public void create(Animal animal) {
    animalRepository.save(animal);
  }
}
