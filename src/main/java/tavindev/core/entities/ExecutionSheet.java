package tavindev.core.entities;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class ExecutionSheet {
	private final Long id;
	private final Long workSheetId; // ID da folha de obra associada
	private final String startingDate;
	private final String finishingDate;
	private String lastActivityDate;
	private final String observations;
	private final List<Operation> operations;
	private final List<PolygonOperation> polygonsOperations;

	@JsonCreator
	public ExecutionSheet(@JsonProperty("id") Long id,
			@JsonProperty("work_sheet_id") Long workSheetId,
			@JsonProperty("starting_date") String startingDate,
			@JsonProperty("finishing_date") String finishingDate,
			@JsonProperty("last_activity_date") String lastActivityDate,
			@JsonProperty("observations") String observations,
			@JsonProperty("operations") List<Operation> operations,
			@JsonProperty("polygons_operations") List<PolygonOperation> polygonsOperations) {
		this.id = id;
		this.workSheetId = workSheetId;
		this.startingDate = startingDate;
		this.finishingDate = finishingDate;
		this.lastActivityDate = lastActivityDate;
		this.observations = observations;
		this.operations = operations;
		this.polygonsOperations = polygonsOperations;

		if (workSheetId == null) {
			throw new IllegalArgumentException("Folha de execução deve estar associada a uma folha de obra");
		}
	}

	// Getters
	public Long getId() {
		return id;
	}

	public Long getWorkSheetId() {
		return workSheetId;
	}

	public String getStartingDate() {
		return startingDate;
	}

	public String getFinishingDate() {
		return finishingDate;
	}

	public String getLastActivityDate() {
		return lastActivityDate;
	}

	public String getObservations() {
		return observations;
	}

	public List<Operation> getOperations() {
		return operations;
	}

	public List<PolygonOperation> getPolygonsOperations() {
		return polygonsOperations;
	}

	// Business Logic Methods

	/**
	 * Assigns an operation in a polygon to an operator
	 */
	public void assignOperationToOperator(Long polygonId, Long operationId, Long operatorId) {
		PolygonOperationDetail operationDetail = findOperationDetail(polygonId, operationId);
		if (operationDetail == null) {
			throw new IllegalArgumentException("Operação não encontrada na parcela especificada");
		}

		// Update the operation detail with operator assigned
		updateOperationDetail(polygonId, operationId, operationDetail.withStatus("assigned").withOperatorId(operatorId));
	}

	/**
	 * Starts an activity for an operation in a polygon
	 */
	public void startActivity(Long polygonId, Long operationId, String operatorId) {
		PolygonOperationDetail operationDetail = findOperationDetail(polygonId, operationId);
		if (operationDetail == null) {
			throw new IllegalArgumentException("Operação não encontrada na parcela especificada");
		}

		// Validate operator assignment
		validateOperatorAssignment(operationDetail, operatorId);

		// Validate status
		if (!"assigned".equals(operationDetail.getStatus())) {
			throw new IllegalArgumentException("Apenas operações com status 'assigned' podem ser iniciadas");
		}

		String currentDate = LocalDate.now().toString();

		// Update the operation detail with activity started
		updateOperationDetail(polygonId, operationId,
				operationDetail.withStatus("ongoing")
						.withStartingDate(currentDate)
						.withLastActivityDate(currentDate));

		// Update execution sheet last activity date
		this.lastActivityDate = currentDate;
	}

	/**
	 * Stops an activity for an operation in a polygon
	 */
	public void stopActivity(Long polygonId, Long operationId, String operatorId) {
		PolygonOperationDetail operationDetail = findOperationDetail(polygonId, operationId);
		if (operationDetail == null) {
			throw new IllegalArgumentException("Operação não encontrada na parcela especificada");
		}

		// Validate operator assignment
		validateOperatorAssignment(operationDetail, operatorId);

		// Validate status
		if (!"ongoing".equals(operationDetail.getStatus())) {
			throw new IllegalArgumentException("Apenas operações com status 'ongoing' podem ser paradas");
		}

		String currentDate = LocalDate.now().toString();

		// Update the operation detail with activity stopped
		updateOperationDetail(polygonId, operationId,
				operationDetail.withStatus("completed")
						.withFinishingDate(currentDate)
						.withLastActivityDate(currentDate));

		// Update execution sheet last activity date
		this.lastActivityDate = currentDate;
	}

	/**
	 * Validates that an operation is assigned to the specified operator
	 */
	public void validateOperatorAssignment(PolygonOperationDetail operationDetail, String operatorId) {
		if (operationDetail.getOperatorId() == null) {
			throw new IllegalArgumentException("Operação não está atribuída a nenhum operador");
		}

		if (!operationDetail.getOperatorId().toString().equals(operatorId)) {
			throw new IllegalArgumentException("Apenas o operador atribuído pode executar esta operação");
		}
	}

	/**
	 * Finds an operation detail by polygon and operation IDs
	 */
	public PolygonOperationDetail findOperationDetail(Long polygonId, Long operationId) {
		for (PolygonOperation polygonOperation : polygonsOperations) {
			if (polygonOperation.getPolygonId().equals(polygonId)) {
				for (PolygonOperationDetail operationDetail : polygonOperation.getOperations()) {
					if (operationDetail.getOperationId().equals(operationId)) {
						return operationDetail;
					}
				}
			}
		}
		return null;
	}

	/**
	 * Gets the global status of an operation across all polygons
	 */
	public GlobalOperationStatus getGlobalOperationStatus(Long operationId) {
		List<PolygonOperationInfo> operationInfos = new ArrayList<>();

		// Find all instances of this operation across all polygons
		for (PolygonOperation polygonOperation : polygonsOperations) {
			for (PolygonOperationDetail operationDetail : polygonOperation.getOperations()) {
				if (operationDetail.getOperationId().equals(operationId)) {
					operationInfos.add(new PolygonOperationInfo(polygonOperation.getPolygonId(), operationDetail));
				}
			}
		}

		if (operationInfos.isEmpty()) {
			throw new IllegalArgumentException("Operação não encontrada em nenhuma parcela");
		}

		// Calculate global status based on individual statuses
		String globalStatus = calculateGlobalStatus(operationInfos.stream()
				.map(info -> info.operationDetail)
				.toList());

		// Find the operation code from the operations list
		String operationCode = findOperationCode(operationId);

		return new GlobalOperationStatus(operationCode, globalStatus, operationInfos);
	}

	/**
	 * Calculates the global status based on individual operation statuses
	 */
	private String calculateGlobalStatus(List<PolygonOperationDetail> operationDetails) {
		boolean hasUnassigned = false;
		boolean hasAssigned = false;
		boolean hasOngoing = false;
		boolean hasCompleted = false;

		for (PolygonOperationDetail detail : operationDetails) {
			switch (detail.getStatus()) {
				case "unassigned":
					hasUnassigned = true;
					break;
				case "assigned":
					hasAssigned = true;
					break;
				case "ongoing":
					hasOngoing = true;
					break;
				case "completed":
					hasCompleted = true;
					break;
			}
		}

		// Determine global status based on priority
		if (hasOngoing) {
			return "ongoing";
		} else if (hasAssigned) {
			return "assigned";
		} else if (hasCompleted && !hasUnassigned) {
			return "completed";
		} else if (hasUnassigned) {
			return "unassigned";
		} else {
			return "unknown";
		}
	}

	/**
	 * Finds the operation code for a given operation ID
	 */
	private String findOperationCode(Long operationId) {
		// This would need to be implemented based on how operation codes are stored
		// For now, return a placeholder
		return "OP-" + operationId;
	}

	/**
	 * Edits operation data (planned completion date, estimated duration,
	 * observations)
	 */
	public void editOperation(Long operationId, String plannedCompletionDate, Integer estimatedDurationHours,
			String observations) {
		// Find the operation in the operations list
		Operation operation = findOperation(operationId);
		if (operation == null) {
			throw new IllegalArgumentException("Operação não encontrada");
		}

		// Update the operation with new data
		updateOperation(operationId, operation.withPlannedCompletionDate(plannedCompletionDate)
				.withEstimatedDurationHours(estimatedDurationHours)
				.withObservations(observations));
	}

	/**
	 * Finds an operation by operation ID
	 */
	private Operation findOperation(Long operationId) {
		// This is a simplified implementation - in a real scenario,
		// you might need to map operationId to operationCode or have a different
		// structure
		for (Operation operation : operations) {
			// For now, we'll use a placeholder logic
			// In reality, you'd need to establish a proper mapping between operationId and
			// operation
			if (operation.getOperationCode().equals("OP-" + operationId)) {
				return operation;
			}
		}
		return null;
	}

	/**
	 * Updates an operation in the operations list
	 */
	private void updateOperation(Long operationId, Operation updatedOperation) {
		for (int i = 0; i < operations.size(); i++) {
			Operation operation = operations.get(i);
			if (operation.getOperationCode().equals("OP-" + operationId)) {
				operations.set(i, updatedOperation);
				return;
			}
		}
	}

	/**
	 * Prepares the execution sheet for export in the format expected by LAND IT
	 * This ensures all data is in the correct format and structure
	 */
	public ExecutionSheet prepareForExport() {
		// The current ExecutionSheet structure already matches the export schema
		// This method can be used to add any export-specific transformations if needed
		// For now, we return the execution sheet as-is since it's already in the
		// correct format
		return this;
	}

	/**
	 * Data class for polygon operation information
	 */
	public static class PolygonOperationInfo {
		private final Long polygonId;
		private final PolygonOperationDetail operationDetail;

		public PolygonOperationInfo(Long polygonId, PolygonOperationDetail operationDetail) {
			this.polygonId = polygonId;
			this.operationDetail = operationDetail;
		}

		public Long getPolygonId() {
			return polygonId;
		}

		public PolygonOperationDetail getOperationDetail() {
			return operationDetail;
		}
	}

	/**
	 * Data class for global operation status
	 */
	public static class GlobalOperationStatus {
		private final String operationCode;
		private final String globalStatus;
		private final List<PolygonOperationInfo> operationInfos;

		public GlobalOperationStatus(String operationCode, String globalStatus, List<PolygonOperationInfo> operationInfos) {
			this.operationCode = operationCode;
			this.globalStatus = globalStatus;
			this.operationInfos = operationInfos;
		}

		public String getOperationCode() {
			return operationCode;
		}

		public String getGlobalStatus() {
			return globalStatus;
		}

		public List<PolygonOperationInfo> getOperationInfos() {
			return operationInfos;
		}
	}

	/**
	 * Updates an operation detail in the execution sheet
	 */
	private void updateOperationDetail(Long polygonId, Long operationId, PolygonOperationDetail updatedOperationDetail) {
		for (PolygonOperation polygonOperation : polygonsOperations) {
			if (polygonOperation.getPolygonId().equals(polygonId)) {
				polygonOperation.updateOperation(operationId, updatedOperationDetail);
				return;
			}
		}
	}

	@JsonIgnoreProperties(ignoreUnknown = true)
	public static class Operation {
		private final String operationCode;
		private final Double areaHaExecuted;
		private final Double areaPerc;
		private final String startingDate;
		private final String finishingDate;
		private String observations;
		private String plannedCompletionDate;
		private Integer estimatedDurationHours;

		@JsonCreator
		public Operation(@JsonProperty("operation_code") String operationCode,
				@JsonProperty("area_ha_executed") Double areaHaExecuted,
				@JsonProperty("area_perc") Double areaPerc,
				@JsonProperty("starting_date") String startingDate,
				@JsonProperty("finishing_date") String finishingDate,
				@JsonProperty("observations") String observations,
				@JsonProperty("planned_completion_date") String plannedCompletionDate,
				@JsonProperty("estimated_duration_hours") Integer estimatedDurationHours) {
			this.operationCode = operationCode;
			this.areaHaExecuted = areaHaExecuted;
			this.areaPerc = areaPerc;
			this.startingDate = startingDate;
			this.finishingDate = finishingDate;
			this.observations = observations;
			this.plannedCompletionDate = plannedCompletionDate;
			this.estimatedDurationHours = estimatedDurationHours;
		}

		public String getOperationCode() {
			return operationCode;
		}

		public Double getAreaHaExecuted() {
			return areaHaExecuted;
		}

		public Double getAreaPerc() {
			return areaPerc;
		}

		public String getStartingDate() {
			return startingDate;
		}

		public String getFinishingDate() {
			return finishingDate;
		}

		public String getObservations() {
			return observations;
		}

		public String getPlannedCompletionDate() {
			return plannedCompletionDate;
		}

		public Integer getEstimatedDurationHours() {
			return estimatedDurationHours;
		}

		// Update methods for immutability pattern
		public Operation withObservations(String observations) {
			this.observations = observations;
			return this;
		}

		public Operation withPlannedCompletionDate(String plannedCompletionDate) {
			this.plannedCompletionDate = plannedCompletionDate;
			return this;
		}

		public Operation withEstimatedDurationHours(Integer estimatedDurationHours) {
			this.estimatedDurationHours = estimatedDurationHours;
			return this;
		}
	}

	@JsonIgnoreProperties(ignoreUnknown = true)
	public static class PolygonOperation {
		private final Long polygonId;
		private final List<PolygonOperationDetail> operations;

		@JsonCreator
		public PolygonOperation(@JsonProperty("polygon_id") Long polygonId,
				@JsonProperty("operations") List<PolygonOperationDetail> operations) {
			this.polygonId = polygonId;
			this.operations = operations;
		}

		public Long getPolygonId() {
			return polygonId;
		}

		public List<PolygonOperationDetail> getOperations() {
			return operations;
		}

		/**
		 * Updates an operation in this polygon
		 */
		public void updateOperation(Long operationId, PolygonOperationDetail updatedOperation) {
			for (int i = 0; i < operations.size(); i++) {
				if (operations.get(i).getOperationId().equals(operationId)) {
					operations.set(i, updatedOperation);
					return;
				}
			}
		}
	}

	@JsonIgnoreProperties(ignoreUnknown = true)
	public static class PolygonOperationDetail {
		private final Long operationId;
		private String status;
		private String startingDate;
		private String finishingDate;
		private String lastActivityDate;
		private String observations;
		private final List<Track> tracks;
		private Long operatorId;

		@JsonCreator
		public PolygonOperationDetail(@JsonProperty("operation_id") Long operationId,
				@JsonProperty("status") String status,
				@JsonProperty("starting_date") String startingDate,
				@JsonProperty("finishing_date") String finishingDate,
				@JsonProperty("last_activity_date") String lastActivityDate,
				@JsonProperty("observations") String observations,
				@JsonProperty("tracks") List<Track> tracks,
				@JsonProperty("operator_id") Long operatorId) {
			this.operationId = operationId;
			this.status = status;
			this.startingDate = startingDate;
			this.finishingDate = finishingDate;
			this.lastActivityDate = lastActivityDate;
			this.observations = observations;
			this.tracks = tracks;
			this.operatorId = operatorId;
		}

		public Long getOperationId() {
			return operationId;
		}

		public String getStatus() {
			return status;
		}

		public String getStartingDate() {
			return startingDate;
		}

		public String getFinishingDate() {
			return finishingDate;
		}

		public String getLastActivityDate() {
			return lastActivityDate;
		}

		public String getObservations() {
			return observations;
		}

		public List<Track> getTracks() {
			return tracks;
		}

		public Long getOperatorId() {
			return operatorId;
		}

		// Update methods for immutability pattern
		public PolygonOperationDetail withStatus(String status) {
			this.status = status;
			return this;
		}

		public PolygonOperationDetail withStartingDate(String startingDate) {
			this.startingDate = startingDate;
			return this;
		}

		public PolygonOperationDetail withFinishingDate(String finishingDate) {
			this.finishingDate = finishingDate;
			return this;
		}

		public PolygonOperationDetail withLastActivityDate(String lastActivityDate) {
			this.lastActivityDate = lastActivityDate;
			return this;
		}

		public PolygonOperationDetail withOperatorId(Long operatorId) {
			this.operatorId = operatorId;
			return this;
		}
	}

	@JsonIgnoreProperties(ignoreUnknown = true)
	public static class Track {
		private final String type;
		private final List<List<Double>> coordinates;

		@JsonCreator
		public Track(@JsonProperty("type") String type,
				@JsonProperty("coordinates") List<List<Double>> coordinates) {
			this.type = type;
			this.coordinates = coordinates;
		}

		public String getType() {
			return type;
		}

		public List<List<Double>> getCoordinates() {
			return coordinates;
		}
	}
}