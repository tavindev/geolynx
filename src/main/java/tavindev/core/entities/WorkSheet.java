package tavindev.core.entities;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class WorkSheet {
    private final String type;
    private final CRS crs;
    private final List<GeoFeature> features;
    private final Metadata metadata;
    private String geohash;

    @JsonCreator
    public WorkSheet(@JsonProperty("type") String type,
            @JsonProperty("crs") CRS crs,
            @JsonProperty("features") List<GeoFeature> features,
            @JsonProperty("metadata") Metadata metadata) {
        this.type = type;
        this.crs = crs;
        this.features = features;
        this.metadata = metadata;
    }

    // Getters
    public String getType() {
        return type;
    }

    public CRS getCrs() {
        return crs;
    }

    public List<GeoFeature> getFeatures() {
        return features;
    }

    public Metadata getMetadata() {
        return metadata;
    }

    public String getGeohash() {
        return geohash;
    }

    public void setGeohash(String geohash) {
        this.geohash = geohash;
    }

    @JsonIgnore
    public double[] getFirstPoint() {
        if (features == null || features.isEmpty()) {
            return new double[] { 0.0, 0.0 };
        }

        for (GeoFeature feature : features) {
            if (feature.getGeometry() != null && feature.getGeometry().getCoordinates() != null) {
                List<List<List<Double>>> coordinates = feature.getGeometry().getCoordinates();

                for (List<List<Double>> ring : coordinates) {
                    for (List<Double> point : ring) {
                        if (point.size() >= 2) {
                            return new double[] { point.get(1), point.get(0) }; // lat, lng
                        }
                    }
                }
            }
        }

        return new double[] { 0.0, 0.0 }; // Default to null island if no valid coordinates
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class CRS {
        private final String type;
        private final CRSProperties properties;

        @JsonCreator
        public CRS(@JsonProperty("type") String type,
                @JsonProperty("properties") CRSProperties properties) {
            this.type = type;
            this.properties = properties;
        }

        public String getType() {
            return type;
        }

        public CRSProperties getProperties() {
            return properties;
        }

        @JsonIgnoreProperties(ignoreUnknown = true)
        public static class CRSProperties {
            private final String name;

            @JsonCreator
            public CRSProperties(@JsonProperty("name") String name) {
                this.name = name;
            }

            public String getName() {
                return name;
            }
        }
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class GeoFeature {
        private final String type;
        private final FeatureProperties properties;
        private final Geometry geometry;

        @JsonCreator
        public GeoFeature(@JsonProperty("type") String type,
                @JsonProperty("properties") FeatureProperties properties,
                @JsonProperty("geometry") Geometry geometry) {
            this.type = type;
            this.properties = properties;
            this.geometry = geometry;
        }

        public String getType() {
            return type;
        }

        public FeatureProperties getProperties() {
            return properties;
        }

        public Geometry getGeometry() {
            return geometry;
        }

        @JsonIgnoreProperties(ignoreUnknown = true)
        public static class FeatureProperties {
            private final Long id;
            private final String ruralPropertyId;
            private final Long polygonId;
            private final Long uiId;
            private final String aigp;

            @JsonCreator
            public FeatureProperties(
                    @JsonProperty("id") Long id,
                    @JsonProperty("rural_property_id") String ruralPropertyId,
                    @JsonProperty("polygon_id") Long polygonId,
                    @JsonProperty("ui_id") Long uiId,
                    @JsonProperty("aigp") String aigp) {
                this.id = id;
                this.ruralPropertyId = ruralPropertyId;
                this.polygonId = polygonId;
                this.uiId = uiId;
                this.aigp = aigp;
            }

            public Long getId() {
                return id;
            }

            public String getRuralPropertyId() {
                return ruralPropertyId;
            }

            public Long getPolygonId() {
                return polygonId;
            }

            public Long getUiId() {
                return uiId;
            }

            public String getAigp() {
                return aigp;
            }
        }

        @JsonIgnoreProperties(ignoreUnknown = true)
        public static class Geometry {
            private final String type;
            private final List<List<List<Double>>> coordinates;

            @JsonCreator
            public Geometry(@JsonProperty("type") String type,
                    @JsonProperty("coordinates") List<List<List<Double>>> coordinates) {
                this.type = type;
                this.coordinates = coordinates;
            }

            public String getType() {
                return type;
            }

            public List<List<List<Double>>> getCoordinates() {
                return coordinates;
            }
        }
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Metadata {
        private final Long id;
        private final String startingDate;
        private final String finishingDate;
        private final String issueDate;
        private final Long serviceProviderId;
        private final String awardDate;
        private final Long issuingUserId;
        private final List<String> aigp;
        private final String posaCode;
        private final String posaDescription;
        private final String pospCode;
        private final String pospDescription;
        private final List<Operation> operations;

        @JsonCreator
        public Metadata(@JsonProperty("id") Long id,
                @JsonProperty("starting_date") String startingDate,
                @JsonProperty("finishing_date") String finishingDate,
                @JsonProperty("issue_date") String issueDate,
                @JsonProperty("service_provider_id") Long serviceProviderId,
                @JsonProperty("award_date") String awardDate,
                @JsonProperty("issuing_user_id") Long issuingUserId,
                @JsonProperty("aigp") List<String> aigp,
                @JsonProperty("posa_code") String posaCode,
                @JsonProperty("posa_description") String posaDescription,
                @JsonProperty("posp_code") String pospCode,
                @JsonProperty("posp_description") String pospDescription,
                @JsonProperty("operations") List<Operation> operations) {
            this.id = id;
            this.startingDate = startingDate;
            this.finishingDate = finishingDate;
            this.issueDate = issueDate;
            this.serviceProviderId = serviceProviderId;
            this.awardDate = awardDate;
            this.issuingUserId = issuingUserId;
            this.aigp = aigp;
            this.posaCode = posaCode;
            this.posaDescription = posaDescription;
            this.pospCode = pospCode;
            this.pospDescription = pospDescription;
            this.operations = operations;
        }

        // Getters
        public Long getId() {
            return id;
        }

        public String getStartingDate() {
            return startingDate;
        }

        public String getFinishingDate() {
            return finishingDate;
        }

        public String getIssueDate() {
            return issueDate;
        }

        public Long getServiceProviderId() {
            return serviceProviderId;
        }

        public String getAwardDate() {
            return awardDate;
        }

        public Long getIssuingUserId() {
            return issuingUserId;
        }

        public List<String> getAigp() {
            return aigp;
        }

        public String getPosaCode() {
            return posaCode;
        }

        public String getPosaDescription() {
            return posaDescription;
        }

        public String getPospCode() {
            return pospCode;
        }

        public String getPospDescription() {
            return pospDescription;
        }

        public List<Operation> getOperations() {
            return operations;
        }
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Operation {
        private final String operationCode;
        private final String operationDescription;
        private final double areaHa;

        @JsonCreator
        public Operation(@JsonProperty("operation_code") String operationCode,
                @JsonProperty("operation_description") String operationDescription,
                @JsonProperty("area_ha") double areaHa) {
            this.operationCode = operationCode;
            this.operationDescription = operationDescription;
            this.areaHa = areaHa;
        }

        public String getOperationCode() {
            return operationCode;
        }

        public String getOperationDescription() {
            return operationDescription;
        }

        public double getAreaHa() {
            return areaHa;
        }
    }
}