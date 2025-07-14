package tavindev.infra.http.controllers;

import java.util.List;

import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.jvnet.hk2.annotations.Service;

import jakarta.inject.Inject;
import tavindev.core.entities.HistoricalCuriosity;
import tavindev.core.services.HistoricalCuriosityService;

@Service
@Path("/historical-curiosities")
@Produces(MediaType.APPLICATION_JSON)
public class HistoricalCuriositiesController {

	@Inject
	private HistoricalCuriosityService historicalCuriosityService;

	@POST
	@Path("/")
	@Consumes(MediaType.APPLICATION_JSON)
	public Response createHistoricalCuriosity(HistoricalCuriosity historicalCuriosity) {
		historicalCuriosityService.create(historicalCuriosity);

		return Response.ok().build();
	}

	@GET
	@Path("/nearby")
	public Response getHistoricalCuriosities(@QueryParam("geohash") String geohash) {
		List<HistoricalCuriosity> historicalCuriosities = historicalCuriosityService.findByGeohash(geohash);

		return Response.ok(historicalCuriosities).build();
	}
}
