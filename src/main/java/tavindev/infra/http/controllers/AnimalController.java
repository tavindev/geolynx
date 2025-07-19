package tavindev.infra.http.controllers;

import java.util.List;

import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.MediaType;
import jakarta.inject.Inject;
import tavindev.core.entities.Animal;
import tavindev.core.services.AnimalService;

import org.jvnet.hk2.annotations.Service;

@Service
@Path("/animal")
@Produces(MediaType.APPLICATION_JSON)
public class AnimalController {
  @Inject
  private AnimalService animalService;

  @POST
  @Path("/")
  @Consumes(MediaType.APPLICATION_JSON)
  public Response createAnimal(Animal animal) {
    animalService.create(animal);

    return Response.ok().build();
  }

  @GET
  @Path("/nearby")
  public Response getAnimal(@QueryParam("geohash") String geohash) {
    List<Animal> animals = animalService.getNearby(geohash);

    return Response.ok(animals).build();
  }
}
