/*
  # Remove user_metadata from admin RLS policies

  1. Security Fix
    - Remove `user_metadata` role checks from all admin RLS policies
    - `user_metadata` can be modified by authenticated users via supabase.auth.update()
    - Only `app_metadata` should be trusted for authorization decisions
    - This prevents privilege escalation where a user sets their own role to 'admin'

  2. Affected Tables
    - materials (INSERT, UPDATE, DELETE policies)
    - videos (INSERT, UPDATE, DELETE policies)  
    - custom_tests (INSERT, UPDATE, DELETE policies)
*/

DO $$ BEGIN
  DROP POLICY IF EXISTS "Admins can insert materials" ON materials;
  DROP POLICY IF EXISTS "Admins can update materials" ON materials;
  DROP POLICY IF EXISTS "Admins can delete materials" ON materials;
  
  DROP POLICY IF EXISTS "Admins can insert videos" ON videos;
  DROP POLICY IF EXISTS "Admins can update videos" ON videos;
  DROP POLICY IF EXISTS "Admins can delete videos" ON videos;
  
  DROP POLICY IF EXISTS "Admins can insert custom tests" ON custom_tests;
  DROP POLICY IF EXISTS "Admins can update custom tests" ON custom_tests;
  DROP POLICY IF EXISTS "Admins can delete custom tests" ON custom_tests;
END $$;

CREATE POLICY "Admins can insert materials"
  ON materials FOR INSERT
  TO authenticated
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "Admins can update materials"
  ON materials FOR UPDATE
  TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "Admins can delete materials"
  ON materials FOR DELETE
  TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "Admins can insert videos"
  ON videos FOR INSERT
  TO authenticated
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "Admins can update videos"
  ON videos FOR UPDATE
  TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "Admins can delete videos"
  ON videos FOR DELETE
  TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "Admins can insert custom tests"
  ON custom_tests FOR INSERT
  TO authenticated
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "Admins can update custom tests"
  ON custom_tests FOR UPDATE
  TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "Admins can delete custom tests"
  ON custom_tests FOR DELETE
  TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
