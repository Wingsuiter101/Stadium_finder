import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.arena_finder.database import engine, Base, init_db
from src.arena_finder.scrapers.ncaa_scraper import populate_database as populate_ncaa

if __name__ == "__main__":
    try:
        print("="*50)
        print("Starting database initialization...")
        print("="*50)

        print("\n1. Dropping existing tables...")
        Base.metadata.drop_all(bind=engine)
        print("✓ Tables dropped successfully!")

        print("\n2. Creating fresh database tables...")
        init_db()
        print("✓ Database tables created successfully!")
        
        print("\n3. Scraping and populating NCAA arena data...")
        populate_ncaa()
        print("✓ NCAA data population complete!")
        
        print("\nAll operations completed successfully!")
        print("="*50)
        
    except Exception as e:
        print(f"\nError occurred: {str(e)}")
        sys.exit(1) 