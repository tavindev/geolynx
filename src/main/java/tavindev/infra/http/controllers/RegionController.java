package tavindev.infra.http.controllers;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.MediaType;
import jakarta.inject.Inject;
import tavindev.core.entities.Animal;
import tavindev.core.entities.HistoricalCuriosity;
import tavindev.core.services.AnimalService;
import tavindev.core.services.HistoricalCuriosityService;

import org.jvnet.hk2.annotations.Service;

@Service
@Path("/region")
@Produces(MediaType.APPLICATION_JSON)
public class RegionController {
  @Inject
  private AnimalService animalService;

  @Inject
  private HistoricalCuriosityService historicalCuriosityService;

  @GET
  @Path("/")
  public Response getRegionData(@QueryParam("geohash") String geohash) {
    if (geohash == null || geohash.isEmpty()) {
      return Response.status(Response.Status.BAD_REQUEST)
          .entity("Geohash parameter is required")
          .build();
    }

    List<Animal> animals = animalService.findByGeohash(geohash);
    List<HistoricalCuriosity> historicalCuriosities = historicalCuriosityService.findByGeohash(geohash);

    Map<String, Object> regionData = new HashMap<>();
    regionData.put("geohash", geohash);
    regionData.put("animals", animals);
    regionData.put("historicalCuriosities", historicalCuriosities);

    return Response.ok(regionData).build();
  }
}