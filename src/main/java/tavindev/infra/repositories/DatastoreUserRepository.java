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

    // Property name constants
    private static final String PROPERTY_EMAIL = "email";
    private static final String PROPERTY_USERNAME = "username";
    private static final String PROPERTY_PASSWORD = "password";
    private static final String PROPERTY_ROLE = "role";
    private static final String PROPERTY_ACCOUNT_STATUS = "accountStatus";
    private static final String PROPERTY_PROFILE = "profile";
    private static final String PROPERTY_FULL_NAME = "fullName";
    private static final String PROPERTY_PHONE_PRIMARY = "phonePrimary";
    private static final String PROPERTY_PHONE_SECONDARY = "phoneSecondary";
    private static final String PROPERTY_NATIONALITY = "nationality";
    private static final String PROPERTY_RESIDENCE = "residence";
    private static final String PROPERTY_POSTAL_CODE = "postalCode";
    private static final String PROPERTY_DATE_OF_BIRTH = "dateOfBirth";
    private static final String PROPERTY_CITIZEN_CARD = "citizenCard";
    private static final String PROPERTY_TAX_ID = "taxId";
    private static final String PROPERTY_EMPLOYER = "employer";
    private static final String PROPERTY_JOB_TITLE = "jobTitle";
    private static final String PROPERTY_EMPLOYER_TAX_ID = "employerTaxId";
    private static final String PROPERTY_CITIZEN_CARD_ISSUE_DATE = "citizenCardIssueDate";
    private static final String PROPERTY_CITIZEN_CARD_ISSUE_PLACE = "citizenCardIssuePlace";
    private static final String PROPERTY_CITIZEN_CARD_VALIDITY = "citizenCardValidity";
    private static final String PROPERTY_STATUS = "status";
    private static final String PROPERTY_ADDRESS = "address";

    private final Datastore datastore = DatastoreManager.getInstance();

    public void save(User user) {
        KeyFactory keyFactory = datastore.newKeyFactory().setKind(USER_KIND);
        Key userKey = keyFactory.newKey(user.getId());

        Entity.Builder userEntityBuilder = Entity.newBuilder(userKey)
                .set(PROPERTY_EMAIL, user.getEmail())
                .set(PROPERTY_USERNAME, user.getUsername())
                .set(PROPERTY_PASSWORD, user.getPassword())
                .set(PROPERTY_ROLE, user.getRole().name())
                .set(PROPERTY_ACCOUNT_STATUS, user.getAccountStatus().name())
                .set(PROPERTY_PROFILE, user.getProfile().name());

        if (user.getFullName() != null) {
            userEntityBuilder.set(PROPERTY_FULL_NAME, user.getFullName());
        }
        if (user.getPhonePrimary() != null) {
            userEntityBuilder.set(PROPERTY_PHONE_PRIMARY, user.getPhonePrimary());
        }

        if (user.getPhoneSecondary() != null) {
            userEntityBuilder.set(PROPERTY_PHONE_SECONDARY, user.getPhoneSecondary());
        }

        if (user.getNationality() != null) {
            userEntityBuilder.set(PROPERTY_NATIONALITY, user.getNationality());
        }
        if (user.getResidence() != null) {
            userEntityBuilder.set(PROPERTY_RESIDENCE, user.getResidence());
        }
        if (user.getPostalCode() != null) {
            userEntityBuilder.set(PROPERTY_POSTAL_CODE, user.getPostalCode());
        }
        if (user.getDateOfBirth() != null) {
            userEntityBuilder.set(PROPERTY_DATE_OF_BIRTH, user.getDateOfBirth().toString());
        }

        if (user.getCitizenCard() != null) {
            userEntityBuilder.set(PROPERTY_CITIZEN_CARD, user.getCitizenCard());
        }
        if (user.getTaxId() != null) {
            userEntityBuilder.set(PROPERTY_TAX_ID, user.getTaxId());
        }

        if (user.getEmployer() != null) {
            userEntityBuilder.set(PROPERTY_EMPLOYER, user.getEmployer());
        }

        if (user.getJobTitle() != null) {
            userEntityBuilder.set(PROPERTY_JOB_TITLE, user.getJobTitle());
        }

        if (user.getEmployerTaxId() != null) {
            userEntityBuilder.set(PROPERTY_EMPLOYER_TAX_ID, user.getEmployerTaxId());
        }

        if (user.getAddress() != null) {
            userEntityBuilder.set(PROPERTY_ADDRESS, user.getAddress());
        }

        if (user.getCitizenCardIssueDate() != null) {
            userEntityBuilder.set(PROPERTY_CITIZEN_CARD_ISSUE_DATE, user.getCitizenCardIssueDate().toString());
        }
        if (user.getCitizenCardIssuePlace() != null) {
            userEntityBuilder.set(PROPERTY_CITIZEN_CARD_ISSUE_PLACE, user.getCitizenCardIssuePlace());
        }
        if (user.getCitizenCardValidity() != null) {
            userEntityBuilder.set(PROPERTY_CITIZEN_CARD_VALIDITY, user.getCitizenCardValidity().toString());
        }

        if (user.getStatus() != null) {
            userEntityBuilder.set(PROPERTY_STATUS, user.getStatus());
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
        return findByProperty(PROPERTY_EMAIL, email);
    }

    public User findByUsername(String username) {
        return findByProperty(PROPERTY_USERNAME, username);
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
                .setFilter(StructuredQuery.PropertyFilter.eq(PROPERTY_ACCOUNT_STATUS, accountStatus.name()))
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
        String nationality = entity.contains(PROPERTY_NATIONALITY) ? entity.getString(PROPERTY_NATIONALITY) : null;
        String residence = entity.contains(PROPERTY_RESIDENCE) ? entity.getString(PROPERTY_RESIDENCE) : null;
        String postalCode = entity.contains(PROPERTY_POSTAL_CODE) ? entity.getString(PROPERTY_POSTAL_CODE) : null;
        String dateOfBirth = entity.contains(PROPERTY_DATE_OF_BIRTH) ? entity.getString(PROPERTY_DATE_OF_BIRTH) : null;
        String citizenCard = entity.contains(PROPERTY_CITIZEN_CARD) ? entity.getString(PROPERTY_CITIZEN_CARD) : null;
        String citizenCardIssueDate = entity.contains(PROPERTY_CITIZEN_CARD_ISSUE_DATE)
                ? entity.getString(PROPERTY_CITIZEN_CARD_ISSUE_DATE)
                : null;
        String citizenCardIssuePlace = entity.contains(PROPERTY_CITIZEN_CARD_ISSUE_PLACE)
                ? entity.getString(PROPERTY_CITIZEN_CARD_ISSUE_PLACE)
                : null;
        String citizenCardValidity = entity.contains(PROPERTY_CITIZEN_CARD_VALIDITY)
                ? entity.getString(PROPERTY_CITIZEN_CARD_VALIDITY)
                : null;
        String taxId = entity.contains(PROPERTY_TAX_ID) ? entity.getString(PROPERTY_TAX_ID) : null;
        String employer = entity.contains(PROPERTY_EMPLOYER) ? entity.getString(PROPERTY_EMPLOYER) : null;
        String jobTitle = entity.contains(PROPERTY_JOB_TITLE) ? entity.getString(PROPERTY_JOB_TITLE) : null;
        String employerTaxId = entity.contains(PROPERTY_EMPLOYER_TAX_ID) ? entity.getString(PROPERTY_EMPLOYER_TAX_ID)
                : null;
        String profile = entity.contains(PROPERTY_PROFILE) ? entity.getString(PROPERTY_PROFILE) : null;
        String accountStatus = entity.contains(PROPERTY_ACCOUNT_STATUS) ? entity.getString(PROPERTY_ACCOUNT_STATUS)
                : null;
        String role = entity.contains(PROPERTY_ROLE) ? entity.getString(PROPERTY_ROLE) : null;
        String status = entity.contains(PROPERTY_STATUS) ? entity.getString(PROPERTY_STATUS) : null;
        String phonePrimary = entity.contains(PROPERTY_PHONE_PRIMARY) ? entity.getString(PROPERTY_PHONE_PRIMARY) : null;
        String phoneSecondary = entity.contains(PROPERTY_PHONE_SECONDARY) ? entity.getString(PROPERTY_PHONE_SECONDARY)
                : null;
        String fullName = entity.contains(PROPERTY_FULL_NAME) ? entity.getString(PROPERTY_FULL_NAME) : null;
        String email = entity.contains(PROPERTY_EMAIL) ? entity.getString(PROPERTY_EMAIL) : null;
        String username = entity.contains(PROPERTY_USERNAME) ? entity.getString(PROPERTY_USERNAME) : null;
        String password = entity.contains(PROPERTY_PASSWORD) ? entity.getString(PROPERTY_PASSWORD) : null;
        String address = entity.contains(PROPERTY_ADDRESS) ? entity.getString(PROPERTY_ADDRESS) : null;

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
                        StructuredQuery.PropertyFilter.eq(PROPERTY_ROLE, UserRole.RU.name()),
                        StructuredQuery.PropertyFilter.eq(PROPERTY_PROFILE, UserProfile.PUBLICO.name()),
                        StructuredQuery.PropertyFilter.eq(PROPERTY_ACCOUNT_STATUS, AccountStatus.ATIVADA.name())))
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
                .setFilter(StructuredQuery.PropertyFilter.eq(PROPERTY_ROLE, role.name()))
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
                .setFilter(StructuredQuery.PropertyFilter.eq(PROPERTY_ACCOUNT_STATUS, accountStatus.name()))
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
                .setFilter(StructuredQuery.PropertyFilter.eq(PROPERTY_PROFILE, userProfile.name()))
                .build();

        List<User> users = new ArrayList<>();
        QueryResults<Entity> results = datastore.run(query);
        while (results.hasNext()) {
            users.add(convertToUser(results.next()));
        }
        return users;
    }
}
