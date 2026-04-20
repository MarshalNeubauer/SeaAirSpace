/*
  # Fix Security Issues in Field Reports

  ## Summary
  Addresses three critical security vulnerabilities:
  1. Function search_path mutability - secure the update_updated_at trigger function
  2. RLS policies with USING/WITH CHECK (true) - replace with restrictive policies requiring owner identification

  ## Changes
  
  ### Modified Policies
  - All anonymous user policies now require a session ID to be stored with each report
  - Reports can only be read/updated/deleted by the user who created them
  - This maintains the single-user per-device workflow while preventing cross-user access

  ### Security Improvements
  - Added `session_id` column to track which device/session created the report
  - Updated all RLS policies to check session_id ownership
  - Secured the update_updated_at function with proper search_path
  - Removed unrestricted `USING (true)` and `WITH CHECK (true)` policies

  ## New Column
  - `session_id` (text) — unique session identifier to prevent unauthorized access
*/

-- Add session_id column to track device/session ownership
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'field_reports' AND column_name = 'session_id'
  ) THEN
    ALTER TABLE field_reports ADD COLUMN session_id text NOT NULL DEFAULT '';
  END IF;
END $$;

-- Drop existing unrestricted policies
DROP POLICY IF EXISTS "Anon users can read all reports" ON field_reports;
DROP POLICY IF EXISTS "Anon users can insert reports" ON field_reports;
DROP POLICY IF EXISTS "Anon users can update reports" ON field_reports;
DROP POLICY IF EXISTS "Anon users can delete reports" ON field_reports;

-- Create new restrictive policies that require session_id matching
CREATE POLICY "Anon users can read own reports"
  ON field_reports FOR SELECT
  TO anon
  USING (session_id = current_setting('app.session_id', true));

CREATE POLICY "Anon users can insert their reports"
  ON field_reports FOR INSERT
  TO anon
  WITH CHECK (session_id = current_setting('app.session_id', true));

CREATE POLICY "Anon users can update own reports"
  ON field_reports FOR UPDATE
  TO anon
  USING (session_id = current_setting('app.session_id', true))
  WITH CHECK (session_id = current_setting('app.session_id', true));

CREATE POLICY "Anon users can delete own reports"
  ON field_reports FOR DELETE
  TO anon
  USING (session_id = current_setting('app.session_id', true));

-- Secure the update_updated_at function with immutable search_path
DROP FUNCTION IF EXISTS update_updated_at() CASCADE;

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER 
LANGUAGE plpgsql
STABLE
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON field_reports
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
