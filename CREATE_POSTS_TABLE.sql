-- Create posts table for storing user posts
CREATE TABLE IF NOT EXISTS posts (
  id TEXT PRIMARY KEY,
  author_id TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  video_url TEXT,
  likes INT DEFAULT 0,
  comments INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (author_id) REFERENCES profiles(id) ON DELETE CASCADE
);

-- Create storage bucket for post images
-- Run this in Supabase dashboard: Storage -> New bucket -> "post-images"
-- Set to "Public" and allow file types: jpg, jpeg, png, gif, webp

-- Create storage bucket for post videos
-- Run this in Supabase dashboard: Storage -> New bucket -> "post-videos"
-- Set to "Public" and allow file types: mp4, webm, mov, avi

-- Add RLS policies (copy to Supabase SQL editor)
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Allow public read access to posts
CREATE POLICY "Posts are viewable by everyone" ON posts
  FOR SELECT USING (true);

-- Allow authenticated users to create posts
CREATE POLICY "Users can create their own posts" ON posts
  FOR INSERT WITH CHECK (auth.uid() = author_id);

-- Allow users to update their own posts
CREATE POLICY "Users can update their own posts" ON posts
  FOR UPDATE USING (auth.uid() = author_id);

-- Allow users to delete their own posts
CREATE POLICY "Users can delete their own posts" ON posts
  FOR DELETE USING (auth.uid() = author_id);

-- OPTIONAL: Allow anonymous (public) inserts
-- WARNING: This allows anyone with your anon key or REST access to insert rows.
-- Use only for testing or if you explicitly want unauthenticated users to post.
-- To enable, run the following in Supabase SQL Editor:
--
-- CREATE POLICY "Public insert" ON posts
--   FOR INSERT WITH CHECK (true);

