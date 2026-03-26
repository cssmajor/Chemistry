/*
  # Tighten RLS SELECT policies

  1. Changes
    - Replace overly broad `public` role SELECT policies with `anon, authenticated` roles
    - This restricts read access to only Supabase anon key holders and authenticated users,
      rather than any PostgreSQL role
    - Add admin SELECT policy for test_attempts so admin can view all attempts
  
  2. Security
    - Narrower role targeting reduces attack surface
    - Admin can now view test attempt statistics
*/

DO $$ BEGIN
  DROP POLICY IF EXISTS "Anyone can view materials" ON materials;
  DROP POLICY IF EXISTS "Anyone can view videos" ON videos;
  DROP POLICY IF EXISTS "Anyone can view custom tests" ON custom_tests;
END $$;

CREATE POLICY "Anon and authenticated can view materials"
  ON materials FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anon and authenticated can view videos"
  ON videos FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anon and authenticated can view custom tests"
  ON custom_tests FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can view all test attempts"
  ON test_attempts FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id
    OR (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

DROP POLICY IF EXISTS "Users can view own test attempts" ON test_attempts;
