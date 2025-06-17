package tavindev.infra.repositories;

import com.google.cloud.datastore.*;
import org.jvnet.hk2.annotations.Service;
import tavindev.api.mappers.WorkSheetMapper;
import tavindev.core.entities.WorkSheet;
import tavindev.core.entities.WorkSheet.TargetType;
import tavindev.core.entities.WorkSheet.AwardStatus;
import tavindev.core.entities.WorkSheet.WorkStatus;
import tavindev.core.repositories.WorkSheetRepository;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Optional;
import java.util.List;
import java.util.ArrayList;

@Service
public class DatastoreWorkSheetRepository implements WorkSheetRepository {
    private static final String WORK_SHEET_KIND = "WorkSheet";
    private final Datastore datastore = DatastoreManager.getInstance();
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ISO_LOCAL_DATE;

    @Override
    public WorkSheet save(WorkSheet workSheet) {
        KeyFactory keyFactory = datastore.newKeyFactory().setKind(WORK_SHEET_KIND);
        Key workSheetKey = keyFactory.newKey(workSheet.getReferenciaObra());

        Entity.Builder entityBuilder = Entity.newBuilder(workSheetKey);

        if (workSheet.getDescricao() != null) {
            entityBuilder.set("descricao", workSheet.getDescricao());
        }
        if (workSheet.getTipoAlvo() != null) {
            entityBuilder.set("tipoAlvo", workSheet.getTipoAlvo().name());
        }
        if (workSheet.getEstadoAdjudicacao() != null) {
            entityBuilder.set("estadoAdjudicacao", workSheet.getEstadoAdjudicacao().name());
        }
        if (workSheet.getDataAdjudicacao() != null) {
            entityBuilder.set("dataAdjudicacao", workSheet.getDataAdjudicacao());
        }
        if (workSheet.getDataInicioPrevista() != null) {
            entityBuilder.set("dataInicioPrevista", workSheet.getDataInicioPrevista());
        }
        if (workSheet.getDataConclusaoPrevista() != null) {
            entityBuilder.set("dataConclusaoPrevista", workSheet.getDataConclusaoPrevista());
        }
        if (workSheet.getContaEntidade() != null) {
            entityBuilder.set("contaEntidade", workSheet.getContaEntidade());
        }
        if (workSheet.getEntidadeAdjudicacao() != null) {
            entityBuilder.set("entidadeAdjudicacao", workSheet.getEntidadeAdjudicacao());
        }
        if (workSheet.getNifEmpresa() != null) {
            entityBuilder.set("nifEmpresa", workSheet.getNifEmpresa());
        }
        if (workSheet.getEstadoObra() != null) {
            entityBuilder.set("estadoObra", workSheet.getEstadoObra().name());
        }
        if (workSheet.getObservacoes() != null) {
            entityBuilder.set("observacoes", workSheet.getObservacoes());
        }

        if (workSheet.getId() != null) {
            entityBuilder.set("id", workSheet.getId());
        }
        if (workSheet.getStartingDate() != null) {
            entityBuilder.set("startingDate", workSheet.getStartingDate());
        }
        if (workSheet.getFinishingDate() != null) {
            entityBuilder.set("finishingDate", workSheet.getFinishingDate());
        }
        if (workSheet.getIssueDate() != null) {
            entityBuilder.set("issueDate", workSheet.getIssueDate());
        }
        if (workSheet.getServiceProviderId() != null) {
            entityBuilder.set("serviceProviderId", workSheet.getServiceProviderId());
        }
        if (workSheet.getAwardDate() != null) {
            entityBuilder.set("awardDate", workSheet.getAwardDate());
        }
        if (workSheet.getIssuingUserId() != null) {
            entityBuilder.set("issuingUserId", workSheet.getIssuingUserId());
        }
        if (workSheet.getAigp() != null && !workSheet.getAigp().isEmpty()) {
            entityBuilder.set("aigp", StringValue.newBuilder(String.join(",", workSheet.getAigp())).setExcludeFromIndexes(true).build());
        }
        if (workSheet.getPosaCode() != null) {
            entityBuilder.set("posaCode", workSheet.getPosaCode());
        }
        if (workSheet.getPosaDescription() != null) {
            entityBuilder.set("posaDescription", StringValue.newBuilder(workSheet.getPosaDescription()).setExcludeFromIndexes(true).build());
        }
        if (workSheet.getPospCode() != null) {
            entityBuilder.set("pospCode", workSheet.getPospCode());
        }
        if (workSheet.getPospDescription() != null) {
            entityBuilder.set("pospDescription", StringValue.newBuilder(workSheet.getPospDescription()).setExcludeFromIndexes(true).build());
        }

        if (workSheet.getOperations() != null && !workSheet.getOperations().isEmpty()) {
            StringBuilder operationsJson = new StringBuilder("[");
            for (int i = 0; i < workSheet.getOperations().size(); i++) {
                WorkSheet.Operation op = workSheet.getOperations().get(i);
                if (i > 0) operationsJson.append(",");
                operationsJson.append("{")
                    .append("\"operation_code\":\"").append(op.getOperationCode()).append("\",")
                    .append("\"operation_description\":\"").append(op.getOperationDescription()).append("\",")
                    .append("\"area_ha\":").append(op.getAreaHa())
                    .append("}");
            }
            operationsJson.append("]");
            entityBuilder.set("operations", StringValue.newBuilder(operationsJson.toString()).setExcludeFromIndexes(true).build());
        }

        if (workSheet.getFeatures() != null && !workSheet.getFeatures().isEmpty()) {
            StringBuilder featuresJson = new StringBuilder("[");
            for (int i = 0; i < workSheet.getFeatures().size(); i++) {
                WorkSheet.Feature feature = workSheet.getFeatures().get(i);
                if (i > 0) featuresJson.append(",");
                featuresJson.append("{")
                    .append("\"type\":\"").append(feature.getType()).append("\",")
                    .append("\"properties\":{")
                        .append("\"aigp\":\"").append(feature.getProperties().getAigp()).append("\",")
                        .append("\"rural_property_id\":\"").append(feature.getProperties().getRuralPropertyId()).append("\",")
                        .append("\"polygon_id\":").append(feature.getProperties().getPolygonId()).append(",")
                        .append("\"UI_id\":").append(feature.getProperties().getUiId())
                    .append("},")
                    .append("\"geometry\":{")
                        .append("\"type\":\"").append(feature.getGeometry().getType()).append("\",")
                        .append("\"coordinates\":").append(feature.getGeometry().getCoordinates().toString())
                    .append("}")
                    .append("}");
            }
            featuresJson.append("]");
            entityBuilder.set("features", StringValue.newBuilder(featuresJson.toString()).setExcludeFromIndexes(true).build());
        }

        Entity workSheetEntity = entityBuilder.build();
        datastore.put(workSheetEntity);
        return workSheet;
    }

    @Override
    public boolean exists(String id) {
        KeyFactory keyFactory = datastore.newKeyFactory().setKind(WORK_SHEET_KIND);
        Key workSheetKey = keyFactory.newKey(id);
        Entity workSheetEntity = datastore.get(workSheetKey);

        return workSheetEntity != null;
    }
} 