/*
  # Create Media Storage Bucket

  1. Storage Setup
    - Create public 'media' bucket for video thumbnails
    - Allow public read access
    - Restrict uploads to authenticated admins only
  
  2. Security
    - Only authenticated users with admin role can upload
    - Public read access for all thumbnails
    - File size limits enforced at application level
*/

-- Create storage bucket for media files
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to media files
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Public read access for media'
  ) THEN
    CREATE POLICY "Public read access for media"
      ON storage.objects
      FOR SELECT
      TO public
      USING (bucket_id = 'media');
  END IF;
END $$;

-- Allow authenticated admins to upload media files
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Authenticated admins can upload media'
  ) THEN
    CREATE POLICY "Authenticated admins can upload media"
      ON storage.objects
      FOR INSERT
      TO authenticated
      WITH CHECK (
        bucket_id = 'media' 
        AND (auth.jwt()->>'role')::text = 'admin'
      );
  END IF;
END $$;

-- Allow authenticated admins to update media files
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Authenticated admins can update media'
  ) THEN
    CREATE POLICY "Authenticated admins can update media"
      ON storage.objects
      FOR UPDATE
      TO authenticated
      USING (
        bucket_id = 'media'
        AND (auth.jwt()->>'role')::text = 'admin'
      );
  END IF;
END $$;

-- Allow authenticated admins to delete media files
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Authenticated admins can delete media'
  ) THEN
    CREATE POLICY "Authenticated admins can delete media"
      ON storage.objects
      FOR DELETE
      TO authenticated
      USING (
        bucket_id = 'media'
        AND (auth.jwt()->>'role')::text = 'admin'
      );
  END IF;
END $$;