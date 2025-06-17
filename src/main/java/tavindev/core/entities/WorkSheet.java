package tavindev.core.entities;

import java.util.List;
import java.util.UUID;
import tavindev.core.exceptions.BadRequestException;

public class WorkSheet {
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
    private final List<Feature> features;

    public WorkSheet(Long id, String startingDate, String finishingDate, String issueDate,
            Long serviceProviderId, String awardDate, Long issuingUserId,
            List<String> aigp, String posaCode, String posaDescription,
            String pospCode, String pospDescription, List<Operation> operations,
            List<Feature> features) {
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
        this.features = features;
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

    public List<Feature> getFeatures() {
        return features;
    }

    public static class Operation {
        private final String operationCode;
        private final String operationDescription;
        private final double areaHa;

        public Operation(String operationCode, String operationDescription, double areaHa) {
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

    public static class Feature {
        private final String aigp;
        private final String ruralPropertyId;
        private final int polygonId;
        private final int uiId;
        private final List<List<Double>> coordinates;

        public Feature(String aigp, String ruralPropertyId, int polygonId, int uiId, List<List<Double>> coordinates) {
            this.aigp = aigp;
            this.ruralPropertyId = ruralPropertyId;
            this.polygonId = polygonId;
            this.uiId = uiId;
            this.coordinates = coordinates;
        }

        public String getAigp() {
            return aigp;
        }

        public String getRuralPropertyId() {
            return ruralPropertyId;
        }

        public int getPolygonId() {
            return polygonId;
        }

        public int getUiId() {
            return uiId;
        }

        public List<List<Double>> getCoordinates() {
            return coordinates;
        }
    }
}