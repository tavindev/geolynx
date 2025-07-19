package tavindev.core.services;

import java.util.List;

import tavindev.core.entities.HistoricalCuriosity;
import tavindev.infra.repositories.HistoricalCuriosityRepository;
import ch.hsr.geohash.GeoHash;

import org.jvnet.hk2.annotations.Service;

import jakarta.inject.Inject;

@Service
public class HistoricalCuriosityService {
	@Inject
	private HistoricalCuriosityRepository historicalCuriosityRepository;

	public void create(HistoricalCuriosity historicalCuriosity) {
		double lat = historicalCuriosity.getLatitude();
		double lon = historicalCuriosity.getLongitude();
		GeoHash geoHash = GeoHash.withCharacterPrecision(lat, lon, 6);
		historicalCuriosity.setGeohash(geoHash.toBase32());

		historicalCuriosityRepository.save(historicalCuriosity);
	}

	public List<HistoricalCuriosity> findByGeohash(String geohash) {
		return historicalCuriosityRepository.findByGeohash(geohash);
	}

}
