package tavindev.infra.repositories;

import com.google.cloud.datastore.*;
import org.jvnet.hk2.annotations.Service;
import tavindev.core.entities.Corporation;

import java.util.ArrayList;
import java.util.List;

@Service
public class CoporationRepository {
  private static final String CORPORATION_KIND = "Corporation";

  // Property name constants
  private static final String PROPERTY_NAME = "name";
  private static final String PROPERTY_DESCRIPTION = "description";
  private static final String PROPERTY_ADDRESS = "address";
  private static final String PROPERTY_NIF = "nif";
  private static final String PROPERTY_EMAIL = "email";
  private static final String PROPERTY_PHONE = "phone";
  private static final String PROPERTY_PUBLIC_URL = "publicURL";

  private final Datastore datastore = DatastoreManager.getInstance();

  public void save(Corporation corporation) {
    KeyFactory keyFactory = datastore.newKeyFactory().setKind(CORPORATION_KIND);
    Key corporationKey = keyFactory.newKey(corporation.getId());

    Entity.Builder corporationEntityBuilder = Entity.newBuilder(corporationKey)
        .set(PROPERTY_NAME, corporation.getName())
        .set(PROPERTY_DESCRIPTION, corporation.getDescription())
        .set(PROPERTY_ADDRESS, corporation.getAddress())
        .set(PROPERTY_NIF, corporation.getNif())
        .set(PROPERTY_EMAIL, corporation.getEmail())
        .set(PROPERTY_PHONE, corporation.getPhone())
        .set(PROPERTY_PUBLIC_URL, corporation.getPublicURL());

    datastore.put(corporationEntityBuilder.build());
  }

  public void delete(Corporation corporation) {
    KeyFactory keyFactory = datastore.newKeyFactory().setKind(CORPORATION_KIND);
    Key corporationKey = keyFactory.newKey(corporation.getId());

    datastore.delete(corporationKey);
  }

  public Corporation findById(String id) {
    KeyFactory keyFactory = datastore.newKeyFactory().setKind(CORPORATION_KIND);
    Key corporationKey = keyFactory.newKey(id);
    Entity corporationEntity = datastore.get(corporationKey);

    return corporationEntity != null ? convertToCorporation(corporationEntity) : null;
  }

  public Corporation findByNif(String nif) {
    return findByProperty(PROPERTY_NIF, nif);
  }

  public Corporation findByEmail(String email) {
    return findByProperty(PROPERTY_EMAIL, email);
  }

  private Corporation findByProperty(String property, String value) {
    Query<Entity> query = Query.newEntityQueryBuilder()
        .setKind(CORPORATION_KIND)
        .setFilter(StructuredQuery.PropertyFilter.eq(property, value))
        .build();

    QueryResults<Entity> results = datastore.run(query);
    if (results.hasNext()) {
      Entity entity = results.next();
      return convertToCorporation(entity);
    }
    return null;
  }

  public List<Corporation> findAllCorporations() {
    Query<Entity> query = Query.newEntityQueryBuilder()
        .setKind(CORPORATION_KIND)
        .build();

    List<Corporation> corporations = new ArrayList<>();
    QueryResults<Entity> results = datastore.run(query);
    while (results.hasNext()) {
      corporations.add(convertToCorporation(results.next()));
    }
    return corporations;
  }

  public List<Corporation> findByName(String name) {
    Query<Entity> query = Query.newEntityQueryBuilder()
        .setKind(CORPORATION_KIND)
        .setFilter(StructuredQuery.PropertyFilter.eq(PROPERTY_NAME, name))
        .build();

    List<Corporation> corporations = new ArrayList<>();
    QueryResults<Entity> results = datastore.run(query);
    while (results.hasNext()) {
      corporations.add(convertToCorporation(results.next()));
    }
    return corporations;
  }

  private Corporation convertToCorporation(Entity entity) {
    return new Corporation(
        entity.getKey().getName(),
        entity.getString(PROPERTY_NAME),
        entity.getString(PROPERTY_DESCRIPTION),
        entity.getString(PROPERTY_ADDRESS),
        entity.getString(PROPERTY_NIF),
        entity.getString(PROPERTY_EMAIL),
        entity.getString(PROPERTY_PHONE),
        entity.getString(PROPERTY_PUBLIC_URL));
  }
}
