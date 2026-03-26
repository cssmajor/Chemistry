/*
  # Create Video Thumbnails Storage Bucket

  1. Storage Setup
    - Creates public storage bucket 'video-thumbnails' for storing video thumbnail images
    - Allows public read access to thumbnails
    - Allows authenticated users to upload, update, and delete thumbnails

  2. Security
    - Public SELECT access for viewing thumbnails
    - Authenticated users can INSERT, UPDATE, and DELETE
*/

-- Create storage bucket for video thumbnails
INSERT INTO storage.buckets (id, name, public)
VALUES ('video-thumbnails', 'video-thumbnails', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access
CREATE POLICY "Public can view video thumbnails"
ON storage.objects FOR SELECT
USING (bucket_id = 'video-thumbnails');

-- Allow authenticated admins to upload
CREATE POLICY "Admins can upload video thumbnails"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'video-thumbnails');

-- Allow authenticated admins to update
CREATE POLICY "Admins can update video thumbnails"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'video-thumbnails');

-- Allow authenticated admins to delete
CREATE POLICY "Admins can delete video thumbnails"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'video-thumbnails');
