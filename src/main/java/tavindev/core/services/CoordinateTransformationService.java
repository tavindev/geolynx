package tavindev.core.services;

import org.jvnet.hk2.annotations.Service;
import org.locationtech.proj4j.*;

@Service
public class CoordinateTransformationService {

	// Portugal TM06 (EPSG:3763) projection parameters
	private static final String PORTUGAL_TM06_PROJ4 = "+proj=tmerc +lat_0=39.66825833333333 +lon_0=-8.133108333333334 +k=1 +x_0=0 +y_0=0 +ellps=GRS80 +units=m +no_defs";

	private static final String WGS84_PROJ4 = "+proj=longlat +datum=WGS84 +no_defs";

	private final CRSFactory crsFactory = new CRSFactory();
	private final CoordinateTransformFactory ctFactory = new CoordinateTransformFactory();

	/**
	 * Transforms coordinates from EPSG:3763 (ETRS89 / Portugal TM06) to WGS84
	 * (EPSG:4326)
	 * 
	 * @param x X coordinate in EPSG:3763
	 * @param y Y coordinate in EPSG:3763
	 * @return array with [longitude, latitude] in WGS84
	 */
	public double[] transformFromEPSG3763ToWGS84(double x, double y) {
		try {
			CoordinateReferenceSystem sourceCRS = crsFactory.createFromParameters("Portugal TM06", PORTUGAL_TM06_PROJ4);
			CoordinateReferenceSystem targetCRS = crsFactory.createFromParameters("WGS84", WGS84_PROJ4);

			CoordinateTransform transform = ctFactory.createTransform(sourceCRS, targetCRS);

			ProjCoordinate sourceCoord = new ProjCoordinate(x, y);
			ProjCoordinate targetCoord = new ProjCoordinate();

			transform.transform(sourceCoord, targetCoord);

			return new double[] { targetCoord.x, targetCoord.y }; // lon, lat
		} catch (Exception e) {
			throw new RuntimeException("Failed to transform coordinates from EPSG:3763 to WGS84", e);
		}
	}
}