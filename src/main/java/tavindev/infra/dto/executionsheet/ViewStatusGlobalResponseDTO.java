package tavindev.infra.dto.executionsheet;

import java.util.List;

public record ViewStatusGlobalResponseDTO(
                String message,
                String operationCode,
                String globalStatus,
                List<PolygonStatus> polygonStatuses) {
        public record PolygonStatus(
                        Long polygonId,
                        String status,
                        String startingDate,
                        String finishingDate,
                        String lastActivityDate,
                        String observations,
                        String operatorId) {
        }
}