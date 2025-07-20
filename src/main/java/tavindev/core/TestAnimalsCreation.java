package tavindev.core;

import tavindev.core.entities.Animal;
import tavindev.core.services.GeoHashService;
import tavindev.infra.repositories.AnimalRepository;
import jakarta.servlet.ServletContextEvent;
import jakarta.servlet.ServletContextListener;
import jakarta.servlet.annotation.WebListener;
import org.jvnet.hk2.annotations.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Service
@WebListener
public class TestAnimalsCreation implements ServletContextListener {

  private final AnimalRepository animalRepository;
  private final GeoHashService geoHashService;

  public TestAnimalsCreation() {
    this.animalRepository = new AnimalRepository();
    this.geoHashService = new GeoHashService();
  }

  @Override
  public void contextInitialized(ServletContextEvent sce) {
    // createTestAnimalsForMacao();
  }

  @Override
  public void contextDestroyed(ServletContextEvent sce) {
    // Cleanup if needed
  }

  public void createTestAnimalsForMacao() {
    List<Animal> testAnimals = generateMacaoTestAnimals();

    for (Animal animal : testAnimals) {
      // Geohash
      String geohash = geoHashService.calculateGeohash(animal.getLatitude(), animal.getLongitude());
      animal.setGeohash(geohash);

      animalRepository.save(animal);
    }
  }

  private List<Animal> generateMacaoTestAnimals() {
    List<Animal> animals = new ArrayList<>();
    Random random = new Random();

    // Mação region coordinates (WGS84)
    // Center approximately: 39.5542° N, 8.0144° W
    double centerLat = 39.5542;
    double centerLon = -8.0144;
    double range = 0.2;

    // Cattle/Bovines - Common in Portuguese agriculture
    String[] cattleNames = { "Vaca Mirandesa", "Touro Alentejano", "Vaca Barrosã", "Novilho", "Vitela" };
    String[] cattleDescriptions = {
        "Vaca leiteira da raça Mirandesa, resistente e adaptada ao clima português",
        "Touro reprodutor da raça Alentejana, conhecido pela sua robustez",
        "Vaca de carne da raça Barrosã, típica do norte de Portugal",
        "Novilho jovem em fase de engorda",
        "Vitela de aproximadamente 8 meses"
    };

    for (int i = 0; i < 8; i++) {
      double lat = centerLat + (random.nextGaussian() * range);
      double lon = centerLon + (random.nextGaussian() * range);

      animals.add(new Animal(
          cattleNames[i % cattleNames.length],
          cattleDescriptions[i % cattleDescriptions.length],
          "cattle_" + (i + 1) + ".jpg",
          lat,
          lon));
    }

    // Sheep - Very common in central Portugal
    String[] sheepNames = { "Ovelha Churra", "Carneiro Merino", "Borrego", "Ovelha Serra da Estrela" };
    String[] sheepDescriptions = {
        "Ovelha da raça Churra Galega Mirandesa, resistente e produtiva",
        "Carneiro da raça Merino Branco, conhecido pela qualidade da lã",
        "Borrego jovem em crescimento",
        "Ovelha adaptada às condições montanhosas da Serra da Estrela"
    };

    for (int i = 0; i < 6; i++) {
      double lat = centerLat + (random.nextGaussian() * range);
      double lon = centerLon + (random.nextGaussian() * range);

      animals.add(new Animal(
          sheepNames[i % sheepNames.length],
          sheepDescriptions[i % sheepDescriptions.length],
          "sheep_" + (i + 1) + ".jpg",
          lat,
          lon));
    }

    // Goats - Common in Portuguese hills
    String[] goatNames = { "Cabra Serrana", "Bode Reprodutor", "Cabrito", "Cabra Algarvia" };
    String[] goatDescriptions = {
        "Cabra da raça Serrana, adaptada ao terreno montanhoso",
        "Bode reprodutor de alta qualidade genética",
        "Cabrito jovem, ideal para carne",
        "Cabra da raça Algarvia, conhecida pela produção de leite"
    };

    for (int i = 0; i < 5; i++) {
      double lat = centerLat + (random.nextGaussian() * range);
      double lon = centerLon + (random.nextGaussian() * range);

      animals.add(new Animal(
          goatNames[i % goatNames.length],
          goatDescriptions[i % goatDescriptions.length],
          "goat_" + (i + 1) + ".jpg",
          lat,
          lon));
    }

    // Pigs - Traditional Portuguese breeds
    String[] pigNames = { "Porco Alentejano", "Porco Bísaro", "Leitão", "Porca Reprodutora" };
    String[] pigDescriptions = {
        "Porco da raça Alentejana, criado em montado de sobreiros",
        "Porco da raça Bísara, típico do norte de Portugal",
        "Leitão jovem em fase de crescimento",
        "Porca reprodutora de excelente linhagem"
    };

    for (int i = 0; i < 4; i++) {
      double lat = centerLat + (random.nextGaussian() * range);
      double lon = centerLon + (random.nextGaussian() * range);

      animals.add(new Animal(
          pigNames[i % pigNames.length],
          pigDescriptions[i % pigDescriptions.length],
          "pig_" + (i + 1) + ".jpg",
          lat,
          lon));
    }

    // Horses - Used for work and recreation
    String[] horseNames = { "Cavalo Lusitano", "Égua Garrana", "Poldro", "Cavalo de Trabalho" };
    String[] horseDescriptions = {
        "Cavalo da raça Lusitana, símbolo da equitação portuguesa",
        "Égua da raça Garrana, típica das montanhas do norte",
        "Poldro jovem em treino",
        "Cavalo usado para trabalhos agrícolas tradicionais"
    };

    for (int i = 0; i < 3; i++) {
      double lat = centerLat + (random.nextGaussian() * range);
      double lon = centerLon + (random.nextGaussian() * range);

      animals.add(new Animal(
          horseNames[i % horseNames.length],
          horseDescriptions[i % horseDescriptions.length],
          "horse_" + (i + 1) + ".jpg",
          lat,
          lon));
    }

    return animals;
  }
}
