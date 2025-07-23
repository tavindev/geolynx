package tavindev.core.services;

import java.util.List;

import com.google.api.gax.rpc.AlreadyExistsException;
import jakarta.inject.Inject;
import jakarta.ws.rs.NotFoundException;
import tavindev.core.entities.User;
import tavindev.core.entities.WorkSheet;
import tavindev.core.entities.Permission;
import tavindev.core.authorization.PermissionAuthorizationHandler;
import tavindev.core.exceptions.CorporationNotFoundException;
import tavindev.core.utils.AuthUtils;
import tavindev.infra.dto.worksheet.WorkSheetListResponseDTO;
import tavindev.infra.dto.worksheet.WorksheetQueryFilters;
import tavindev.infra.repositories.DatastoreCorporationRepository;
import tavindev.infra.repositories.WorkSheetRepository;

public class WorkSheetService {
    @Inject
    private WorkSheetRepository workSheetRepository;
    @Inject
    private DatastoreCorporationRepository corporationRepository;

    @Inject
    private AuthUtils authUtils;

    @Inject
    private GeoHashService geoHashService;

    @Inject
    private CoordinateTransformationService coordinateTransformationService;

    public WorkSheet createOrUpdateWorkSheet(String tokenId, WorkSheet workSheet) {
        User currentUser = authUtils.validateAndGetUser(tokenId);

        PermissionAuthorizationHandler.checkPermission(currentUser, Permission.IMP_FO);

        // Transform all coordinates from ETRS89/PT-TM06 to WGS84
        WorkSheet transformedWorkSheet = transformWorkSheetCoordinates(workSheet);

        double[] firstPoint = transformedWorkSheet.getFirstPoint();

        // transformedCoordinates are already in WGS84, so firstPoint[0] = lat, firstPoint[1] = lon
        transformedWorkSheet.setGeohash(geoHashService.calculateGeohash(firstPoint[0], firstPoint[1]));
        if (corporationRepository.exists(transformedWorkSheet.getMetadata().getServiceProviderId()))
            throw new CorporationNotFoundException("WorkSheet already exists");

        workSheetRepository.save(transformedWorkSheet);

        return transformedWorkSheet;
    }

    private WorkSheet transformWorkSheetCoordinates(WorkSheet workSheet) {
        if (workSheet.getFeatures() == null || workSheet.getFeatures().isEmpty()) {
            return workSheet;
        }

        List<WorkSheet.GeoFeature> transformedFeatures = workSheet.getFeatures().stream()
                .map(this::transformGeoFeature)
                .toList();

        return new WorkSheet(
                workSheet.getType(),
                workSheet.getCrs(),
                transformedFeatures,
                workSheet.getMetadata()
        );
    }

    private WorkSheet.GeoFeature transformGeoFeature(WorkSheet.GeoFeature feature) {
        if (feature.getGeometry() == null || feature.getGeometry().getCoordinates() == null) {
            return feature;
        }

        List<List<List<Double>>> transformedCoordinates = feature.getGeometry().getCoordinates().stream()
                .map(this::transformRing)
                .toList();

        WorkSheet.GeoFeature.Geometry transformedGeometry = new WorkSheet.GeoFeature.Geometry(
                feature.getGeometry().getType(),
                transformedCoordinates
        );

        return new WorkSheet.GeoFeature(
                feature.getType(),
                feature.getProperties(),
                transformedGeometry
        );
    }

    private List<List<Double>> transformRing(List<List<Double>> ring) {
        return ring.stream()
                .map(this::transformPoint)
                .toList();
    }

    private List<Double> transformPoint(List<Double> point) {
        if (point.size() < 2) {
            return point;
        }

        // Original coordinates: [x, y] in ETRS89/PT-TM06
        double x = point.get(0);
        double y = point.get(1);

        // Transform to WGS84
        double[] wgs84 = coordinateTransformationService.transformFromEPSG3763ToWGS84(x, y);

        // Return as [lon, lat] in WGS84
        return List.of(wgs84[0], wgs84[1]);
    }

    public void removeWorkSheet(String tokenId, Long id) {
        User currentUser = authUtils.validateAndGetUser(tokenId);
        PermissionAuthorizationHandler.checkPermission(currentUser, Permission.REM_FO);

        WorkSheet workSheet = workSheetRepository.get(id);

        if (workSheet == null)
            throw new NotFoundException("Folha de obra não encontrada");

        workSheetRepository.remove(workSheet);
    }

    public WorkSheet getWorkSheet(String tokenId, Long id) {
        User currentUser = authUtils.validateAndGetUser(tokenId);
        PermissionAuthorizationHandler.checkPermission(currentUser, Permission.VIEW_DET_FO);

        return workSheetRepository.get(id);
    }

    public List<WorkSheetListResponseDTO> getAllWorkSheets(String tokenId, WorksheetQueryFilters filter) {
        User currentUser = authUtils.validateAndGetUser(tokenId);
        PermissionAuthorizationHandler.checkPermission(currentUser, Permission.VIEW_GEN_FO);

        return workSheetRepository.getAll(filter);
    }
}