from backend.app.api.utils.supabase_client import supabase_client

print(supabase_client.table('events').select('*').execute().data)