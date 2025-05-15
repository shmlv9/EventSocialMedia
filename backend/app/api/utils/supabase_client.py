from supabase import create_client
import os
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
AVATAR_BUCKET = 'images/avatars'

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("Не заданы SUPABASE_URL или SUPABASE_KEY в .env файле")

supabase_client = create_client(SUPABASE_URL, SUPABASE_KEY)