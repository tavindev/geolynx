package tavindev.core.services;

import java.util.List;

import tavindev.core.entities.HistoricalCuriosity;
import tavindev.infra.repositories.HistoricalCuriosityRepository;

import org.jvnet.hk2.annotations.Service;

import jakarta.inject.Inject;

@Service
public class HistoricalCuriosityService {
	@Inject
	private GeohashService geohashService;

	@Inject
	private HistoricalCuriosityRepository historicalCuriosityRepository;

	public void create(HistoricalCuriosity historicalCuriosity) {
		historicalCuriosity
				.setGeohash(geohashService.encode(historicalCuriosity.getLatitude(), historicalCuriosity.getLongitude()));

		historicalCuriosityRepository.save(historicalCuriosity);
	}

	public List<HistoricalCuriosity> findByGeohash(String geohash) {
		return historicalCuriosityRepository.findByGeohash(geohash);
	}
}
