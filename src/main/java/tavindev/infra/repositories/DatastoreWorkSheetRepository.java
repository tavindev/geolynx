package tavindev.infra.repositories;

import com.google.cloud.datastore.*;
import org.jvnet.hk2.annotations.Service;
import tavindev.core.entities.WorkSheet;
import tavindev.core.entities.WorkSheet.TargetType;
import tavindev.core.entities.WorkSheet.AwardStatus;
import tavindev.core.entities.WorkSheet.WorkStatus;
import tavindev.core.repositories.WorkSheetRepository;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Optional;

@Service
public class DatastoreWorkSheetRepository implements WorkSheetRepository {
    private static final String WORK_SHEET_KIND = "WorkSheet";
    private final Datastore datastore = DatastoreManager.getInstance();
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ISO_LOCAL_DATE;

    @Override
    public WorkSheet save(WorkSheet workSheet) {
        KeyFactory keyFactory = datastore.newKeyFactory().setKind(WORK_SHEET_KIND);
        Key workSheetKey;
        
        if (workSheet.getId() == null) {
            workSheetKey = datastore.allocateId(keyFactory.newKey());
            workSheet.setId(workSheetKey.getName());
        } else {
            workSheetKey = keyFactory.newKey(workSheet.getId());
        }

        Entity workSheetEntity = Entity.newBuilder(workSheetKey)
            .set("referenciaObra", workSheet.getWorkReference())
            .set("descricao", workSheet.getDescription())
            .set("tipoAlvo", workSheet.getTargetType().name())
            .set("estadoAdjudicacao", workSheet.getAwardStatus().name())
            .set("dataAdjudicacao", workSheet.getAwardDate())
            .set("dataInicioPrevista", workSheet.getExpectedStartDate())
            .set("dataConclusaoPrevista", workSheet.getExpectedCompletionDate())
            .set("contaEntidade", workSheet.getEntityAccount())
            .set("entidadeAdjudicacao", workSheet.getAwardingEntity())
            .set("nifEmpresa", workSheet.getCompanyTaxId())
            .set("estadoObra", workSheet.getWorkStatus().name())
            .set("observacoes", workSheet.getObservations())
            .build();

        datastore.put(workSheetEntity);
        return workSheet;
    }

    private WorkSheet convertToWorkSheet(Entity entity) {
        String id = entity.getKey().getName();
        String workReference = entity.getString("referenciaObra");
        String description = entity.getString("descricao");
        TargetType targetType = TargetType.valueOf(entity.getString("tipoAlvo"));
        AwardStatus awardStatus = AwardStatus.valueOf(entity.getString("estadoAdjudicacao"));

        String awardDate = entity.getString("dataAdjudicacao");
        String startDateStr = entity.getString("dataInicioPrevista");
        String expectedCompletionDate = entity.getString("dataConclusaoPrevista");
        
        String entityAccount = entity.getString("contaEntidade");
        String awardingEntity = entity.getString("entidadeAdjudicacao");
        String companyTaxId = entity.getString("nifEmpresa");
        WorkStatus workStatus = WorkStatus.valueOf(entity.getString("estadoObra"));
        String observations = entity.getString("observacoes");

        return new WorkSheet(
            id,
            workReference,
            description,
            targetType,
            awardStatus,
            awardDate,
                startDateStr,
            expectedCompletionDate,
            entityAccount,
            awardingEntity,
            companyTaxId,
            workStatus,
            observations
        );
    }
} 