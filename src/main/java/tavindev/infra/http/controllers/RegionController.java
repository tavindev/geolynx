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
import tavindev.core.services.GeohashService;

import org.jvnet.hk2.annotations.Service;

@Service
@Path("/region")
@Produces(MediaType.APPLICATION_JSON)
public class RegionController {
  @Inject
  private AnimalService animalService;

  @Inject
  private HistoricalCuriosityService historicalCuriosityService;

  @Inject
  private GeohashService geohashService;

  @GET
  @Path("/")
  public Response getRegionData(@QueryParam("lat") Double lat, @QueryParam("lng") Double lng) {
    if (lat == null || lng == null) {
      return Response.status(Response.Status.BAD_REQUEST)
          .entity("Latitude and longitude parameters are required")
          .build();
    }

    // Calculate geohash from coordinates (using precision 6 for ~5km accuracy)
    String geohash = geohashService.encode(lat, lng, 6);
    
    List<Animal> animals = animalService.findByGeohash(geohash);
    List<HistoricalCuriosity> historicalCuriosities = historicalCuriosityService.findByGeohash(geohash);

    Map<String, Object> regionData = new HashMap<>();
    regionData.put("latitude", lat);
    regionData.put("longitude", lng);
    regionData.put("animals", animals);
    regionData.put("historicalCuriosities", historicalCuriosities);

    return Response.ok(regionData).build();
  }
}