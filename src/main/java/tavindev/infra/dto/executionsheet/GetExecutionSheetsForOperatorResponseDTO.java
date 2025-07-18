package tavindev.infra.dto.executionsheet;

import tavindev.core.entities.ExecutionSheet;
import java.util.List;

public record GetExecutionSheetsForOperatorResponseDTO(
    String message,
    List<ExecutionSheet> executionSheets) {
}