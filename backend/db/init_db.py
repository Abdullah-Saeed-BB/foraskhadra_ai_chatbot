import os
import json
from datetime import datetime
from sqlalchemy import create_engine, inspect
from sqlalchemy.orm import sessionmaker
# pyrefly: ignore [missing-import]
from sessions import engine, SessionLocal
# pyrefly: ignore [missing-import]
from models import Base, Opportunity  # Assuming you have an Opportunity model
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
JSON_FILE_PATH = "./data/opportunities.json"

print(DATABASE_URL)


def database_exists():
    """Check if database exists by trying to connect and inspecting tables."""
    try:
        inspector = inspect(engine)
        tables = inspector.get_table_names()
        return len(tables) > 0
    except Exception as e:
        print(f"Error checking database: {e}")
        return False

def load_json_data(json_file_path):
    """Load data from JSON file."""
    try:
        with open(json_file_path, 'r', encoding='utf-8') as file:
            data = json.load(file)
            # If the JSON is an array, return it directly
            if isinstance(data, list):
                return data
            # If it's an object with a data key, extract it
            elif isinstance(data, dict) and 'data' in data:
                return data['data']
            # Otherwise, wrap it in a list
            else:
                return [data]
    except FileNotFoundError:
        print(f"JSON file not found: {json_file_path}")
        return []
    except json.JSONDecodeError as e:
        print(f"Error parsing JSON file: {e}")
        return []

def insert_data_from_json(session, json_file_path):
    """Insert data from JSON file into the database."""
    opportunities_data = load_json_data(json_file_path)
    
    if not opportunities_data:
        print("No data to insert.")
        return 0
    
    inserted_count = 0
    
    for item in opportunities_data:
        try:
            # Parse datetime strings if they exist
            published_at = None
            expires_at = None
            
            if 'published_at' in item and item['published_at']:
                published_at = datetime.fromisoformat(item['published_at'].replace('Z', '+00:00'))
            if 'expires_at' in item and item['expires_at']:
                expires_at = datetime.fromisoformat(item['expires_at'].replace('Z', '+00:00'))
            
            # Create Opportunity object
            opportunity = Opportunity(
                id=item.get('id', ''),
                title_ar=item.get('title_ar', ''),
                title_en=item.get('title_en', ''),
                description_ar=item.get('description_ar', ''),
                description_en=item.get('description_en', ''),
                category=item.get('category', ''),
                organization_ar=item.get('organization_ar', ''),
                organization_en=item.get('organization_en', ''),
                location_ar=item.get('location_ar', ''),
                location_en=item.get('location_en', ''),
                requirements_ar=item.get('requirements_ar', ''),
                requirements_en=item.get('requirements_en', ''),
                benefits_ar=item.get('benefits_ar', ''),
                benefits_en=item.get('benefits_en', ''),
                application_url=item.get('application_url', ''),
                tags_ar=item.get('tags_ar', ''),
                tags_en=item.get('tags_en', ''),
                published_at=published_at,
                expires_at=expires_at
            )
            
            session.add(opportunity)
            inserted_count += 1
            
        except Exception as e:
            print(f"Error inserting data: {e}")
            print(f"Problematic data: {item}")
    
    session.commit()
    print(f"Successfully inserted {inserted_count} records.")
    return inserted_count

def init_db(json_file_path=None):
    """Create database tables and populate with JSON data."""
    if database_exists():
        print(f"Database already exists with tables at: {DATABASE_URL}")
        # Optionally, you can still add data even if database exists
        if json_file_path and os.path.exists(json_file_path):
            print("Database exists. Do you want to add data anyway?")
            # Uncomment the next lines to always add data
            # session = SessionLocal()
            # insert_data_from_json(session, json_file_path)
            # session.close()
    else:
        print(f"Database does not exist or is empty. Creating new database at: {DATABASE_URL}")
        Base.metadata.create_all(bind=engine)
        print("Database tables created successfully.")
        
        # Insert data from JSON file if provided
        if json_file_path and os.path.exists(json_file_path):
            print(f"Inserting data from JSON file: {json_file_path}")
            session = SessionLocal()
            try:
                insert_data_from_json(session, json_file_path)
            finally:
                session.close()
        else:
            print("No JSON file provided or file not found. Database created without data.")

if __name__ == "__main__":
    # Specify the path to your JSON file
    init_db(JSON_FILE_PATH)