package tavindev.infra.repositories;

import com.google.cloud.datastore.*;
import com.google.cloud.Timestamp;
import org.jvnet.hk2.annotations.Service;
import tavindev.core.entities.HistoricalCuriosity;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;

@Service
public class HistoricalCuriosityRepository {
	private static final String HISTORICAL_CURIOSITY_KIND = "HistoricalCuriosity";
	private final Datastore datastore = DatastoreManager.getInstance();

	public HistoricalCuriosity get(String id) {
		KeyFactory keyFactory = datastore.newKeyFactory().setKind(HISTORICAL_CURIOSITY_KIND);
		Key curiosityKey = keyFactory.newKey(id);
		Entity curiosityEntity = datastore.get(curiosityKey);

		if (curiosityEntity == null) {
			return null;
		}

		String title = curiosityEntity.contains("title") ? curiosityEntity.getString("title") : null;
		String description = curiosityEntity.getString("description");
		Double latitude = curiosityEntity.getDouble("latitude");
		Double longitude = curiosityEntity.getDouble("longitude");
		String geohash = curiosityEntity.contains("geohash") ? curiosityEntity.getString("geohash") : null;
		String userId = curiosityEntity.contains("userId") ? curiosityEntity.getString("userId") : null;
		String createdAt = curiosityEntity.getString("createdAt");

		HistoricalCuriosity curiosity = new HistoricalCuriosity(id, title, description, latitude, longitude, geohash,
				LocalDateTime.parse(createdAt), userId);
		return curiosity;
	}

	public HistoricalCuriosity save(HistoricalCuriosity curiosity) {
		KeyFactory keyFactory = datastore.newKeyFactory().setKind(HISTORICAL_CURIOSITY_KIND);
		Key curiosityKey = keyFactory.newKey(curiosity.getId());

		Entity.Builder entityBuilder = Entity.newBuilder(curiosityKey);

		if (curiosity.getTitle() != null) {
			entityBuilder.set("title", curiosity.getTitle());
		}
		entityBuilder.set("description", curiosity.getDescription());
		entityBuilder.set("latitude", curiosity.getLatitude());
		entityBuilder.set("longitude", curiosity.getLongitude());
		entityBuilder.set("createdAt", curiosity.getCreatedAt());

		if (curiosity.getGeohash() != null) {
			entityBuilder.set("geohash", curiosity.getGeohash());
		}

		if (curiosity.getUserId() != null) {
			entityBuilder.set("userId", curiosity.getUserId());
		}

		Entity curiosityEntity = entityBuilder.build();
		datastore.put(curiosityEntity);

		return curiosity;
	}

	public void remove(HistoricalCuriosity curiosity) {
		KeyFactory keyFactory = datastore.newKeyFactory().setKind(HISTORICAL_CURIOSITY_KIND);
		Key curiosityKey = keyFactory.newKey(curiosity.getId());

		datastore.delete(curiosityKey);
	}

	public boolean exists(String id) {
		KeyFactory keyFactory = datastore.newKeyFactory().setKind(HISTORICAL_CURIOSITY_KIND);
		Key curiosityKey = keyFactory.newKey(id);
		Entity curiosityEntity = datastore.get(curiosityKey);

		return curiosityEntity != null;
	}

	public List<HistoricalCuriosity> getAll() {
		Query<Entity> query = Query.newEntityQueryBuilder()
				.setKind(HISTORICAL_CURIOSITY_KIND)
				.build();

		QueryResults<Entity> results = datastore.run(query);
		List<HistoricalCuriosity> curiosities = new ArrayList<>();

		while (results.hasNext()) {
			Entity curiosityEntity = results.next();

			String id = curiosityEntity.getKey().getName();
			String title = curiosityEntity.contains("title") ? curiosityEntity.getString("title") : null;
			String description = curiosityEntity.getString("description");
			Double latitude = curiosityEntity.getDouble("latitude");
			Double longitude = curiosityEntity.getDouble("longitude");
			String createdAt = curiosityEntity.getString("createdAt");
			String geohash = curiosityEntity.contains("geohash") ? curiosityEntity.getString("geohash") : null;
			String userId = curiosityEntity.contains("userId") ? curiosityEntity.getString("userId") : null;

			HistoricalCuriosity curiosity = new HistoricalCuriosity(id, title, description, latitude, longitude, geohash,
					LocalDateTime.parse(createdAt), userId);

			curiosities.add(curiosity);
		}

		return curiosities;
	}

	public List<HistoricalCuriosity> findByGeohash(String geohash) {
		Query<Entity> query = Query.newEntityQueryBuilder()
				.setKind(HISTORICAL_CURIOSITY_KIND)
				.setFilter(StructuredQuery.PropertyFilter.eq("geohash", geohash))
				.build();

		QueryResults<Entity> results = datastore.run(query);
		List<HistoricalCuriosity> curiosities = new ArrayList<>();

		while (results.hasNext()) {
			Entity curiosityEntity = results.next();

			String id = curiosityEntity.getKey().getName();
			String title = curiosityEntity.contains("title") ? curiosityEntity.getString("title") : null;
			String description = curiosityEntity.getString("description");
			Double latitude = curiosityEntity.getDouble("latitude");
			Double longitude = curiosityEntity.getDouble("longitude");
			String storedGeohash = curiosityEntity.contains("geohash") ? curiosityEntity.getString("geohash") : null;
			String userId = curiosityEntity.contains("userId") ? curiosityEntity.getString("userId") : null;
			String createdAt = curiosityEntity.getString("createdAt");

			HistoricalCuriosity curiosity = new HistoricalCuriosity(id, title, description, latitude, longitude,
					storedGeohash, LocalDateTime.parse(createdAt), userId);

			curiosities.add(curiosity);
		}

		return curiosities;
	}

	public List<HistoricalCuriosity> findByLocation(Double lat, Double lng, Double radiusKm) {
		// Get all historical curiosities (for now, we'll filter by distance in memory)
		// In a production system, you'd want to use geospatial queries
		Query<Entity> query = Query.newEntityQueryBuilder()
				.setKind(HISTORICAL_CURIOSITY_KIND)
				.build();

		QueryResults<Entity> results = datastore.run(query);
		List<HistoricalCuriosity> curiosities = new ArrayList<>();

		while (results.hasNext()) {
			Entity curiosityEntity = results.next();

			String id = curiosityEntity.getKey().getName();
			String title = curiosityEntity.contains("title") ? curiosityEntity.getString("title") : null;
			String description = curiosityEntity.getString("description");
			Double latitude = curiosityEntity.getDouble("latitude");
			Double longitude = curiosityEntity.getDouble("longitude");
			String geohash = curiosityEntity.contains("geohash") ? curiosityEntity.getString("geohash") : null;
			String userId = curiosityEntity.contains("userId") ? curiosityEntity.getString("userId") : null;
			String createdAt = curiosityEntity.getString("createdAt");

			HistoricalCuriosity curiosity = new HistoricalCuriosity(id, title, description, latitude, longitude, geohash,
					LocalDateTime.parse(createdAt), userId);

			curiosities.add(curiosity);
		}

		return curiosities;
	}
}
