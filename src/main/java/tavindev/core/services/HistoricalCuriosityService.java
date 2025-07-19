package tavindev.core.services;

import java.util.List;

import tavindev.core.entities.HistoricalCuriosity;
import tavindev.infra.repositories.HistoricalCuriosityRepository;

import org.jvnet.hk2.annotations.Service;

import jakarta.inject.Inject;

@Service
public class HistoricalCuriosityService {
	@Inject
	private HistoricalCuriosityRepository historicalCuriosityRepository;

	@Inject
	private GeoHashService geoHashService;

	public void create(HistoricalCuriosity historicalCuriosity) {
		String geohash = geoHashService.calculateGeohash(historicalCuriosity.getLatitude(),
				historicalCuriosity.getLongitude());
		historicalCuriosity.setGeohash(geohash);

		historicalCuriosityRepository.save(historicalCuriosity);
	}

	public List<HistoricalCuriosity> findByGeohash(String geohash) {
		return historicalCuriosityRepository.findByGeohash(geohash);
	}

}
