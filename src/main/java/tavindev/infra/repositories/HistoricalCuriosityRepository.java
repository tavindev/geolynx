package tavindev.infra.repositories;

import com.google.cloud.datastore.*;
import com.google.cloud.Timestamp;
import org.jvnet.hk2.annotations.Service;
import tavindev.core.entities.HistoricalCuriosity;

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

		String description = curiosityEntity.getString("description");
		Long latitude = curiosityEntity.getLong("latitude");
		Long longitude = curiosityEntity.getLong("longitude");
		String geohash = curiosityEntity.contains("geohash") ? curiosityEntity.getString("geohash") : null;
		Timestamp createdAt = curiosityEntity.getTimestamp("createdAt");

		HistoricalCuriosity curiosity = new HistoricalCuriosity(id, description, latitude, longitude, geohash,
				createdAt.toDate().toInstant().atZone(ZoneOffset.UTC).toLocalDateTime());
		return curiosity;
	}

	public HistoricalCuriosity save(HistoricalCuriosity curiosity) {
		KeyFactory keyFactory = datastore.newKeyFactory().setKind(HISTORICAL_CURIOSITY_KIND);
		Key curiosityKey = keyFactory.newKey(curiosity.getId());

		Entity.Builder entityBuilder = Entity.newBuilder(curiosityKey);

		entityBuilder.set("description", curiosity.getDescription());
		entityBuilder.set("latitude", curiosity.getLatitude());
		entityBuilder.set("longitude", curiosity.getLongitude());
		entityBuilder.set("createdAt", Timestamp.of(java.sql.Timestamp.valueOf(curiosity.getCreatedAt())));

		if (curiosity.getGeohash() != null) {
			entityBuilder.set("geohash", curiosity.getGeohash());
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
			String description = curiosityEntity.getString("description");
			Long latitude = curiosityEntity.getLong("latitude");
			Long longitude = curiosityEntity.getLong("longitude");
			Timestamp createdAt = curiosityEntity.getTimestamp("createdAt");
			String geohash = curiosityEntity.contains("geohash") ? curiosityEntity.getString("geohash") : null;

			HistoricalCuriosity curiosity = new HistoricalCuriosity(id, description, latitude, longitude, geohash,
					createdAt.toDate().toInstant().atZone(ZoneOffset.UTC).toLocalDateTime());

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
			String description = curiosityEntity.getString("description");
			Long latitude = curiosityEntity.getLong("latitude");
			Long longitude = curiosityEntity.getLong("longitude");
			Timestamp createdAt = curiosityEntity.getTimestamp("createdAt");

			HistoricalCuriosity curiosity = new HistoricalCuriosity(id, description, latitude, longitude, geohash,
					createdAt.toDate().toInstant().atZone(ZoneOffset.UTC).toLocalDateTime());

			curiosities.add(curiosity);
		}

		return curiosities;
	}
}
