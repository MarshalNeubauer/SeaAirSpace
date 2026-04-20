/*
  # Create DSCA Field Reports Table

  ## Summary
  Creates the core data table for storing DSCA Liaison field engagement reports.

  ## New Tables

  ### `field_reports`
  Stores all meeting readout / field intake reports captured via the mobile module.

  - `id` (uuid, primary key) — unique report identifier
  - `title` (text) — document title (e.g. "Leidos Discussion with Director Miller")
  - `company` (text) — prime company name
  - `event` (text) — venue / event name (e.g. "Sea-Air-Space 2026")
  - `purpose` (text) — executive purpose statement
  - `bottom_line` (jsonb) — array of bottom-line bullet strings
  - `background` (jsonb) — array of background bullet strings
  - `discussion` (jsonb) — array of { category, notes[] } objects
  - `recommendation` (text) — way ahead / recommendation text
  - `created_at` (timestamptz) — auto-set on insert
  - `updated_at` (timestamptz) — auto-updated on change

  ## Security
  - RLS enabled
  - Public read/write policies for anonymous users (field tool is unauthenticated by design)
    — restricted to anon role only, not service_role bypass

  ## Notes
  1. Reports are identified by UUID for portability across devices
  2. All structured arrays stored as JSONB for flexible schema evolution
  3. anonymous access is intentional: this is a field intake tool, not a multi-user auth system
*/

CREATE TABLE IF NOT EXISTS field_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL DEFAULT '',
  company text NOT NULL DEFAULT '',
  event text NOT NULL DEFAULT '',
  purpose text NOT NULL DEFAULT '',
  bottom_line jsonb NOT NULL DEFAULT '[]',
  background jsonb NOT NULL DEFAULT '[]',
  discussion jsonb NOT NULL DEFAULT '[]',
  recommendation text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE field_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anon users can read all reports"
  ON field_reports FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anon users can insert reports"
  ON field_reports FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anon users can update reports"
  ON field_reports FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anon users can delete reports"
  ON field_reports FOR DELETE
  TO anon
  USING (true);

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON field_reports
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
