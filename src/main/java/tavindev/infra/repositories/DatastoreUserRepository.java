package tavindev.infra.repositories;

import com.google.cloud.datastore.*;
import org.jvnet.hk2.annotations.Service;
import tavindev.core.entities.*;
import tavindev.core.utils.PasswordUtils;

import java.util.List;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Map;
import java.util.Optional;

@Service
public class DatastoreUserRepository {
    private static final String USER_KIND = "User";
    private final Datastore datastore = DatastoreManager.getInstance();

    public void save(User user) {
        KeyFactory keyFactory = datastore.newKeyFactory().setKind(USER_KIND);
        Key userKey = keyFactory.newKey(user.getId());

        Entity.Builder userEntityBuilder = Entity.newBuilder(userKey)
                .set("email", user.getEmail())
                .set("username", user.getUsername())
                .set("password", PasswordUtils.hashPassword(user.getPersonalInfo().password()))
                .set("role", user.getRole().name())
                .set("accountStatus", user.getAccountStatus().name())
                .set("profile", user.getProfile().name());

        // Handle PersonalInfo fields with null checks
        PersonalInfo personalInfo = user.getPersonalInfo();
        if (personalInfo.fullName() != null) {
            userEntityBuilder.set("fullName", personalInfo.fullName());
        }
        if (personalInfo.phone() != null) {
            userEntityBuilder.set("phone", personalInfo.phone());
        }
        if (personalInfo.nationality() != null) {
            userEntityBuilder.set("nationality", personalInfo.nationality());
        }
        if (personalInfo.residence() != null) {
            userEntityBuilder.set("residence", personalInfo.residence());
        }
        if (personalInfo.postalCode() != null) {
            userEntityBuilder.set("postalCode", personalInfo.postalCode());
        }
        if (personalInfo.birthDate() != null) {
            userEntityBuilder.set("birthDate", personalInfo.birthDate().toString());
        }

        // Handle IdentificationInfo fields with null checks
        IdentificationInfo identificationInfo = user.getIdentificationInfo();
        if (identificationInfo != null) {
            if (identificationInfo.citizenCard() != null) {
                userEntityBuilder.set("citizenCard", identificationInfo.citizenCard());
            }
            if (identificationInfo.taxId() != null) {
                userEntityBuilder.set("taxId", identificationInfo.taxId());
            }
            if (identificationInfo.address() != null) {
                userEntityBuilder.set("address", identificationInfo.address());
            }
        }

        // Handle ProfessionalInfo fields with null checks
        ProfessionalInfo professionalInfo = user.getProfessionalInfo();
        if (professionalInfo != null) {
            if (professionalInfo.employer() != null) {
                userEntityBuilder.set("employer", professionalInfo.employer());
            }
            if (professionalInfo.jobTitle() != null) {
                userEntityBuilder.set("jobTitle", professionalInfo.jobTitle());
            }
            if (professionalInfo.employerTaxId() != null) {
                userEntityBuilder.set("employerTaxId", professionalInfo.employerTaxId());
            }
        }

        datastore.put(userEntityBuilder.build());
    }

    public void delete(User user) {
        KeyFactory keyFactory = datastore.newKeyFactory().setKind(USER_KIND);
        Key userKey = keyFactory.newKey(user.getId());

        datastore.delete(userKey);
    }

    public User findById(String id) {
        KeyFactory keyFactory = datastore.newKeyFactory().setKind(USER_KIND);
        Key userKey = keyFactory.newKey(id);
        Entity userEntity = datastore.get(userKey);

        return userEntity != null ? convertToUser(userEntity) : null;
    }

    private User findByProperty(String property, String value) {
        Query<Entity> query = Query.newEntityQueryBuilder()
                .setKind(USER_KIND)
                .setFilter(StructuredQuery.PropertyFilter.eq(property, value))
                .build();

        QueryResults<Entity> results = datastore.run(query);
        if (results.hasNext()) {
            Entity entity = results.next();

            return convertToUser(entity);
        }
        return null;
    }

    public User findByEmail(String email) {
        return findByProperty("email", email);
    }

    public User findByUsername(String username) {
        return findByProperty("username", username);
    }

    public User findByIdentifier(String identifier) {
        User user = findByEmail(identifier);

        if (user != null)
            return user;

        return findByUsername(identifier);
    }

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
        // Use safe getters for fields that might not exist in existing data
        String birthDateStr = entity.contains("birthDate") ? entity.getString("birthDate") : null;
        String nationality = entity.contains("nationality") ? entity.getString("nationality") : null;
        String residence = entity.contains("residence") ? entity.getString("residence") : null;
        String postalCode = entity.contains("postalCode") ? entity.getString("postalCode") : null;

        PersonalInfo personalInfo = new PersonalInfo(
                entity.getString("email"),
                entity.getString("username"),
                entity.getString("fullName"),
                entity.getString("phone"),
                entity.getString("password"),
                nationality,
                residence,
                entity.getString("address"), // Use existing address field
                postalCode,
                birthDateStr != null ? LocalDate.parse(birthDateStr) : null);

        IdentificationInfo identificationInfo = new IdentificationInfo(
                entity.getString("citizenCard"),
                entity.getString("taxId"),
                entity.getString("address"));

        ProfessionalInfo professionalInfo = new ProfessionalInfo(
                entity.getString("employer"),
                entity.getString("jobTitle"),
                entity.getString("employerTaxId"));

        return new User(
                entity.getKey().getName(),
                personalInfo,
                identificationInfo,
                professionalInfo,
                UserProfile.valueOf(entity.getString("profile")),
                UserRole.valueOf(entity.getString("role")),
                AccountStatus.valueOf(entity.getString("accountStatus")));
    }
}
