package tavindev.infra.dto.worksheet;

import jakarta.ws.rs.QueryParam;

public class WorksheetQueryFilters {
  @QueryParam("aigp")
  private String aigp;

  @QueryParam("serviceProviderId")
  private String serviceProviderId;

  @QueryParam("startingDate")
  private String startingDate;

  @QueryParam("finishingDate")
  private String finishingDate;

  @QueryParam("posaCode")
  private String posaCode;

  @QueryParam("pospCode")
  private String pospCode;

  @QueryParam("issuingUserId")
  private String issuingUserId;

  @QueryParam("issueDate")
  private String issueDate;

  // Getters and Setters
  public String getAigp() {
    return aigp;
  }

  public String getServiceProviderId() {
    return serviceProviderId;
  }

  public String getStartingDate() {
    return startingDate;
  }

  public String getFinishingDate() {
    return finishingDate;
  }

  public String getPosaCode() {
    return posaCode;
  }

  public String getPospCode() {
    return pospCode;
  }

  public String getIssuingUserId() {
    return issuingUserId;
  }

  public String getIssueDate() {
    return issueDate;
  }

  // settes
  public void setServiceProviderId(String serviceProviderId) {
    this.serviceProviderId = serviceProviderId;
  }

}