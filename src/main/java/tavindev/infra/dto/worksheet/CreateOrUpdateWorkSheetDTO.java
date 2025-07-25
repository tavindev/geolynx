package tavindev.infra.dto.worksheet;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public class CreateOrUpdateWorkSheetDTO {
    private String type;
    private CRS crs;
    private List<FeatureDTO> features;
    private MetadataDTO metadata;

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public CRS getCrs() {
        return crs;
    }

    public void setCrs(CRS crs) {
        this.crs = crs;
    }

    public List<FeatureDTO> getFeatures() {
        return features;
    }

    public void setFeatures(List<FeatureDTO> features) {
        this.features = features;
    }

    public MetadataDTO getMetadata() {
        return metadata;
    }

    public void setMetadata(MetadataDTO metadata) {
        this.metadata = metadata;
    }

    public static class CRS {
        private String type;
        private CRSProperties properties;

        public String getType() {
            return type;
        }

        public void setType(String type) {
            this.type = type;
        }

        public CRSProperties getProperties() {
            return properties;
        }

        public void setProperties(CRSProperties properties) {
            this.properties = properties;
        }

        public static class CRSProperties {
            private String name;

            public String getName() {
                return name;
            }

            public void setName(String name) {
                this.name = name;
            }
        }
    }

    public static class FeatureDTO {
        private String type;
        private FeatureProperties properties;
        private Geometry geometry;

        public String getType() {
            return type;
        }

        public void setType(String type) {
            this.type = type;
        }

        public FeatureProperties getProperties() {
            return properties;
        }

        public void setProperties(FeatureProperties properties) {
            this.properties = properties;
        }

        public Geometry getGeometry() {
            return geometry;
        }

        public void setGeometry(Geometry geometry) {
            this.geometry = geometry;
        }

        public static class FeatureProperties {
            private String aigp;

            @JsonProperty("rural_property_id")
            private String ruralPropertyId;

            @JsonProperty("polygon_id")
            private int polygonId;

            @JsonProperty("UI_id")
            private int uiId;

            public String getAigp() {
                return aigp;
            }

            public void setAigp(String aigp) {
                this.aigp = aigp;
            }

            public String getRuralPropertyId() {
                return ruralPropertyId;
            }

            public void setRuralPropertyId(String ruralPropertyId) {
                this.ruralPropertyId = ruralPropertyId;
            }

            public int getPolygonId() {
                return polygonId;
            }

            public void setPolygonId(int polygonId) {
                this.polygonId = polygonId;
            }

            public int getUiId() {
                return uiId;
            }

            public void setUiId(int uiId) {
                this.uiId = uiId;
            }
        }

        public static class Geometry {
            private String type;
            private List<List<List<Double>>> coordinates;

            public String getType() {
                return type;
            }

            public void setType(String type) {
                this.type = type;
            }

            public List<List<List<Double>>> getCoordinates() {
                return coordinates;
            }

            public void setCoordinates(List<List<List<Double>>> coordinates) {
                this.coordinates = coordinates;
            }
        }
    }

    public static class MetadataDTO {
        private Long id;

        @JsonProperty("starting_date")
        private String startingDate;

        @JsonProperty("finishing_date")
        private String finishingDate;

        @JsonProperty("issue_date")
        private String issueDate;

        @JsonProperty("service_provider_id")
        private Long serviceProviderId;

        @JsonProperty("award_date")
        private String awardDate;

        @JsonProperty("issuing_user_id")
        private Long issuingUserId;

        private List<String> aigp;

        @JsonProperty("posa_code")
        private String posaCode;

        @JsonProperty("posa_description")
        private String posaDescription;

        @JsonProperty("posp_code")
        private String pospCode;

        @JsonProperty("posp_description")
        private String pospDescription;

        private List<OperationDTO> operations;

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getStartingDate() {
            return startingDate;
        }

        public void setStartingDate(String startingDate) {
            this.startingDate = startingDate;
        }

        public String getFinishingDate() {
            return finishingDate;
        }

        public void setFinishingDate(String finishingDate) {
            this.finishingDate = finishingDate;
        }

        public String getIssueDate() {
            return issueDate;
        }

        public void setIssueDate(String issueDate) {
            this.issueDate = issueDate;
        }

        public Long getServiceProviderId() {
            return serviceProviderId;
        }

        public void setServiceProviderId(Long serviceProviderId) {
            this.serviceProviderId = serviceProviderId;
        }

        public String getAwardDate() {
            return awardDate;
        }

        public void setAwardDate(String awardDate) {
            this.awardDate = awardDate;
        }

        public Long getIssuingUserId() {
            return issuingUserId;
        }

        public void setIssuingUserId(Long issuingUserId) {
            this.issuingUserId = issuingUserId;
        }

        public List<String> getAigp() {
            return aigp;
        }

        public void setAigp(List<String> aigp) {
            this.aigp = aigp;
        }

        public String getPosaCode() {
            return posaCode;
        }

        public void setPosaCode(String posaCode) {
            this.posaCode = posaCode;
        }

        public String getPosaDescription() {
            return posaDescription;
        }

        public void setPosaDescription(String posaDescription) {
            this.posaDescription = posaDescription;
        }

        public String getPospCode() {
            return pospCode;
        }

        public void setPospCode(String pospCode) {
            this.pospCode = pospCode;
        }

        public String getPospDescription() {
            return pospDescription;
        }

        public void setPospDescription(String pospDescription) {
            this.pospDescription = pospDescription;
        }

        public List<OperationDTO> getOperations() {
            return operations;
        }

        public void setOperations(List<OperationDTO> operations) {
            this.operations = operations;
        }
    }

    public static class OperationDTO {
        @JsonProperty("operation_code")
        private String operationCode;

        @JsonProperty("operation_description")
        private String operationDescription;

        @JsonProperty("area_ha")
        private double areaHa;

        public String getOperationCode() {
            return operationCode;
        }

        public void setOperationCode(String operationCode) {
            this.operationCode = operationCode;
        }

        public String getOperationDescription() {
            return operationDescription;
        }

        public void setOperationDescription(String operationDescription) {
            this.operationDescription = operationDescription;
        }

        public double getAreaHa() {
            return areaHa;
        }

        public void setAreaHa(double areaHa) {
            this.areaHa = areaHa;
        }
    }
}