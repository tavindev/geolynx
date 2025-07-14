package tavindev.core.services;

import org.jvnet.hk2.annotations.Service;
import tavindev.core.entities.WorkSheet;
import ch.hsr.geohash.GeoHash;
import ch.hsr.geohash.WGS84Point;
import ch.hsr.geohash.util.VincentyGeodesy;
import java.util.List;
import jakarta.inject.Inject;

@Service
public class GeohashService {

	private static final int DEFAULT_PRECISION = 6; // ~150m precision

	@Inject
	private CoordinateTransformationService coordinateTransformationService;

	/**
	 * Encodes latitude and longitude to geohash
	 */
	public String encode(double lat, double lon) {
		double[] transformedPoint = coordinateTransformationService.transformFromEPSG3763ToWGS84(lat, lon);
		return encode(transformedPoint[1], transformedPoint[0], DEFAULT_PRECISION);
	}

	/**
	 * Encodes latitude and longitude to geohash with specified precision
	 * Assumes coordinates are already in WGS84 format
	 */
	public String encode(double lat, double lon, int precision) {
		if (precision <= 0 || precision > 12) {
			throw new IllegalArgumentException("Precision must be between 1 and 12");
		}

		WGS84Point point = new WGS84Point(lat, lon);
		GeoHash geoHash = GeoHash.withCharacterPrecision(lat, lon, precision);
		return geoHash.toBase32();
	}

	/**
	 * Decodes geohash to latitude and longitude
	 */
	public double[] decode(String geohash) {
		if (geohash == null || geohash.isEmpty()) {
			throw new IllegalArgumentException("Geohash cannot be null or empty");
		}

		GeoHash geoHash = GeoHash.fromGeohashString(geohash);
		WGS84Point point = geoHash.getBoundingBoxCenter();
		return new double[] { point.getLatitude(), point.getLongitude() };
	}

	/**
	 * Gets neighboring geohashes
	 */
	public String[] getNeighbors(String geohash) {
		GeoHash geoHash = GeoHash.fromGeohashString(geohash);
		GeoHash[] neighbors = geoHash.getAdjacent();

		String[] neighborStrings = new String[8];
		for (int i = 0; i < 8; i++) {
			neighborStrings[i] = neighbors[i].toBase32();
		}

		return neighborStrings;
	}

	/**
	 * Gets geohash precision for a given radius in meters
	 */
	public int getPrecisionForRadius(double radiusMeters) {
		if (radiusMeters <= 150)
			return 8; // ~150m
		if (radiusMeters <= 1200)
			return 7; // ~1.2km
		if (radiusMeters <= 5000)
			return 6; // ~5km
		if (radiusMeters <= 20000)
			return 5; // ~20km
		if (radiusMeters <= 78000)
			return 4; // ~78km
		if (radiusMeters <= 630000)
			return 3; // ~630km
		return 2; // ~2500km
	}

	/**
	 * Calculates distance between two points using Vincenty formula
	 */
	public double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
		WGS84Point point1 = new WGS84Point(lat1, lon1);
		WGS84Point point2 = new WGS84Point(lat2, lon2);
		return VincentyGeodesy.distanceInMeters(point1, point2);
	}

	/**
	 * Gets all geohashes within a radius of a given point
	 */
	public String[] getGeohashesInRadius(double lat, double lon, double radiusMeters) {
		int precision = getPrecisionForRadius(radiusMeters);
		String centerGeohash = encode(lat, lon, precision);

		// Get the center geohash and all its neighbors
		String[] neighbors = getNeighbors(centerGeohash);
		String[] allGeohashes = new String[neighbors.length + 1];
		allGeohashes[0] = centerGeohash;
		System.arraycopy(neighbors, 0, allGeohashes, 1, neighbors.length);

		return allGeohashes;
	}

	/**
	 * 
	 * 
	 * Checks if two geohashes are neighbors
	 */
	public boolean areNeighbors(String geohash1, String geohash2) {
		if (geohash1.equals(geohash2)) {
			return false; // Same geohash is not a neighbor of itself
		}

		String[] neighbors = getNeighbors(geohash1);
		for (String neighbor : neighbors) {
			if (neighbor.equals(geohash2)) {
				return true;
			}
		}
		return false;
	}

	/**
	 * Gets the bounding box of a geohash
	 */
	public double[] getBoundingBox(String geohash) {
		GeoHash geoHash = GeoHash.fromGeohashString(geohash);
		WGS84Point center = geoHash.getBoundingBoxCenter();
		double latDelta = geoHash.getBoundingBox().getLatitudeSize();
		double lonDelta = geoHash.getBoundingBox().getLongitudeSize();

		double lat = center.getLatitude();
		double lon = center.getLongitude();

		// Returns [minLat, maxLat, minLon, maxLon]
		return new double[] {
				lat - latDelta / 2, // minLat
				lat + latDelta / 2, // maxLat
				lon - lonDelta / 2, // minLon
				lon + lonDelta / 2 // maxLon
		};
	}
}
