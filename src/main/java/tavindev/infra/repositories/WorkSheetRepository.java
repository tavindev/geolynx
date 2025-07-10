package tavindev.infra.repositories;

import com.google.cloud.datastore.*;
import org.jvnet.hk2.annotations.Service;
import tavindev.core.entities.WorkSheet;
import tavindev.core.entities.WorkSheet.GeoFeature;
import tavindev.core.entities.WorkSheet.Operation;
import tavindev.core.entities.WorkSheet.Metadata;
import tavindev.core.entities.WorkSheet.CRS;
import tavindev.core.entities.WorkSheet.GeoFeature.FeatureProperties;
import tavindev.core.entities.WorkSheet.GeoFeature.Geometry;
import tavindev.infra.dto.worksheet.WorkSheetListResponseDTO;

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

        // Extract type and CRS
        String type = workSheetEntity.getString("type");

        // Extract CRS
        CRS crs = null;
        if (workSheetEntity.contains("crs")) {
            FullEntity<?> crsEntity = workSheetEntity.getEntity("crs");
            String crsType = crsEntity.getString("type");
            FullEntity<?> crsPropertiesEntity = crsEntity.getEntity("properties");
            String crsName = crsPropertiesEntity.getString("name");
            CRS.CRSProperties crsProperties = new CRS.CRSProperties(crsName);
            crs = new CRS(crsType, crsProperties);
        }

        // Extract features
        List<GeoFeature> features = new ArrayList<>();
        if (workSheetEntity.contains("features")) {
            List<Value<?>> featuresList = workSheetEntity.getList("features");
            for (Value<?> featureValue : featuresList) {
                if (featureValue instanceof EntityValue) {
                    FullEntity<?> featureEntity = ((EntityValue) featureValue).get();
                    String featureType = featureEntity.getString("type");

                    // Extract feature properties
                    FullEntity<?> propertiesEntity = featureEntity.getEntity("properties");

                    Long polygonId = propertiesEntity.contains("polygonId") ? propertiesEntity.getLong("polygonId")
                            : null;
                    Long uiId = propertiesEntity.contains("uiId") ? propertiesEntity.getLong("uiId") : null;
                    String aigp = propertiesEntity.contains("aigp") ? propertiesEntity.getString("aigp") : null;
                    Long featureId = propertiesEntity.contains("id") ? propertiesEntity.getLong("id") : null;
                    String ruralPropertyId = propertiesEntity.contains("ruralPropertyId")
                            ? propertiesEntity.getString("ruralPropertyId")
                            : null;
                    FeatureProperties properties = new FeatureProperties(featureId, ruralPropertyId, polygonId, uiId,
                            aigp);

                    // Extract geometry
                    FullEntity<?> geometryEntity = featureEntity.getEntity("geometry");
                    String geometryType = geometryEntity.getString("type");
                    List<List<List<Double>>> coordinates = parseCoordinates3D(geometryEntity.getString("coordinates"));
                    Geometry geometry = new Geometry(geometryType, coordinates);

                    features.add(new GeoFeature(featureType, properties, geometry));
                }
            }
        }

        // Extract metadata
        Metadata metadata = null;
        if (workSheetEntity.contains("metadata")) {
            FullEntity<?> metadataEntity = workSheetEntity.getEntity("metadata");
            Long workSheetId = metadataEntity.getLong("id");
            String startingDate = metadataEntity.getString("startingDate");
            String finishingDate = metadataEntity.getString("finishingDate");
            String issueDate = metadataEntity.getString("issueDate");
            Long serviceProviderId = metadataEntity.getLong("serviceProviderId");
            String awardDate = metadataEntity.getString("awardDate");
            Long issuingUserId = metadataEntity.getLong("issuingUserId");

            // Extract AIGP list
            List<String> aigp = null;
            if (metadataEntity.contains("aigp")) {
                String aigpString = metadataEntity.getString("aigp");
                if (aigpString != null && !aigpString.isEmpty()) {
                    aigp = Arrays.asList(aigpString.split(","));
                }
            }

            // Extract POSA information
            String posaCode = metadataEntity.getString("posaCode");
            String posaDescription = metadataEntity.getString("posaDescription");

            // Extract POSP information
            String pospCode = metadataEntity.getString("pospCode");
            String pospDescription = metadataEntity.getString("pospDescription");

            // Extract operations
            List<Operation> operations = new ArrayList<>();
            if (metadataEntity.contains("operations")) {
                List<Value<?>> operationsList = metadataEntity.getList("operations");
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

            metadata = new Metadata(workSheetId, startingDate, finishingDate, issueDate,
                    serviceProviderId, awardDate, issuingUserId, aigp, posaCode, posaDescription,
                    pospCode, pospDescription, operations);
        }

        return new WorkSheet(type, crs, features, metadata);
    }

    private List<List<List<Double>>> parseCoordinates3D(String coordinatesString) {
        // Parse 3D coordinates from string representation
        List<List<List<Double>>> coordinates = new ArrayList<>();
        if (coordinatesString != null && !coordinatesString.isEmpty()) {
            // This is a simplified parser - in production you might want to use a proper
            // JSON parser
            // Remove outer brackets and split by polygon rings
            String cleanString = coordinatesString.replaceAll("^\\[\\[\\[|\\]\\]\\]$", "");
            String[] rings = cleanString.split("\\],\\s*\\[");

            for (String ring : rings) {
                List<List<Double>> ringCoords = new ArrayList<>();
                String cleanRing = ring.replaceAll("[\\[\\]]", "");
                String[] pairs = cleanRing.split(",\\s*");

                for (int i = 0; i < pairs.length; i += 2) {
                    if (i + 1 < pairs.length) {
                        try {
                            double x = Double.parseDouble(pairs[i].trim());
                            double y = Double.parseDouble(pairs[i + 1].trim());
                            List<Double> coord = Arrays.asList(x, y);
                            ringCoords.add(coord);
                        } catch (NumberFormatException e) {
                            // Skip invalid coordinates
                        }
                    }
                }
                coordinates.add(ringCoords);
            }
        }
        return coordinates;
    }

    public void remove(WorkSheet workSheet) {
        KeyFactory keyFactory = datastore.newKeyFactory().setKind(WORK_SHEET_KIND);
        Key workSheetKey = keyFactory.newKey(workSheet.getMetadata().getId());

        datastore.delete(workSheetKey);
    }

    public WorkSheet save(WorkSheet workSheet) {
        KeyFactory keyFactory = datastore.newKeyFactory().setKind(WORK_SHEET_KIND);
        Key workSheetKey = keyFactory.newKey(workSheet.getMetadata().getId());

        Entity.Builder entityBuilder = Entity.newBuilder(workSheetKey);

        // Save type
        entityBuilder.set("type", workSheet.getType());

        // Save CRS
        if (workSheet.getCrs() != null) {
            FullEntity.Builder<IncompleteKey> crsBuilder = FullEntity.newBuilder();
            crsBuilder.set("type", workSheet.getCrs().getType());

            FullEntity.Builder<IncompleteKey> crsPropertiesBuilder = FullEntity.newBuilder();
            crsPropertiesBuilder.set("name", workSheet.getCrs().getProperties().getName());
            crsBuilder.set("properties", crsPropertiesBuilder.build());

            entityBuilder.set("crs", crsBuilder.build());
        }

        // Save features
        if (workSheet.getFeatures() != null) {
            ListValue.Builder featuresBuilder = ListValue.newBuilder();
            for (GeoFeature feature : workSheet.getFeatures()) {
                FullEntity.Builder<IncompleteKey> featureBuilder = FullEntity.newBuilder();
                featureBuilder.set("type", feature.getType());

                // Save feature properties
                FullEntity.Builder<IncompleteKey> propertiesBuilder = FullEntity.newBuilder();
                if (feature.getProperties().getId() != null)
                    propertiesBuilder.set("id", feature.getProperties().getId());

                if (feature.getProperties().getPolygonId() != null)
                    propertiesBuilder.set("polygonId", feature.getProperties().getPolygonId());
                if (feature.getProperties().getUiId() != null)
                    propertiesBuilder.set("uiId", feature.getProperties().getUiId());
                if (feature.getProperties().getAigp() != null)
                    propertiesBuilder.set("aigp", feature.getProperties().getAigp());
                if (feature.getProperties().getRuralPropertyId() != null)
                    propertiesBuilder.set("ruralPropertyId", feature.getProperties().getRuralPropertyId());

                featureBuilder.set("properties", propertiesBuilder.build());

                // Save geometry
                FullEntity.Builder<IncompleteKey> geometryBuilder = FullEntity.newBuilder();
                geometryBuilder.set("type", feature.getGeometry().getType());
                geometryBuilder.set("coordinates",
                        StringValue.newBuilder(feature.getGeometry().getCoordinates().toString())
                                .setExcludeFromIndexes(true)
                                .build());
                featureBuilder.set("geometry", geometryBuilder.build());

                featuresBuilder.addValue(featureBuilder.build());
            }
            entityBuilder.set("features", featuresBuilder.build());
        }

        // Save metadata
        if (workSheet.getMetadata() != null) {
            Metadata metadata = workSheet.getMetadata();
            FullEntity.Builder<IncompleteKey> metadataBuilder = FullEntity.newBuilder();

            metadataBuilder.set("id", metadata.getId());
            metadataBuilder.set("startingDate", metadata.getStartingDate());
            metadataBuilder.set("finishingDate", metadata.getFinishingDate());
            metadataBuilder.set("issueDate", metadata.getIssueDate());
            metadataBuilder.set("serviceProviderId", metadata.getServiceProviderId());
            metadataBuilder.set("awardDate", metadata.getAwardDate());
            metadataBuilder.set("issuingUserId", metadata.getIssuingUserId());

            // Save AIGP list
            if (metadata.getAigp() != null) {
                metadataBuilder.set("aigp", StringValue.newBuilder(metadata.getAigp().stream()
                        .collect(Collectors.joining(",")))
                        .setExcludeFromIndexes(true)
                        .build());
            }

            // Save POSA information
            metadataBuilder.set("posaCode", metadata.getPosaCode());
            metadataBuilder.set("posaDescription", metadata.getPosaDescription());

            // Save POSP information
            metadataBuilder.set("pospCode", metadata.getPospCode());
            metadataBuilder.set("pospDescription", metadata.getPospDescription());

            // Save operations as a nested entity
            if (metadata.getOperations() != null) {
                ListValue.Builder operationsBuilder = ListValue.newBuilder();
                for (Operation operation : metadata.getOperations()) {
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
                metadataBuilder.set("operations", operationsBuilder.build());
            }

            entityBuilder.set("metadata", metadataBuilder.build());
        }

        Entity workSheetEntity = entityBuilder.build();
        datastore.put(workSheetEntity);

        // Return the saved WorkSheet with the generated ID
        return new WorkSheet(
                workSheet.getType(),
                workSheet.getCrs(),
                workSheet.getFeatures(),
                workSheet.getMetadata());
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

            // Extract metadata
            Metadata metadata = null;
            if (workSheetEntity.contains("metadata")) {
                FullEntity<?> metadataEntity = workSheetEntity.getEntity("metadata");
                Long workSheetId = metadataEntity.getLong("id");
                String startingDate = metadataEntity.getString("startingDate");
                String finishingDate = metadataEntity.getString("finishingDate");
                String issueDate = metadataEntity.getString("issueDate");
                Long serviceProviderId = metadataEntity.getLong("serviceProviderId");
                String awardDate = metadataEntity.getString("awardDate");

                // Extract AIGP list
                List<String> aigp = null;
                if (metadataEntity.contains("aigp")) {
                    String aigpString = metadataEntity.getString("aigp");
                    if (aigpString != null && !aigpString.isEmpty()) {
                        aigp = Arrays.asList(aigpString.split(","));
                    }
                }

                // Extract operations
                List<WorkSheetListResponseDTO.OperationDTO> operations = new ArrayList<>();
                if (metadataEntity.contains("operations")) {
                    List<Value<?>> operationsList = metadataEntity.getList("operations");
                    for (Value<?> operationValue : operationsList) {
                        if (operationValue instanceof EntityValue) {
                            FullEntity<?> operationEntity = ((EntityValue) operationValue).get();
                            String operationCode = operationEntity.getString("operationCode");
                            String operationDescription = operationEntity.getString("operationDescription");
                            double areaHa = operationEntity.getDouble("areaHa");
                            operations.add(
                                    new WorkSheetListResponseDTO.OperationDTO(operationCode, operationDescription,
                                            areaHa));
                        }
                    }
                }

                WorkSheetListResponseDTO workSheet = new WorkSheetListResponseDTO(
                        workSheetId, aigp, startingDate, finishingDate, issueDate, awardDate, serviceProviderId,
                        operations);

                workSheets.add(workSheet);
            }
        }

        return workSheets;
    }
}