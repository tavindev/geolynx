package tavindev.core.services;

import ch.hsr.geohash.GeoHash;
import org.jvnet.hk2.annotations.Service;

@Service
public class GeoHashService {

  /**
   * Default precision for geohash calculations (6 characters = ~5km accuracy)
   */
  private static final int DEFAULT_PRECISION = 4;

  /**
   * Calculate geohash from latitude and longitude with default precision
   * 
   * @param latitude  latitude coordinate
   * @param longitude longitude coordinate
   * @return geohash string
   */
  public String calculateGeohash(Double latitude, Double longitude) {
    return calculateGeohash(latitude, longitude, DEFAULT_PRECISION);
  }

  /**
   * Calculate geohash from latitude and longitude with specified precision
   * 
   * @param latitude  latitude coordinate
   * @param longitude longitude coordinate
   * @param precision number of characters in the geohash (1-12)
   * @return geohash string
   */
  public String calculateGeohash(Double latitude, Double longitude, int precision) {
    if (latitude == null || longitude == null) {
      throw new IllegalArgumentException("Latitude and longitude cannot be null");
    }

    if (precision < 1 || precision > 12) {
      throw new IllegalArgumentException("Precision must be between 1 and 12");
    }

    GeoHash geoHash = GeoHash.withCharacterPrecision(latitude, longitude, precision);
    return geoHash.toBase32();
  }

  /**
   * Calculate geohash from Long coordinates with default precision
   * 
   * @param latitude  latitude coordinate as Long
   * @param longitude longitude coordinate as Long
   * @return geohash string
   */
  public String calculateGeohash(Long latitude, Long longitude) {
    return calculateGeohash(latitude.doubleValue(), longitude.doubleValue(), DEFAULT_PRECISION);
  }

  /**
   * Calculate geohash from Long coordinates with specified precision
   * 
   * @param latitude  latitude coordinate as Long
   * @param longitude longitude coordinate as Long
   * @param precision number of characters in the geohash (1-12)
   * @return geohash string
   */
  public String calculateGeohash(Long latitude, Long longitude, int precision) {
    return calculateGeohash(latitude.doubleValue(), longitude.doubleValue(), precision);
  }

  /**
   * Get neighboring geohashes for a given geohash
   * 
   * @param geohash the geohash string
   * @return array of 8 neighboring geohashes
   */
  public String[] getNeighbors(String geohash) {
    if (geohash == null || geohash.isEmpty()) {
      throw new IllegalArgumentException("Geohash cannot be null or empty");
    }

    GeoHash hash = GeoHash.fromGeohashString(geohash);
    GeoHash[] neighbors = hash.getAdjacent();

    String[] neighborStrings = new String[neighbors.length];
    for (int i = 0; i < neighbors.length; i++) {
      neighborStrings[i] = neighbors[i].toBase32();
    }

    return neighborStrings;
  }

  /**
   * Check if a geohash is valid
   * 
   * @param geohash the geohash string to validate
   * @return true if valid, false otherwise
   */
  public boolean isValidGeohash(String geohash) {
    if (geohash == null || geohash.isEmpty()) {
      return false;
    }

    try {
      GeoHash.fromGeohashString(geohash);
      return true;
    } catch (Exception e) {
      return false;
    }
  }

  /**
   * Get the precision (number of characters) of a geohash
   * 
   * @param geohash the geohash string
   * @return precision value
   */
  public int getPrecision(String geohash) {
    if (geohash == null || geohash.isEmpty()) {
      throw new IllegalArgumentException("Geohash cannot be null or empty");
    }

    return geohash.length();
  }

  /**
   * Get the approximate radius in kilometers for a given precision
   * 
   * @param precision geohash precision (1-12)
   * @return approximate radius in kilometers
   */
  public double getRadiusForPrecision(int precision) {
    switch (precision) {
      case 1:
        return 5000.0; // ~5000km
      case 2:
        return 1250.0; // ~1250km
      case 3:
        return 156.0; // ~156km
      case 4:
        return 19.5; // ~19.5km
      case 5:
        return 2.4; // ~2.4km
      case 6:
        return 0.61; // ~610m
      case 7:
        return 0.076; // ~76m
      case 8:
        return 0.019; // ~19m
      case 9:
        return 0.0024; // ~2.4m
      case 10:
        return 0.0003; // ~30cm
      case 11:
        return 0.000037; // ~3.7cm
      case 12:
        return 0.0000046; // ~4.6mm
      default:
        throw new IllegalArgumentException("Precision must be between 1 and 12");
    }
  }
}