package tavindev.api.mappers;

import tavindev.core.entities.WorkSheet;
import tavindev.core.entities.WorkSheet.Operation;
import tavindev.core.entities.WorkSheet.Feature;
import tavindev.infra.dto.worksheet.CreateOrUpdateWorkSheetDTO;
import java.util.stream.Collectors;
import java.util.List;

public class WorkSheetMapper {
    public static WorkSheet toEntity(CreateOrUpdateWorkSheetDTO dto) {
        CreateOrUpdateWorkSheetDTO.MetadataDTO metadata = dto.getMetadata();
        return new WorkSheet(
                metadata.getId(),
                metadata.getStartingDate(),
                metadata.getFinishingDate(),
                metadata.getIssueDate(),
                metadata.getServiceProviderId(),
                metadata.getAwardDate(),
                metadata.getIssuingUserId(),
                metadata.getAigp(),
                metadata.getPosaCode(),
                metadata.getPosaDescription(),
                metadata.getPospCode(),
                metadata.getPospDescription(),
                metadata.getOperations().stream()
                        .map(op -> new Operation(
                                op.getOperationCode(),
                                op.getOperationDescription(),
                                op.getAreaHa()))
                        .collect(Collectors.toList()),
                dto.getFeatures().stream()
                        .map(f -> {
                            // Get the first ring of the polygon (outer ring)
                            List<List<Double>> coordinates = f.getGeometry().getCoordinates().get(0);
                            return new Feature(
                                    f.getProperties().getAigp(),
                                    f.getProperties().getRuralPropertyId(),
                                    f.getProperties().getPolygonId(),
                                    f.getProperties().getUiId(),
                                    coordinates);
                        })
                        .collect(Collectors.toList()));
    }
}