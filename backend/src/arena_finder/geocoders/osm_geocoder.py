from geopy.geocoders import Nominatim
from geopy.exc import GeocoderTimedOut
import logging
import time

logger = logging.getLogger(__name__)

class ArenaGeocoder:
    def __init__(self):
        # Nominatim is OpenStreetMap's geocoding service
        self.geocoder = Nominatim(
            user_agent="arena_finder",
            timeout=10
        )
        
    def geocode_arena(self, arena):
        try:
            # Try different address formats in order of specificity
            address_formats = [
                f"{arena['name']}, {arena['city']}, {arena['state']}, USA",  # Full address
                f"{arena['name']}, {arena['city']}, {arena['state']}",       # Without USA
                f"Basketball Arena, {arena['city']}, {arena['state']}, USA", # Generic arena name
            ]
            
            for address in address_formats:
                time.sleep(1.5)  # Respect rate limit
                location = self.geocoder.geocode(address, addressdetails=True)
                
                if location and location.raw.get('address', {}).get('postcode'):
                    arena['latitude'] = location.latitude
                    arena['longitude'] = location.longitude
                    arena['zip_code'] = location.raw['address'].get('postcode')
                    logger.info(f"Geocoded with format '{address}': {arena['name']} "
                              f"({location.latitude}, {location.longitude}, ZIP: {arena['zip_code']})")
                    return arena
            
            # Fallback to city coordinates if no arena-specific location found
            logger.warning(f"Falling back to city coordinates for: {arena['name']}")
            city_location = self.geocoder.geocode(f"{arena['city']}, {arena['state']}, USA", addressdetails=True)
            if city_location:
                arena['latitude'] = city_location.latitude
                arena['longitude'] = city_location.longitude
                arena['zip_code'] = city_location.raw['address'].get('postcode')
                logger.info(f"Using city coordinates for: {arena['name']} "
                          f"({city_location.latitude}, {city_location.longitude}, ZIP: {arena['zip_code']})")
                
        except GeocoderTimedOut:
            logger.error(f"Timeout geocoding: {arena['name']}")
        except Exception as e:
            logger.error(f"Error geocoding {arena['name']}: {e}")
            
        return arena 