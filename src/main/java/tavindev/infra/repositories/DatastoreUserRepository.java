package tavindev.infra.repositories;

import com.google.cloud.datastore.*;
import org.jvnet.hk2.annotations.Service;
import tavindev.core.repositories.UserRepository;
import tavindev.core.entities.*;
import tavindev.core.utils.PasswordUtils;

import java.util.List;
import java.util.ArrayList;
import java.util.Map;
import java.util.Optional;

@Service
public class DatastoreUserRepository implements UserRepository {
    private static final String USER_KIND = "User";
    private final Datastore datastore = DatastoreManager.getInstance();

    @Override
    public void save(User user) {
        KeyFactory keyFactory = datastore.newKeyFactory().setKind(USER_KIND);
        Key userKey = keyFactory.newKey(user.getId());

        Entity userEntity = Entity.newBuilder(userKey)
            .set("email", user.getEmail())
            .set("username", user.getUsername())
            .set("fullName", user.getPersonalInfo().fullName())
            .set("phone", user.getPersonalInfo().phone())
            .set("password", PasswordUtils.hashPassword(user.getPersonalInfo().password()))
            .set("role", user.getRole().name())
            .set("accountStatus", user.getAccountStatus().name())
            .set("profile", user.getProfile().name())
            .set("citizenCard", user.getIdentificationInfo().citizenCard().orElse(""))
            .set("taxId", user.getIdentificationInfo().taxId().orElse(""))
            .set("address", user.getIdentificationInfo().address().orElse(""))
            .set("employer", user.getProfessionalInfo().employer().orElse(""))
            .set("jobTitle", user.getProfessionalInfo().jobTitle().orElse(""))
            .set("employerTaxId", user.getProfessionalInfo().employerTaxId().orElse(""))
            .set("photo", user.getPersonalInfo().photo().orElse(""))
            .build();

        datastore.put(userEntity);
    }

    @Override
    public void delete(User user) {
        KeyFactory keyFactory = datastore.newKeyFactory().setKind(USER_KIND);
        Key userKey = keyFactory.newKey(user.getId());
        datastore.delete(userKey);
    }

    @Override
    public User findByEmail(String email) {
        Query<Entity> query = Query.newEntityQueryBuilder()
            .setKind(USER_KIND)
            .setFilter(StructuredQuery.PropertyFilter.eq("email", email))
            .build();

        QueryResults<Entity> results = datastore.run(query);
        if (results.hasNext()) {
            return convertToUser(results.next());
        }
        return null;
    }

    @Override
    public User findByUsername(String username) {
        KeyFactory keyFactory = datastore.newKeyFactory().setKind(USER_KIND);
        Key userKey = keyFactory.newKey(username);
        Entity userEntity = datastore.get(userKey);
        return userEntity != null ? convertToUser(userEntity) : null;
    }

    @Override
    public User findByIdentifier(String identifier) {
        // Try email first
        User user = findByEmail(identifier);
        if (user != null) {
            return user;
        }
        // Then try username
        return findByUsername(identifier);
    }

    @Override
    public void updateRole(User user, UserRole newRole) {
        KeyFactory keyFactory = datastore.newKeyFactory().setKind(USER_KIND);
        Key userKey = keyFactory.newKey(user.getId());
        Entity userEntity = datastore.get(userKey);
        
        if (userEntity != null) {
            Entity updatedEntity = Entity.newBuilder(userEntity)
                .set("role", newRole.name())
                .build();

            datastore.update(updatedEntity);
        }
    }

    @Override
    public void updateAccountState(User user, AccountStatus accountStatus) {
        KeyFactory keyFactory = datastore.newKeyFactory().setKind(USER_KIND);
        Key userKey = keyFactory.newKey(user.getId());
        Entity userEntity = datastore.get(userKey);
        
        if (userEntity != null) {
            Entity updatedEntity = Entity.newBuilder(userEntity)
                .set("accountStatus", accountStatus.name())
                .build();

            datastore.update(updatedEntity);
        }
    }

    @Override
    public void updateAttributes(User user, Map<String, String> attributes) {
        KeyFactory keyFactory = datastore.newKeyFactory().setKind(USER_KIND);
        Key userKey = keyFactory.newKey(user.getId());
        Entity userEntity = datastore.get(userKey);
        
        if (userEntity != null) {
            Entity.Builder updatedEntity = Entity.newBuilder(userEntity);
            
            // Update only the attributes that are provided
            if (attributes.containsKey("fullName")) {
                updatedEntity.set("fullName", attributes.get("fullName"));
            }
            if (attributes.containsKey("phone")) {
                updatedEntity.set("phone", attributes.get("phone"));
            }
            if (attributes.containsKey("address")) {
                updatedEntity.set("address", attributes.get("address"));
            }
            if (attributes.containsKey("employer")) {
                updatedEntity.set("employer", attributes.get("employer"));
            }
            if (attributes.containsKey("jobTitle")) {
                updatedEntity.set("jobTitle", attributes.get("jobTitle"));
            }
            if (attributes.containsKey("photo")) {
                updatedEntity.set("photo", attributes.get("photo"));
            }
            
            datastore.update(updatedEntity.build());
        }
    }

    @Override
    public void updatePassword(User user, String newPassword) {
        KeyFactory keyFactory = datastore.newKeyFactory().setKind(USER_KIND);
        Key userKey = keyFactory.newKey(user.getId());
        Entity userEntity = datastore.get(userKey);
        
        if (userEntity != null) {
            Entity updatedEntity = Entity.newBuilder(userEntity)
                .set("password", PasswordUtils.hashPassword(newPassword))
                .build();
            datastore.update(updatedEntity);
        }
    }

    @Override
    public List<User> findAllUsers() {
        Query<Entity> query = Query.newEntityQueryBuilder()
            .setKind(USER_KIND)
            .build();

        List<User> users = new ArrayList<>();
        QueryResults<Entity> results = datastore.run(query);
        while (results.hasNext()) {
            users.add(convertToUser(results.next()));
        }
        return users;
    }

    private User convertToUser(Entity entity) {
        PersonalInfo personalInfo = new PersonalInfo(
            entity.getString("email"),
            entity.getString("username"),
            entity.getString("fullName"),
            entity.getString("phone"),
            entity.getString("password"),
            Optional.ofNullable(entity.getString("photo"))
        );

        IdentificationInfo identificationInfo = new IdentificationInfo(
            Optional.ofNullable(entity.getString("citizenCard")),
            Optional.ofNullable(entity.getString("taxId")),
            Optional.ofNullable(entity.getString("address"))
        );

        ProfessionalInfo professionalInfo = new ProfessionalInfo(
            Optional.ofNullable(entity.getString("employer")),
            Optional.ofNullable(entity.getString("jobTitle")),
            Optional.ofNullable(entity.getString("employerTaxId"))
        );

        return new User(
            personalInfo,
            identificationInfo,
            professionalInfo,
            UserProfile.valueOf(entity.getString("profile")),
            UserRole.valueOf(entity.getString("role")),
            AccountStatus.valueOf(entity.getString("accountStatus"))
        );
    }
}
