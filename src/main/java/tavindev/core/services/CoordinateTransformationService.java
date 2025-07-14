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

	/**
	 * Transforms coordinates from WGS84 (EPSG:4326) to EPSG:3763 (ETRS89 / Portugal
	 * TM06)
	 * 
	 * @param lon Longitude in WGS84
	 * @param lat Latitude in WGS84
	 * @return array with [x, y] in EPSG:3763
	 */
	public double[] transformFromWGS84ToEPSG3763(double lon, double lat) {
		try {
			CoordinateReferenceSystem sourceCRS = crsFactory.createFromParameters("WGS84", WGS84_PROJ4);
			CoordinateReferenceSystem targetCRS = crsFactory.createFromParameters("Portugal TM06", PORTUGAL_TM06_PROJ4);

			CoordinateTransform transform = ctFactory.createTransform(sourceCRS, targetCRS);

			ProjCoordinate sourceCoord = new ProjCoordinate(lon, lat);
			ProjCoordinate targetCoord = new ProjCoordinate();

			transform.transform(sourceCoord, targetCoord);

			return new double[] { targetCoord.x, targetCoord.y };
		} catch (Exception e) {
			throw new RuntimeException("Failed to transform coordinates from WGS84 to EPSG:3763", e);
		}
	}

	/**
	 * Checks if coordinates are in valid WGS84 range
	 * 
	 * @param lat Latitude
	 * @param lon Longitude
	 * @return true if coordinates are valid WGS84
	 */
	public boolean isValidWGS84Coordinates(double lat, double lon) {
		return lat >= -90.0 && lat <= 90.0 && lon >= -180.0 && lon <= 180.0;
	}

	/**
	 * Checks if coordinates are likely in EPSG:3763 (Portugal TM06) range
	 * 
	 * @param x X coordinate
	 * @param y Y coordinate
	 * @return true if coordinates are likely in EPSG:3763 range
	 */
	public boolean isLikelyEPSG3763Coordinates(double x, double y) {
		// Portugal TM06 approximate bounds
		return x >= -100000 && x <= 100000 && y >= -100000 && y <= 100000;
	}
}