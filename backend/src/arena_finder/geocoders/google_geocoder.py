from geopy.geocoders import Nominatim
from geopy.exc import GeocoderTimedOut
import logging
import time

logger = logging.getLogger(__name__)

class ArenaGeocoder:
    def __init__(self):
        self.geocoder = Nominatim(user_agent="arena_finder")
        
    def geocode_arena(self, arena):
        try:
            # Create a full address string
            address = f"{arena['name']}, {arena['city']}, {arena['state']}, USA"
            
            # Add delay to avoid rate limiting
            time.sleep(1)
            
            # Get location
            location = self.geocoder.geocode(address)
            
            if location:
                arena['latitude'] = location.latitude
                arena['longitude'] = location.longitude
                logger.info(f"Geocoded: {arena['name']}")
            else:
                logger.warning(f"Could not geocode: {arena['name']}")
                
        except GeocoderTimedOut:
            logger.error(f"Timeout geocoding: {arena['name']}")
        except Exception as e:
            logger.error(f"Error geocoding {arena['name']}: {e}")
            
        return arena 