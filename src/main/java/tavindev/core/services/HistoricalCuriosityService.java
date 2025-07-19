package tavindev.core.services;

import java.util.List;

import tavindev.core.entities.HistoricalCuriosity;
import tavindev.core.entities.User;
import tavindev.core.utils.AuthUtils;
import tavindev.infra.repositories.HistoricalCuriosityRepository;

import org.jvnet.hk2.annotations.Service;

import jakarta.inject.Inject;

@Service
public class HistoricalCuriosityService {
	@Inject
	private HistoricalCuriosityRepository historicalCuriosityRepository;

	@Inject
	private GeoHashService geoHashService;

	@Inject
	private AuthUtils authUtils;

	public void create(HistoricalCuriosity historicalCuriosity, String tokenId) {
		User currentUser = authUtils.validateAndGetUser(tokenId);
		String userId = currentUser.getId();

		String geohash = geoHashService.calculateGeohash(historicalCuriosity.getLatitude(),
				historicalCuriosity.getLongitude());
		historicalCuriosity.setGeohash(geohash);
		historicalCuriosity.setUserId(userId);

		historicalCuriosityRepository.save(historicalCuriosity);
	}

	public List<HistoricalCuriosity> findByGeohash(String geohash) {
		return historicalCuriosityRepository.findByGeohash(geohash);
	}

}
