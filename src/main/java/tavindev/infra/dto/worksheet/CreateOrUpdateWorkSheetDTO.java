package tavindev.infra.dto.worksheet;

import java.time.LocalDate;

public record CreateOrUpdateWorkSheetDTO(
    String referencia_obra,
    String descricao,
    String tipo_alvo,
    String estado_adjudicacao,
    String data_adjudicacao,
    String data_inicio_prevista,
    String data_conclusao_prevista,
    String conta_entidade,
    String entidade_adjudicacao,
    String nif_empresa,
    String estado_obra,
    String observacoes
) {}