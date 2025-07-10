package tavindev.core.entities;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class ExecutionSheet {
	private final Long id;
	private final String startingDate;
	private final String finishingDate;
	private final String lastActivityDate;
	private final String observations;
	private final List<Operation> operations;
	private final List<PolygonOperation> polygonsOperations;

	@JsonCreator
	public ExecutionSheet(@JsonProperty("id") Long id,
			@JsonProperty("starting_date") String startingDate,
			@JsonProperty("finishing_date") String finishingDate,
			@JsonProperty("last_activity_date") String lastActivityDate,
			@JsonProperty("observations") String observations,
			@JsonProperty("operations") List<Operation> operations,
			@JsonProperty("polygons_operations") List<PolygonOperation> polygonsOperations) {
		this.id = id;
		this.startingDate = startingDate;
		this.finishingDate = finishingDate;
		this.lastActivityDate = lastActivityDate;
		this.observations = observations;
		this.operations = operations;
		this.polygonsOperations = polygonsOperations;
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

	@JsonIgnoreProperties(ignoreUnknown = true)
	public static class Operation {
		private final String operationCode;
		private final Double areaHaExecuted;
		private final Double areaPerc;
		private final String startingDate;
		private final String finishingDate;
		private final String observations;

		@JsonCreator
		public Operation(@JsonProperty("operation_code") String operationCode,
				@JsonProperty("area_ha_executed") Double areaHaExecuted,
				@JsonProperty("area_perc") Double areaPerc,
				@JsonProperty("starting_date") String startingDate,
				@JsonProperty("finishing_date") String finishingDate,
				@JsonProperty("observations") String observations) {
			this.operationCode = operationCode;
			this.areaHaExecuted = areaHaExecuted;
			this.areaPerc = areaPerc;
			this.startingDate = startingDate;
			this.finishingDate = finishingDate;
			this.observations = observations;
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
	}

	@JsonIgnoreProperties(ignoreUnknown = true)
	public static class PolygonOperationDetail {
		private final Long operationId;
		private final String status;
		private final String startingDate;
		private final String finishingDate;
		private final String lastActivityDate;
		private final String observations;
		private final List<Track> tracks;
		private final Long operatorId;

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