package tavindev.api.mappers;

import tavindev.core.entities.WorkSheet;
import tavindev.infra.dto.worksheet.CreateOrUpdateWorkSheetDTO;
import tavindev.infra.dto.worksheet.GeoJsonImportDTO;
import java.util.List;
import java.util.stream.Collectors;

public class WorkSheetMapper {
    public static WorkSheet toEntity(CreateOrUpdateWorkSheetDTO dto) {
        return new WorkSheet(
            dto.referencia_obra(),
            dto.descricao(),
            WorkSheet.TargetType.valueOf(dto.tipo_alvo().toUpperCase()),
            WorkSheet.AwardStatus.valueOf(dto.estado_adjudicacao().toUpperCase()),
            dto.data_adjudicacao() != null ? dto.data_adjudicacao() : null,
            dto.data_inicio_prevista() != null ? dto.data_inicio_prevista() : null,
            dto.data_conclusao_prevista() != null ? dto.data_conclusao_prevista() : null,
            dto.conta_entidade(),
            dto.entidade_adjudicacao(),
            dto.nif_empresa(),
            dto.estado_obra() != null ? WorkSheet.WorkStatus.valueOf(dto.estado_obra().toUpperCase()) : null,
            dto.observacoes()
        );
    }

    public static WorkSheet toEntity(GeoJsonImportDTO dto) {
        // Convert metadata and features to WorkSheet entity
        GeoJsonImportDTO.MetadataDTO metadata = dto.metadata();
        
        // Convert operations
        List<WorkSheet.Operation> operations = metadata.operations().stream()
            .map(op -> new WorkSheet.Operation(
                op.operation_code(),
                op.operation_description(),
                op.area_ha()
            ))
            .collect(Collectors.toList());

        // Convert features
        List<WorkSheet.Feature> features = dto.features().stream()
            .map(feature -> new WorkSheet.Feature(
                feature.type(),
                new WorkSheet.FeatureProperties(
                    feature.properties().aigp(),
                    feature.properties().rural_property_id(),
                    feature.properties().polygon_id(),
                    feature.properties().UI_id()
                ),
                new WorkSheet.Geometry(
                    feature.geometry().type(),
                    feature.geometry().coordinates()
                )
            ))
            .collect(Collectors.toList());

        // Create WorkSheet with extended constructor
        return new WorkSheet(
            // Traditional fields - use metadata id as reference for now
            "FOLHA_" + metadata.id(),
            "Folha de obra importada via GeoJSON",
            WorkSheet.TargetType.PROPRIEDADE_PUBLICA, // Default, can be updated later
            WorkSheet.AwardStatus.NAO_ADJUDICADO, // Default, can be updated later
            metadata.award_date(),
            metadata.starting_date(),
            metadata.finishing_date(),
            null, // conta_entidade - to be filled when adjudicated
            null, // entidade_adjudicacao - to be filled when adjudicated
            null, // nif_empresa - to be filled when adjudicated
            WorkSheet.WorkStatus.NAO_INICIADO, // Default status
            null, // observacoes
            // IMP-FO specific fields
            metadata.id(),
            metadata.starting_date(),
            metadata.finishing_date(),
            metadata.issue_date(),
            metadata.service_provider_id(),
            metadata.award_date(),
            metadata.issuing_user_id(),
            metadata.aigp(),
            metadata.posa_code(),
            metadata.posa_description(),
            metadata.posp_code(),
            metadata.posp_description(),
            operations,
            features
        );
    }
} 