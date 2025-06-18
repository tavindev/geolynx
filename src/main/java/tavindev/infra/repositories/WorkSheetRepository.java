package tavindev.infra.repositories;

import com.google.cloud.datastore.*;
import org.jvnet.hk2.annotations.Service;
import tavindev.core.entities.WorkSheet;
import tavindev.core.entities.WorkSheet.Operation;
import tavindev.core.entities.WorkSheet.Feature;
import tavindev.infra.dto.worksheet.WorkSheetListResponseDTO;
import tavindev.api.mappers.WorkSheetMapper;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class WorkSheetRepository {
    private static final String WORK_SHEET_KIND = "WorkSheet";
    private final Datastore datastore = DatastoreManager.getInstance();

    public WorkSheet get(Long id) {
        KeyFactory keyFactory = datastore.newKeyFactory().setKind(WORK_SHEET_KIND);
        Key workSheetKey = keyFactory.newKey(id);
        Entity workSheetEntity = datastore.get(workSheetKey);

        if (workSheetEntity == null) {
            return null;
        }

        // Extract basic metadata
        Long workSheetId = workSheetEntity.getLong("id");
        String startingDate = workSheetEntity.getString("startingDate");
        String finishingDate = workSheetEntity.getString("finishingDate");
        String issueDate = workSheetEntity.getString("issueDate");
        Long serviceProviderId = workSheetEntity.getLong("serviceProviderId");
        String awardDate = workSheetEntity.getString("awardDate");
        Long issuingUserId = workSheetEntity.getLong("issuingUserId");

        // Extract AIGP list
        List<String> aigp = null;
        if (workSheetEntity.contains("aigp")) {
            String aigpString = workSheetEntity.getString("aigp");
            if (aigpString != null && !aigpString.isEmpty()) {
                aigp = Arrays.asList(aigpString.split(","));
            }
        }

        // Extract POSA information
        String posaCode = workSheetEntity.getString("posaCode");
        String posaDescription = workSheetEntity.getString("posaDescription");

        // Extract POSP information
        String pospCode = workSheetEntity.getString("pospCode");
        String pospDescription = workSheetEntity.getString("pospDescription");

        // Extract operations
        List<Operation> operations = new ArrayList<>();
        if (workSheetEntity.contains("operations")) {
            List<Value<?>> operationsList = workSheetEntity.getList("operations");
            for (Value<?> operationValue : operationsList) {
                if (operationValue instanceof EntityValue) {
                    FullEntity<?> operationEntity = ((EntityValue) operationValue).get();
                    String operationCode = operationEntity.getString("operationCode");
                    String operationDescription = operationEntity.getString("operationDescription");
                    double areaHa = operationEntity.getDouble("areaHa");
                    operations.add(new Operation(operationCode, operationDescription, areaHa));
                }
            }
        }

        // Extract features
        List<Feature> features = new ArrayList<>();
        if (workSheetEntity.contains("features")) {
            List<Value<?>> featuresList = workSheetEntity.getList("features");
            for (Value<?> featureValue : featuresList) {
                if (featureValue instanceof EntityValue) {
                    FullEntity<?> featureEntity = ((EntityValue) featureValue).get();
                    String featureAigp = featureEntity.getString("aigp");
                    String ruralPropertyId = featureEntity.getString("ruralPropertyId");
                    int polygonId = (int) featureEntity.getLong("polygonId");
                    int uiId = (int) featureEntity.getLong("uiId");

                    // Parse coordinates from string representation
                    List<List<Double>> coordinates = parseCoordinates(featureEntity.getString("coordinates"));

                    features.add(new Feature(featureAigp, ruralPropertyId, polygonId, uiId, coordinates));
                }
            }
        }

        return new WorkSheet(workSheetId, startingDate, finishingDate, issueDate,
                serviceProviderId, awardDate, issuingUserId, aigp, posaCode, posaDescription,
                pospCode, pospDescription, operations, features);
    }

    private List<List<Double>> parseCoordinates(String coordinatesString) {
        // Simple parsing of coordinates from string representation
        // This is a basic implementation - you might want to use a proper JSON parser
        List<List<Double>> coordinates = new ArrayList<>();
        if (coordinatesString != null && !coordinatesString.isEmpty()) {
            // Remove brackets and split by coordinate pairs
            String cleanString = coordinatesString.replaceAll("[\\[\\]]", "");
            String[] pairs = cleanString.split(",\\s*");

            for (int i = 0; i < pairs.length; i += 2) {
                if (i + 1 < pairs.length) {
                    try {
                        double x = Double.parseDouble(pairs[i].trim());
                        double y = Double.parseDouble(pairs[i + 1].trim());
                        List<Double> coord = Arrays.asList(x, y);
                        coordinates.add(coord);
                    } catch (NumberFormatException e) {
                        // Skip invalid coordinates
                    }
                }
            }
        }
        return coordinates;
    }

    public void remove(WorkSheet workSheet) {
        KeyFactory keyFactory = datastore.newKeyFactory().setKind(WORK_SHEET_KIND);
        Key workSheetKey = keyFactory.newKey(workSheet.getId());

        datastore.delete(workSheetKey);
    }

    public void save(WorkSheet workSheet) {
        KeyFactory keyFactory = datastore.newKeyFactory().setKind(WORK_SHEET_KIND);
        Key workSheetKey = keyFactory.newKey(workSheet.getId());

        Entity.Builder entityBuilder = Entity.newBuilder(workSheetKey);

        // Save basic metadata
        entityBuilder.set("id", workSheet.getId());
        entityBuilder.set("startingDate", workSheet.getStartingDate());
        entityBuilder.set("finishingDate", workSheet.getFinishingDate());
        entityBuilder.set("issueDate", workSheet.getIssueDate());
        entityBuilder.set("serviceProviderId", workSheet.getServiceProviderId());
        entityBuilder.set("awardDate", workSheet.getAwardDate());
        entityBuilder.set("issuingUserId", workSheet.getIssuingUserId());

        // Save AIGP list
        if (workSheet.getAigp() != null) {
            entityBuilder.set("aigp", StringValue.newBuilder(workSheet.getAigp().stream()
                    .collect(Collectors.joining(",")))
                    .setExcludeFromIndexes(true)
                    .build());
        }

        // Save POSA information
        entityBuilder.set("posaCode", workSheet.getPosaCode());
        entityBuilder.set("posaDescription", workSheet.getPosaDescription());

        // Save POSP information
        entityBuilder.set("pospCode", workSheet.getPospCode());
        entityBuilder.set("pospDescription", workSheet.getPospDescription());

        // Save operations as a nested entity
        if (workSheet.getOperations() != null) {
            ListValue.Builder operationsBuilder = ListValue.newBuilder();
            for (Operation operation : workSheet.getOperations()) {
                KeyFactory operationKeyFactory = datastore.newKeyFactory().setKind("Operation");
                IncompleteKey operationIncompleteKey = operationKeyFactory.newKey();
                Key operationKey = datastore.allocateId(operationIncompleteKey);
                Entity operationEntity = Entity.newBuilder(operationKey)
                        .set("operationCode", operation.getOperationCode())
                        .set("operationDescription", operation.getOperationDescription())
                        .set("areaHa", operation.getAreaHa())
                        .build();
                operationsBuilder.addValue(operationEntity);
            }
            entityBuilder.set("operations", operationsBuilder.build());
        }

        // Save features as a nested entity
        if (workSheet.getFeatures() != null) {
            ListValue.Builder featuresBuilder = ListValue.newBuilder();
            for (Feature feature : workSheet.getFeatures()) {
                KeyFactory featureKeyFactory = datastore.newKeyFactory().setKind("Feature");
                IncompleteKey featureIncompleteKey = featureKeyFactory.newKey();
                Key featureKey = datastore.allocateId(featureIncompleteKey);
                Entity featureEntity = Entity.newBuilder(featureKey)
                        .set("aigp", feature.getAigp())
                        .set("ruralPropertyId", feature.getRuralPropertyId())
                        .set("polygonId", feature.getPolygonId())
                        .set("uiId", feature.getUiId())
                        .set("coordinates", StringValue.newBuilder(feature.getCoordinates().toString())
                                .setExcludeFromIndexes(true)
                                .build())
                        .build();
                featuresBuilder.addValue(featureEntity);
            }
            entityBuilder.set("features", featuresBuilder.build());
        }

        Entity workSheetEntity = entityBuilder.build();
        datastore.put(workSheetEntity);
    }

    public boolean exists(Long id) {
        KeyFactory keyFactory = datastore.newKeyFactory().setKind(WORK_SHEET_KIND);
        Key workSheetKey = keyFactory.newKey(id);
        Entity workSheetEntity = datastore.get(workSheetKey);

        return workSheetEntity != null;
    }

    public List<WorkSheetListResponseDTO> getAll() {
        Query<Entity> query = Query.newEntityQueryBuilder()
                .setKind(WORK_SHEET_KIND)
                .build();

        QueryResults<Entity> results = datastore.run(query);
        List<WorkSheetListResponseDTO> workSheets = new ArrayList<>();

        while (results.hasNext()) {
            Entity workSheetEntity = results.next();

            // Extract basic metadata
            Long workSheetId = workSheetEntity.getLong("id");
            String startingDate = workSheetEntity.getString("startingDate");
            String finishingDate = workSheetEntity.getString("finishingDate");
            String issueDate = workSheetEntity.getString("issueDate");
            Long serviceProviderId = workSheetEntity.getLong("serviceProviderId");
            String awardDate = workSheetEntity.getString("awardDate");

            // Extract AIGP list
            List<String> aigp = null;
            if (workSheetEntity.contains("aigp")) {
                String aigpString = workSheetEntity.getString("aigp");
                if (aigpString != null && !aigpString.isEmpty()) {
                    aigp = Arrays.asList(aigpString.split(","));
                }
            }

            // Extract operations
            List<WorkSheetListResponseDTO.OperationDTO> operations = new ArrayList<>();
            if (workSheetEntity.contains("operations")) {
                List<Value<?>> operationsList = workSheetEntity.getList("operations");
                for (Value<?> operationValue : operationsList) {
                    if (operationValue instanceof EntityValue) {
                        FullEntity<?> operationEntity = ((EntityValue) operationValue).get();
                        String operationCode = operationEntity.getString("operationCode");
                        String operationDescription = operationEntity.getString("operationDescription");
                        double areaHa = operationEntity.getDouble("areaHa");
                        operations.add(
                                new WorkSheetListResponseDTO.OperationDTO(operationCode, operationDescription, areaHa));
                    }
                }
            }

            WorkSheetListResponseDTO workSheet = new WorkSheetListResponseDTO(
                    workSheetId, aigp, startingDate, finishingDate, issueDate, awardDate, serviceProviderId,
                    operations);

            workSheets.add(workSheet);
        }

        return workSheets;
    }
}