package tavindev.api.mappers;

import tavindev.core.entities.WorkSheet;
import tavindev.infra.dto.worksheet.CreateOrUpdateWorkSheetDTO;

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
} 