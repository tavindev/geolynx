package tavindev.infra.repositories;

import com.google.cloud.datastore.*;
import org.jvnet.hk2.annotations.Service;
import tavindev.core.entities.ExecutionSheet;
import tavindev.core.entities.ExecutionSheet.Operation;
import tavindev.core.entities.ExecutionSheet.PolygonOperation;
import tavindev.core.entities.ExecutionSheet.PolygonOperationDetail;
import tavindev.core.entities.ExecutionSheet.Track;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ExecutionSheetRepository {
	private static final String EXECUTION_SHEET_KIND = "ExecutionSheet";
	private final Datastore datastore = DatastoreManager.getInstance();

	public ExecutionSheet get(Long id) {
		KeyFactory keyFactory = datastore.newKeyFactory().setKind(EXECUTION_SHEET_KIND);
		Key executionSheetKey = keyFactory.newKey(id);
		Entity executionSheetEntity = datastore.get(executionSheetKey);

		if (executionSheetEntity == null) {
			return null;
		}

		// Extract basic fields
		String startingDate = executionSheetEntity.getString("startingDate");
		String finishingDate = executionSheetEntity.getString("finishingDate");
		String lastActivityDate = executionSheetEntity.getString("lastActivityDate");
		String observations = executionSheetEntity.getString("observations");

		// Extract operations
		List<Operation> operations = new ArrayList<>();
		if (executionSheetEntity.contains("operations")) {
			List<Value<?>> operationsList = executionSheetEntity.getList("operations");
			for (Value<?> operationValue : operationsList) {
				if (operationValue instanceof EntityValue) {
					FullEntity<?> operationEntity = ((EntityValue) operationValue).get();
					String operationCode = operationEntity.getString("operationCode");
					Double areaHaExecuted = operationEntity.contains("areaHaExecuted")
							? operationEntity.getDouble("areaHaExecuted")
							: null;
					Double areaPerc = operationEntity.contains("areaPerc") ? operationEntity.getDouble("areaPerc") : null;
					String opStartingDate = operationEntity.getString("startingDate");
					String opFinishingDate = operationEntity.getString("finishingDate");
					String opObservations = operationEntity.getString("observations");

					operations.add(new Operation(operationCode, areaHaExecuted, areaPerc,
							opStartingDate, opFinishingDate, opObservations));
				}
			}
		}

		// Extract polygon operations
		List<PolygonOperation> polygonsOperations = new ArrayList<>();
		if (executionSheetEntity.contains("polygonsOperations")) {
			List<Value<?>> polygonsList = executionSheetEntity.getList("polygonsOperations");
			for (Value<?> polygonValue : polygonsList) {
				if (polygonValue instanceof EntityValue) {
					FullEntity<?> polygonEntity = ((EntityValue) polygonValue).get();
					Long polygonId = polygonEntity.getLong("polygonId");

					List<PolygonOperationDetail> polygonOperations = new ArrayList<>();
					if (polygonEntity.contains("operations")) {
						List<Value<?>> polygonOperationsList = polygonEntity.getList("operations");
						for (Value<?> polygonOpValue : polygonOperationsList) {
							if (polygonOpValue instanceof EntityValue) {
								FullEntity<?> polygonOpEntity = ((EntityValue) polygonOpValue).get();
								Long operationId = polygonOpEntity.getLong("operationId");
								String status = polygonOpEntity.getString("status");
								String podStartingDate = polygonOpEntity.getString("startingDate");
								String podFinishingDate = polygonOpEntity.contains("finishingDate")
										? polygonOpEntity.getString("finishingDate")
										: null;
								String podLastActivityDate = polygonOpEntity.getString("lastActivityDate");
								String podObservations = polygonOpEntity.getString("observations");
								Long operatorId = polygonOpEntity.contains("operatorId") ? polygonOpEntity.getLong("operatorId") : null;

								// Extract tracks
								List<Track> tracks = new ArrayList<>();
								if (polygonOpEntity.contains("tracks")) {
									List<Value<?>> tracksList = polygonOpEntity.getList("tracks");
									for (Value<?> trackValue : tracksList) {
										if (trackValue instanceof EntityValue) {
											FullEntity<?> trackEntity = ((EntityValue) trackValue).get();
											String type = trackEntity.getString("type");
											List<List<Double>> coordinates = parseCoordinates(trackEntity.getString("coordinates"));
											tracks.add(new Track(type, coordinates));
										}
									}
								}

								polygonOperations.add(new PolygonOperationDetail(operationId, status,
										podStartingDate, podFinishingDate, podLastActivityDate, podObservations, tracks, operatorId));
							}
						}
					}

					polygonsOperations.add(new PolygonOperation(polygonId, polygonOperations));
				}
			}
		}

		return new ExecutionSheet(id, startingDate, finishingDate, lastActivityDate,
				observations, operations, polygonsOperations);
	}

	public ExecutionSheet save(ExecutionSheet executionSheet) {
		KeyFactory keyFactory = datastore.newKeyFactory().setKind(EXECUTION_SHEET_KIND);
		Key executionSheetKey = keyFactory.newKey(executionSheet.getId());

		Entity.Builder entityBuilder = Entity.newBuilder(executionSheetKey);

		// Save basic fields
		entityBuilder.set("startingDate", executionSheet.getStartingDate());
		if (executionSheet.getFinishingDate() != null)
			entityBuilder.set("finishingDate", executionSheet.getFinishingDate());
		if (executionSheet.getLastActivityDate() != null)
			entityBuilder.set("lastActivityDate", executionSheet.getLastActivityDate());
		if (executionSheet.getObservations() != null)
			entityBuilder.set("observations", executionSheet.getObservations());

		// Save operations
		if (executionSheet.getOperations() != null) {
			ListValue.Builder operationsBuilder = ListValue.newBuilder();
			for (Operation operation : executionSheet.getOperations()) {
				FullEntity.Builder<IncompleteKey> operationBuilder = FullEntity.newBuilder();
				operationBuilder.set("operationCode", operation.getOperationCode());
				if (operation.getAreaHaExecuted() != null) {
					operationBuilder.set("areaHaExecuted", operation.getAreaHaExecuted());
				}
				if (operation.getAreaPerc() != null) {
					operationBuilder.set("areaPerc", operation.getAreaPerc());
				}
				if (operation.getStartingDate() != null)
					operationBuilder.set("startingDate", operation.getStartingDate());
				if (operation.getFinishingDate() != null)
					operationBuilder.set("finishingDate", operation.getFinishingDate());
				if (operation.getObservations() != null)
					operationBuilder.set("observations", operation.getObservations());

				operationsBuilder.addValue(operationBuilder.build());
			}
			entityBuilder.set("operations", operationsBuilder.build());
		}

		// Save polygon operations
		if (executionSheet.getPolygonsOperations() != null) {
			ListValue.Builder polygonsBuilder = ListValue.newBuilder();
			for (PolygonOperation polygonOperation : executionSheet.getPolygonsOperations()) {
				FullEntity.Builder<IncompleteKey> polygonBuilder = FullEntity.newBuilder();
				polygonBuilder.set("polygonId", polygonOperation.getPolygonId());

				if (polygonOperation.getOperations() != null) {
					ListValue.Builder polygonOperationsBuilder = ListValue.newBuilder();
					for (PolygonOperationDetail polygonOpDetail : polygonOperation.getOperations()) {
						FullEntity.Builder<IncompleteKey> polygonOpBuilder = FullEntity.newBuilder();
						polygonOpBuilder.set("operationId", polygonOpDetail.getOperationId());
						polygonOpBuilder.set("status", polygonOpDetail.getStatus());

						if (polygonOpDetail.getStartingDate() != null)
							polygonOpBuilder.set("startingDate", polygonOpDetail.getStartingDate());

						if (polygonOpDetail.getFinishingDate() != null)
							polygonOpBuilder.set("finishingDate", polygonOpDetail.getFinishingDate());

						if (polygonOpDetail.getLastActivityDate() != null)
							polygonOpBuilder.set("lastActivityDate", polygonOpDetail.getLastActivityDate());

						if (polygonOpDetail.getObservations() != null)
							polygonOpBuilder.set("observations", polygonOpDetail.getObservations());

						if (polygonOpDetail.getOperatorId() != null)
							polygonOpBuilder.set("operatorId", polygonOpDetail.getOperatorId());

						// Save tracks
						if (polygonOpDetail.getTracks() != null) {
							ListValue.Builder tracksBuilder = ListValue.newBuilder();
							for (Track track : polygonOpDetail.getTracks()) {
								FullEntity.Builder<IncompleteKey> trackBuilder = FullEntity.newBuilder();
								trackBuilder.set("type", track.getType());
								trackBuilder.set("coordinates", StringValue.newBuilder(track.getCoordinates().toString())
										.setExcludeFromIndexes(true).build());
								tracksBuilder.addValue(trackBuilder.build());
							}
							polygonOpBuilder.set("tracks", tracksBuilder.build());
						}

						polygonOperationsBuilder.addValue(polygonOpBuilder.build());
					}
					polygonBuilder.set("operations", polygonOperationsBuilder.build());
				}

				polygonsBuilder.addValue(polygonBuilder.build());
			}
			entityBuilder.set("polygonsOperations", polygonsBuilder.build());
		}

		Entity executionSheetEntity = entityBuilder.build();
		datastore.put(executionSheetEntity);

		return executionSheet;
	}

	private List<List<Double>> parseCoordinates(String coordinatesString) {
		List<List<Double>> coordinates = new ArrayList<>();
		if (coordinatesString != null && !coordinatesString.isEmpty()) {
			// Remove outer brackets and split by coordinate pairs
			String cleanString = coordinatesString.replaceAll("^\\[\\[|\\]\\]$", "");
			String[] pairs = cleanString.split("\\],\\s*\\[");

			for (String pair : pairs) {
				String cleanPair = pair.replaceAll("[\\[\\]]", "");
				String[] values = cleanPair.split(",\\s*");

				if (values.length >= 2) {
					try {
						double x = Double.parseDouble(values[0].trim());
						double y = Double.parseDouble(values[1].trim());
						coordinates.add(List.of(x, y));
					} catch (NumberFormatException e) {
						// Skip invalid coordinates
					}
				}
			}
		}
		return coordinates;
	}
}