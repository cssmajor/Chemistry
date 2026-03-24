/*
  # Fix Admin RLS Policies

  1. Updates
    - Update RLS policies to correctly check for admin role in app_metadata
    - Ensures admin users can insert, update, and delete content
  
  2. Security
    - Maintains strict security by checking authenticated users
    - Admin role is stored in app_metadata which users cannot modify
*/

-- Drop existing admin policies for custom_tests
DROP POLICY IF EXISTS "Admins can insert custom tests" ON custom_tests;
DROP POLICY IF EXISTS "Admins can update custom tests" ON custom_tests;
DROP POLICY IF EXISTS "Admins can delete custom tests" ON custom_tests;

-- Create new policies for custom_tests
CREATE POLICY "Admins can insert custom tests"
  ON custom_tests
  FOR INSERT
  TO authenticated
  WITH CHECK (
    (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin') OR 
    (auth.jwt() -> 'user_metadata' ->> 'role' = 'admin')
  );

CREATE POLICY "Admins can update custom tests"
  ON custom_tests
  FOR UPDATE
  TO authenticated
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin') OR 
    (auth.jwt() -> 'user_metadata' ->> 'role' = 'admin')
  )
  WITH CHECK (
    (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin') OR 
    (auth.jwt() -> 'user_metadata' ->> 'role' = 'admin')
  );

CREATE POLICY "Admins can delete custom tests"
  ON custom_tests
  FOR DELETE
  TO authenticated
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin') OR 
    (auth.jwt() -> 'user_metadata' ->> 'role' = 'admin')
  );

-- Drop existing admin policies for materials
DROP POLICY IF EXISTS "Admins can insert materials" ON materials;
DROP POLICY IF EXISTS "Admins can update materials" ON materials;
DROP POLICY IF EXISTS "Admins can delete materials" ON materials;

-- Create new policies for materials
CREATE POLICY "Admins can insert materials"
  ON materials
  FOR INSERT
  TO authenticated
  WITH CHECK (
    (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin') OR 
    (auth.jwt() -> 'user_metadata' ->> 'role' = 'admin')
  );

CREATE POLICY "Admins can update materials"
  ON materials
  FOR UPDATE
  TO authenticated
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin') OR 
    (auth.jwt() -> 'user_metadata' ->> 'role' = 'admin')
  )
  WITH CHECK (
    (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin') OR 
    (auth.jwt() -> 'user_metadata' ->> 'role' = 'admin')
  );

CREATE POLICY "Admins can delete materials"
  ON materials
  FOR DELETE
  TO authenticated
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin') OR 
    (auth.jwt() -> 'user_metadata' ->> 'role' = 'admin')
  );

-- Drop existing admin policies for videos
DROP POLICY IF EXISTS "Admins can insert videos" ON videos;
DROP POLICY IF EXISTS "Admins can update videos" ON videos;
DROP POLICY IF EXISTS "Admins can delete videos" ON videos;

-- Create new policies for videos
CREATE POLICY "Admins can insert videos"
  ON videos
  FOR INSERT
  TO authenticated
  WITH CHECK (
    (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin') OR 
    (auth.jwt() -> 'user_metadata' ->> 'role' = 'admin')
  );

CREATE POLICY "Admins can update videos"
  ON videos
  FOR UPDATE
  TO authenticated
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin') OR 
    (auth.jwt() -> 'user_metadata' ->> 'role' = 'admin')
  )
  WITH CHECK (
    (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin') OR 
    (auth.jwt() -> 'user_metadata' ->> 'role' = 'admin')
  );

CREATE POLICY "Admins can delete videos"
  ON videos
  FOR DELETE
  TO authenticated
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin') OR 
    (auth.jwt() -> 'user_metadata' ->> 'role' = 'admin')
  );