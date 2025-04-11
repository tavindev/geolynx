package tavindev.core.entities;

public class WorkSheet {
    private String id;
    private String workReference;
    private String description;
    private TargetType targetType;
    private AwardStatus awardStatus;
    private String awardDate;
    private String expectedStartDate;
    private String expectedCompletionDate;
    private String entityAccount;
    private String awardingEntity;
    private String companyTaxId;
    private WorkStatus workStatus;
    private String observations;

    public WorkSheet() {}

    public WorkSheet(String id, String workReference, String description, TargetType targetType,
                    AwardStatus awardStatus, String awardDate,
                    String expectedStartDate, String expectedCompletionDate,
                    String entityAccount, String awardingEntity, String companyTaxId,
                    WorkStatus workStatus, String observations) {
        this.id = id;
        this.workReference = workReference;
        this.description = description;
        this.targetType = targetType;
        this.awardStatus = awardStatus;
        this.awardDate = awardDate;
        this.expectedStartDate = expectedStartDate;
        this.expectedCompletionDate = expectedCompletionDate;
        this.entityAccount = entityAccount;
        this.awardingEntity = awardingEntity;
        this.companyTaxId = companyTaxId;
        this.workStatus = workStatus;
        this.observations = observations;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getWorkReference() {
        return workReference;
    }

    public String getDescription() {
        return description;
    }

    public TargetType getTargetType() {
        return targetType;
    }

    public AwardStatus getAwardStatus() {
        return awardStatus;
    }

    public String getAwardDate() {
        return awardDate;
    }

    public String getExpectedStartDate() {
        return expectedStartDate;
    }

    public String getExpectedCompletionDate() {
        return expectedCompletionDate;
    }

    public String getEntityAccount() {
        return entityAccount;
    }

    public String getAwardingEntity() {
        return awardingEntity;
    }

    public String getCompanyTaxId() {
        return companyTaxId;
    }

    public WorkStatus getWorkStatus() {
        return workStatus;
    }

    public String getObservations() {
        return observations;
    }

    public enum TargetType {
        PUBLIC_PROPERTY,
        PRIVATE_PROPERTY
    }

    public enum AwardStatus {
        AWARDED,
        NOT_AWARDED
    }

    public enum WorkStatus {
        NOT_STARTED,
        IN_PROGRESS,
        COMPLETED
    }
} 