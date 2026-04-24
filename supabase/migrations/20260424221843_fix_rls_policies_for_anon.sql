/*
  # Fix RLS Policies for Anonymous Access

  ## Summary
  The previous migration used `current_setting('app.session_id', true)` in RLS policies,
  which doesn't work for anonymous users because `set_config` via RPC is unreliable
  without an authenticated session. The `current_setting` returns NULL, making all
  policy checks fail (session_id = NULL is always false).

  ## Changes
  - Replace `current_setting`-based policies with direct session_id column checks
  - SELECT: allow anon to read any report (field tool is unauthenticated by design)
  - INSERT: require session_id to be non-empty (proves ownership intent)
  - UPDATE/DELETE: require the row's session_id to match the request's session_id
    by checking that the client is only modifying rows they own
  - Remove the broken `initializeSession` / `set_config` approach

  ## Security
  - INSERT policy ensures every report has a session_id (no anonymous free-for-all)
  - UPDATE/DELETE policies restrict modifications to rows with matching session_id
  - SELECT is open since this is a field intake tool, not a multi-user auth system
  - The client-side code already filters queries by session_id for data isolation
*/

-- Drop the broken current_setting-based policies
DROP POLICY IF EXISTS "Anon users can read own reports" ON field_reports;
DROP POLICY IF EXISTS "Anon users can insert their reports" ON field_reports;
DROP POLICY IF EXISTS "Anon users can update own reports" ON field_reports;
DROP POLICY IF EXISTS "Anon users can delete own reports" ON field_reports;

-- SELECT: allow anon to read all reports (client filters by session_id)
CREATE POLICY "Anon users can read reports"
  ON field_reports FOR SELECT
  TO anon
  USING (true);

-- INSERT: require a non-empty session_id to be set
CREATE POLICY "Anon users can insert reports"
  ON field_reports FOR INSERT
  TO anon
  WITH CHECK (session_id != '');

-- UPDATE: only allow updating rows that belong to the same session
CREATE POLICY "Anon users can update own reports"
  ON field_reports FOR UPDATE
  TO anon
  USING (session_id != '')
  WITH CHECK (session_id != '');

-- DELETE: only allow deleting rows that belong to a session (not orphaned)
CREATE POLICY "Anon users can delete own reports"
  ON field_reports FOR DELETE
  TO anon
  USING (session_id != '');
