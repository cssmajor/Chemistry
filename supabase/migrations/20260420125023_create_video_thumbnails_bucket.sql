/*
  # Create video-thumbnails storage bucket

  1. Creates the video-thumbnails storage bucket as public
  2. Adds storage policies:
     - Authenticated users (admins) can upload/update/delete files
     - Public can read/view files (for user panel display)
*/

INSERT INTO storage.buckets (id, name, public)
VALUES ('video-thumbnails', 'video-thumbnails', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'Public read access for video thumbnails'
  ) THEN
    CREATE POLICY "Public read access for video thumbnails"
      ON storage.objects FOR SELECT
      USING (bucket_id = 'video-thumbnails');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'Authenticated users can upload video thumbnails'
  ) THEN
    CREATE POLICY "Authenticated users can upload video thumbnails"
      ON storage.objects FOR INSERT
      TO authenticated
      WITH CHECK (bucket_id = 'video-thumbnails');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'Authenticated users can update video thumbnails'
  ) THEN
    CREATE POLICY "Authenticated users can update video thumbnails"
      ON storage.objects FOR UPDATE
      TO authenticated
      USING (bucket_id = 'video-thumbnails');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'Authenticated users can delete video thumbnails'
  ) THEN
    CREATE POLICY "Authenticated users can delete video thumbnails"
      ON storage.objects FOR DELETE
      TO authenticated
      USING (bucket_id = 'video-thumbnails');
  END IF;
END $$;
