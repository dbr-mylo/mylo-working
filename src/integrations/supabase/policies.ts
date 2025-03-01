
// This file documents the Row Level Security (RLS) policies applied to Supabase tables

/*
Documents Table Policies:

1. documents_select_own: 
   - Users can only select documents they own
   - Policy: (auth.uid() = owner_id)

2. documents_insert_own:
   - Users can only insert documents where they are the owner
   - Policy: (auth.uid() = owner_id)

3. documents_update_own:
   - Users can only update documents they own
   - Policy: (auth.uid() = owner_id)
*/
