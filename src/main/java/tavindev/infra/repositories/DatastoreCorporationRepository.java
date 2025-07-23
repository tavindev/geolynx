package tavindev.infra.repositories;

import com.google.cloud.Timestamp;
import com.google.cloud.datastore.*;
import tavindev.core.entities.*;

import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;

public class DatastoreCorporationRepository {

    private static final String CORPORATION_KIND = "Corporationn";
    // Property name constants
    private static final String PROPERTY_ID = "id";
    private static final String PROPERTY_NAME = "name";
    private static final String PROPERTY_DESCRIPTION = "description";
    private static final String PROPERTY_ADDRESS = "address";
    private static final String PROPERTY_NIF = "nif";
    private static final String PROPERTY_EMAIL = "email";
    private static final String PROPERTY_PHONE = "phone";
    private static final String PROPERTY_PUBLICURL = "publicURL";

    private final Datastore datastore = DatastoreManager.getInstance();

    public Corporation save(Corporation corporation) {
        KeyFactory keyFactory = datastore.newKeyFactory().setKind(CORPORATION_KIND);
        Key animalKey = keyFactory.newKey(corporation.getId());

        Entity.Builder entityBuilder = Entity.newBuilder(animalKey);

        entityBuilder.set("name", corporation.getName());
        entityBuilder.set("description", corporation.getDescription());
        entityBuilder.set("address", corporation.getAddress());
        entityBuilder.set("nif", corporation.getNif());
        entityBuilder.set("email", corporation.getEmail());
        entityBuilder.set("phone", corporation.getPhone());
        entityBuilder.set("publicURL", corporation.getPublicURL());

        Entity corporationEntity = entityBuilder.build();
        datastore.put(corporationEntity);

        return corporation;
    }

    public Corporation get(String id) {
        KeyFactory keyFactory = datastore.newKeyFactory().setKind(CORPORATION_KIND);
        Key corporationKey = keyFactory.newKey(id);
        Entity corporationEntity = datastore.get(corporationKey);

        if (corporationEntity == null) {
            return null;
        }

        String name = corporationEntity.getString("name");
        String description = corporationEntity.getString("description");
        String address = corporationEntity.getString("address");
        String nif = corporationEntity.getString("nif");
        String email = corporationEntity.getString("email");
        String phone = corporationEntity.getString("phone");
        String publicURL = corporationEntity.getString("publicURL");

        return new Corporation(id, name, address, nif, description, email, phone, publicURL);
    }

    public Corporation findById(String id) {
        KeyFactory keyFactory = datastore.newKeyFactory().setKind(CORPORATION_KIND);
        Key corporationKey = keyFactory.newKey(id);
        Entity corporationEntity = datastore.get(corporationKey);

        return corporationEntity != null ? convertToCorporation(corporationEntity) : null;
    }

    private Corporation convertToCorporation(Entity entity) {
        // Use safe getters for fields that might not exist in existing data
        String name = entity.contains(PROPERTY_NAME) ? entity.getString(PROPERTY_NAME) : null;
        String description = entity.contains(PROPERTY_NAME) ? entity.getString(PROPERTY_NAME) : null;
        String address = entity.contains(PROPERTY_NAME) ? entity.getString(PROPERTY_NAME) : null;
        String nif = entity.contains(PROPERTY_NAME) ? entity.getString(PROPERTY_NAME) : null;
        String email = entity.contains(PROPERTY_NAME) ? entity.getString(PROPERTY_NAME) : null;
        String phone = entity.contains(PROPERTY_NAME) ? entity.getString(PROPERTY_NAME) : null;
        String publicURL = entity.contains(PROPERTY_NAME) ? entity.getString(PROPERTY_NAME) : null;

        return new Corporation(
                entity.getKey().getName(),
                name,
                description,
                address,
                email,
                nif,
                phone,
                publicURL);
    }

    public List<Corporation> findAllColaborators() {
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
}
