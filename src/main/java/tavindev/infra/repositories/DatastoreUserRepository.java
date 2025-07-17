package tavindev.infra.repositories;

import com.google.cloud.datastore.*;
import org.jvnet.hk2.annotations.Service;
import tavindev.core.entities.*;

import java.util.List;
import java.time.LocalDate;
import java.util.ArrayList;

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
                .set("password", user.getPassword())
                .set("role", user.getRole().name())
                .set("accountStatus", user.getAccountStatus().name())
                .set("profile", user.getProfile().name());

        if (user.getFullName() != null) {
            userEntityBuilder.set("fullName", user.getFullName());
        }
        if (user.getPhonePrimary() != null) {
            userEntityBuilder.set("phonePrimary", user.getPhonePrimary());
        }

        if (user.getPhoneSecondary() != null) {
            userEntityBuilder.set("phoneSecondary", user.getPhoneSecondary());
        }

        if (user.getNationality() != null) {
            userEntityBuilder.set("nationality", user.getNationality());
        }
        if (user.getResidence() != null) {
            userEntityBuilder.set("residence", user.getResidence());
        }
        if (user.getPostalCode() != null) {
            userEntityBuilder.set("postalCode", user.getPostalCode());
        }
        if (user.getDateOfBirth() != null) {
            userEntityBuilder.set("birthDate", user.getDateOfBirth().toString());
        }

        if (user.getCitizenCard() != null) {
            userEntityBuilder.set("citizenCard", user.getCitizenCard());
        }
        if (user.getTaxId() != null) {
            userEntityBuilder.set("taxId", user.getTaxId());
        }

        if (user.getEmployer() != null) {
            userEntityBuilder.set("employer", user.getEmployer());
        }

        if (user.getJobTitle() != null) {
            userEntityBuilder.set("jobTitle", user.getJobTitle());
        }

        if (user.getEmployerTaxId() != null) {
            userEntityBuilder.set("employerTaxId", user.getEmployerTaxId());
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

    public List<User> findByAccountStatus(AccountStatus accountStatus) {
        Query<Entity> query = Query.newEntityQueryBuilder()
                .setKind(USER_KIND)
                .setFilter(StructuredQuery.PropertyFilter.eq("accountStatus", accountStatus.name()))
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
        String nationality = entity.contains("nationality") ? entity.getString("nationality") : null;
        String residence = entity.contains("residence") ? entity.getString("residence") : null;
        String postalCode = entity.contains("postalCode") ? entity.getString("postalCode") : null;
        String dateOfBirth = entity.contains("dateOfBirth") ? entity.getString("dateOfBirth") : null;
        String citizenCard = entity.contains("citizenCard") ? entity.getString("citizenCard") : null;
        String citizenCardIssueDate = entity.contains("citizenCardIssueDate") ? entity.getString("citizenCardIssueDate")
                : null;
        String citizenCardIssuePlace = entity.contains("citizenCardIssuePlace")
                ? entity.getString("citizenCardIssuePlace")
                : null;
        String citizenCardValidity = entity.contains("citizenCardValidity") ? entity.getString("citizenCardValidity")
                : null;
        String taxId = entity.contains("taxId") ? entity.getString("taxId") : null;
        String employer = entity.contains("employer") ? entity.getString("employer") : null;
        String jobTitle = entity.contains("jobTitle") ? entity.getString("jobTitle") : null;
        String employerTaxId = entity.contains("employerTaxId") ? entity.getString("employerTaxId") : null;
        String profile = entity.contains("profile") ? entity.getString("profile") : null;
        String accountStatus = entity.contains("accountStatus") ? entity.getString("accountStatus") : null;
        String role = entity.contains("role") ? entity.getString("role") : null;
        String status = entity.contains("status") ? entity.getString("status") : null;
        String phonePrimary = entity.contains("phonePrimary") ? entity.getString("phonePrimary") : null;
        String phoneSecondary = entity.contains("phoneSecondary") ? entity.getString("phoneSecondary") : null;
        String fullName = entity.contains("fullName") ? entity.getString("fullName") : null;
        String email = entity.contains("email") ? entity.getString("email") : null;
        String username = entity.contains("username") ? entity.getString("username") : null;
        String password = entity.contains("password") ? entity.getString("password") : null;
        String address = entity.contains("address") ? entity.getString("address") : null;

        return new User(
                entity.getKey().getName(),
                email,
                username,
                fullName,
                password,
                profile,
                citizenCard,
                citizenCardIssueDate != null ? LocalDate.parse(citizenCardIssueDate) : null,
                citizenCardIssuePlace,
                citizenCardValidity != null ? LocalDate.parse(citizenCardValidity) : null,
                dateOfBirth != null ? LocalDate.parse(dateOfBirth) : null,
                nationality,
                residence,
                address,
                taxId,
                employer,
                jobTitle,
                employerTaxId,
                postalCode,
                phonePrimary,
                phoneSecondary,
                status,
                role != null ? UserRole.valueOf(role) : null,
                accountStatus != null ? AccountStatus.valueOf(accountStatus) : null);
    }

    public List<User> findRegisteredUsers() {
        Query<Entity> query = Query.newEntityQueryBuilder()
                .setKind(USER_KIND)
                .setFilter(StructuredQuery.CompositeFilter.and(
                        StructuredQuery.PropertyFilter.eq("role", UserRole.RU.name()),
                        StructuredQuery.PropertyFilter.eq("profile", UserProfile.PUBLICO.name()),
                        StructuredQuery.PropertyFilter.eq("accountStatus", AccountStatus.ATIVADA.name())))
                .build();

        List<User> users = new ArrayList<>();
        QueryResults<Entity> results = datastore.run(query);
        while (results.hasNext()) {
            users.add(convertToUser(results.next()));
        }
        return users;
    }

    public List<User> findAllRoleUsers(UserRole role) {
        Query<Entity> query = Query.newEntityQueryBuilder()
                .setKind(USER_KIND)
                .setFilter(StructuredQuery.PropertyFilter.eq("role", role.name()))
                .build();

        List<User> users = new ArrayList<>();
        QueryResults<Entity> results = datastore.run(query);
        while (results.hasNext()) {
            users.add(convertToUser(results.next()));
        }
        return users;
    }

    public List<User> findUsersWithStatus(AccountStatus accountStatus) {
        Query<Entity> query = Query.newEntityQueryBuilder()
                .setKind(USER_KIND)
                .setFilter(StructuredQuery.PropertyFilter.eq("accountStatus", accountStatus.name()))
                .build();

        List<User> users = new ArrayList<>();
        QueryResults<Entity> results = datastore.run(query);
        while (results.hasNext()) {
            users.add(convertToUser(results.next()));
        }
        return users;
    }

    public List<User> findUsersByProfile(UserProfile userProfile) {
        Query<Entity> query = Query.newEntityQueryBuilder()
                .setKind(USER_KIND)
                .setFilter(StructuredQuery.PropertyFilter.eq("profile", userProfile.name()))
                .build();

        List<User> users = new ArrayList<>();
        QueryResults<Entity> results = datastore.run(query);
        while (results.hasNext()) {
            users.add(convertToUser(results.next()));
        }
        return users;
    }
}
