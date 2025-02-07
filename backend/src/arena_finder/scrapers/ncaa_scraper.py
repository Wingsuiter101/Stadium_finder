import requests
from bs4 import BeautifulSoup
from ..models.database import ArenaDB
from ..database import SessionLocal
from ..geocoders.osm_geocoder import ArenaGeocoder
import logging
import re
import concurrent.futures
import asyncio
import aiohttp
from typing import List, Dict

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def clean_number(text):
    """Extract number from text and remove commas and references"""
    try:
        # Remove reference tags like [6]
        text = re.sub(r'\[\d+\]', '', text)
        # Remove any non-digit characters except decimal points
        cleaned = ''.join(c for c in text if c.isdigit() or c == '.')
        if cleaned:
            return int(float(cleaned))
        return 0
    except:
        return 0

def get_attendance(capacity):
    """Calculate NCAA attendance (typically around 75% of capacity)"""
    try:
        if capacity > 0:
            attendance = round(capacity * 0.75)  # NCAA typically has lower attendance than NBA
            logger.info(f"Calculated attendance: {attendance:,} (75% of {capacity:,})")
            return attendance
        return 0
    except Exception as e:
        logger.error(f"Error calculating attendance: {e}")
        return 0

async def geocode_arena_batch(arenas: List[Dict], geocoder: ArenaGeocoder):
    """Geocode a batch of arenas concurrently"""
    async def geocode_single(arena):
        try:
            return geocoder.geocode_arena(arena)
        except Exception as e:
            logger.error(f"Error geocoding {arena['name']}: {e}")
            return None

    tasks = [geocode_single(arena) for arena in arenas]
    results = await asyncio.gather(*tasks, return_exceptions=True)
    return [r for r in results if r is not None]

def scrape_ncaa_arenas():
    url = "https://en.wikipedia.org/wiki/List_of_NCAA_Division_I_basketball_arenas"
    
    try:
        logger.info("Starting NCAA arena scraping...")
        response = requests.get(url)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')
        
        tables = soup.find_all('table', class_=['wikitable', 'sortable'])
        target_table = None
        
        for table in tables:
            headers = table.find_all('th')
            if len(headers) >= 7 and 'Arena' in [h.text.strip() for h in headers]:
                target_table = table
                break
        
        if not target_table:
            logger.error("Could not find arena table")
            return []
        
        rows = target_table.find_all('tr')[1:]
        logger.info(f"Found {len(rows)} arena rows")
        
        # Process all rows in parallel
        arenas_to_geocode = []
        with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
            def process_row(row):
                try:
                    cols = row.find_all('td')
                    if len(cols) < 7:
                        return None
                    
                    name = cols[1].text.strip()
                    city = cols[2].text.strip()
                    state = cols[3].text.strip()
                    capacity = clean_number(cols[6].text.strip())
                    
                    if name and city and state and capacity > 0:
                        return {
                            "name": name,
                            "city": city,
                            "state": state,
                            "capacity": capacity,
                            "arena_type": "Indoor",
                            "full_address": f"{name}, {city}, {state}, USA",
                            "latitude": 0.0,
                            "longitude": 0.0,
                            "average_attendance": get_attendance(capacity),
                            "zip_code": None
                        }
                    return None
                except Exception as e:
                    logger.error(f"Error processing row: {e}")
                    return None

            # Process rows in parallel
            futures = [executor.submit(process_row, row) for row in rows]
            arenas_to_geocode = [f.result() for f in concurrent.futures.as_completed(futures) if f.result()]

        # Geocode arenas in batches
        geocoder = ArenaGeocoder()
        batch_size = 10
        final_arenas = []
        
        for i in range(0, len(arenas_to_geocode), batch_size):
            batch = arenas_to_geocode[i:i + batch_size]
            # Run geocoding in an event loop
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            geocoded_batch = loop.run_until_complete(geocode_arena_batch(batch, geocoder))
            loop.close()
            final_arenas.extend([a for a in geocoded_batch if a and a['latitude'] != 0.0])
            logger.info(f"Processed batch {i//batch_size + 1}/{(len(arenas_to_geocode) + batch_size - 1)//batch_size}")

        logger.info(f"Successfully scraped {len(final_arenas)} arenas")
        return final_arenas

    except Exception as e:
        logger.error(f"Error scraping NCAA arenas: {e}")
        return []

def populate_database():
    db = SessionLocal()
    try:
        arenas = scrape_ncaa_arenas()
        added_count = 0
        updated_count = 0
        
        # Batch insert/update arenas
        for arena_data in arenas:
            existing = db.query(ArenaDB).filter_by(name=arena_data['name']).first()
            if existing:
                # Update existing arena with new data
                for key, value in arena_data.items():
                    setattr(existing, key, value)
                updated_count += 1
                logger.info(f"Updated arena: {arena_data['name']} with zip: {arena_data.get('zip_code')}")
            else:
                # Add new arena
                arena = ArenaDB(**arena_data)
                db.add(arena)
                added_count += 1
                logger.info(f"Added new arena: {arena_data['name']} with zip: {arena_data.get('zip_code')}")
                
        db.commit()
        logger.info(f"Successfully added {added_count} and updated {updated_count} NCAA arenas")
        
    except Exception as e:
        logger.error(f"Error populating NCAA arenas: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    populate_database() 