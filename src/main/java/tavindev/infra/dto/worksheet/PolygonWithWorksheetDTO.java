package tavindev.infra.dto.worksheet;

import tavindev.core.entities.WorkSheet;

public record PolygonWithWorksheetDTO(
        WorkSheet.GeoFeature polygon,
        WorksheetMetadataDTO worksheetMetadata) {
    
    public record WorksheetMetadataDTO(
            Long worksheetId,
            String startingDate,
            String finishingDate,
            Long serviceProviderId,
            String posaCode,
            String posaDescription) {
    }
}