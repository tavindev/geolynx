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