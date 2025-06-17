package tavindev.infra.dto.worksheet;

import java.util.List;

public record GeoJsonImportDTO(
    String type,
    CrsDTO crs,
    List<FeatureDTO> features,
    MetadataDTO metadata
) {
    public static record CrsDTO(
        String type,
        PropertiesDTO properties
    ) {
        public static record PropertiesDTO(
            String name
        ) {}
    }

    public static record FeatureDTO(
        String type,
        FeaturePropertiesDTO properties,
        GeometryDTO geometry
    ) {
        public static record FeaturePropertiesDTO(
            String aigp,
            String rural_property_id,
            Integer polygon_id,
            Integer UI_id
        ) {}

        public static record GeometryDTO(
            String type,
            Object coordinates
        ) {}
    }

    public static record MetadataDTO(
        Integer id,
        String starting_date,
        String finishing_date,
        String issue_date,
        Integer service_provider_id,
        String award_date,
        Integer issuing_user_id,
        List<String> aigp,
        String posa_code,
        String posa_description,
        String posp_code,
        String posp_description,
        List<OperationDTO> operations
    ) {
        public static record OperationDTO(
            String operation_code,
            String operation_description,
            Double area_ha
        ) {}
    }
}