package tavindev.infra.repositories;

import com.google.cloud.datastore.*;
import org.jvnet.hk2.annotations.Service;
import tavindev.core.entities.WorkSheet;
import tavindev.core.entities.WorkSheet.Operation;
import tavindev.core.entities.WorkSheet.Feature;
import tavindev.core.repositories.WorkSheetRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DatastoreWorkSheetRepository implements WorkSheetRepository {
    private static final String WORK_SHEET_KIND = "WorkSheet";
    private final Datastore datastore = DatastoreManager.getInstance();

    @Override
    public WorkSheet save(WorkSheet workSheet) {
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
        return workSheet;
    }

    @Override
    public boolean exists(Long id) {
        KeyFactory keyFactory = datastore.newKeyFactory().setKind(WORK_SHEET_KIND);
        Key workSheetKey = keyFactory.newKey(id);
        Entity workSheetEntity = datastore.get(workSheetKey);

        return workSheetEntity != null;
    }
}