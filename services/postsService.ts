import { supabase } from '../lib/supabaseClient';
import { Post, User } from '../types';
import { isSupabaseConfigured } from '../lib/config';

/**
 * Save a post to Supabase or fallback to localStorage if not configured
 */
export const savePost = async (newPost: Post): Promise<Post> => {
  // If Supabase isn't configured, just return the post (will be stored in localStorage by App.tsx)
  if (!isSupabaseConfigured()) {
    console.log('ℹ️ Supabase not configured - post saved to localStorage only');
    return newPost;
  }

  try {
    console.log('📤 Saving post to Supabase...', newPost.id);
    const { data, error } = await supabase.from('posts').insert({
      id: newPost.id,
      author_id: newPost.author.id,
      content: newPost.content,
      image_url: newPost.imageUrl,
      video_url: newPost.videoUrl,
      likes: newPost.likes,
      comments: newPost.comments,
    });

    if (error) {
      console.warn('⚠️ Error saving post to Supabase:', error.message);
      console.log('💾 Falling back to localStorage for this post');
      return newPost; // Fallback to local storage
    }

    console.log('✅ Post saved to Supabase successfully');
    return newPost;
  } catch (err) {
    console.warn('⚠️ Failed to save post to Supabase:', err);
    console.log('💾 Falling back to localStorage for this post');
    return newPost; // Fallback to local storage
  }
};

/**
 * Fetch posts from Supabase
 */
export const fetchPosts = async (): Promise<Post[]> => {
  if (!isSupabaseConfigured()) {
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching posts:', error);
      return [];
    }

    // Map database posts to Post interface (requires author data)
    // For now, return empty array - we'll fetch full posts with author data separately
    return [];
  } catch (err) {
    console.error('Failed to fetch posts:', err);
    return [];
  }
};

/**
 * Upload image to Supabase storage
 */
export const uploadPostImage = async (
  file: File,
  postId: string
): Promise<string | null> => {
  if (!isSupabaseConfigured()) {
    return null;
  }

  try {
    const fileName = `${postId}_${Date.now()}_${file.name}`;
    const { error } = await supabase.storage
      .from('post-images')
      .upload(fileName, file);

    if (error) {
      console.error('Error uploading image:', error);
      return null;
    }

    // Get public URL
    const { data } = supabase.storage.from('post-images').getPublicUrl(fileName);
    return data?.publicUrl || null;
  } catch (err) {
    console.error('Failed to upload image:', err);
    return null;
  }
};

/**
 * Upload video to Supabase storage
 */
export const uploadPostVideo = async (
  file: File,
  postId: string
): Promise<string | null> => {
  if (!isSupabaseConfigured()) {
    return null;
  }

  try {
    const fileName = `${postId}_${Date.now()}_${file.name}`;
    const { error } = await supabase.storage
      .from('post-videos')
      .upload(fileName, file);

    if (error) {
      console.error('Error uploading video:', error);
      return null;
    }

    // Get public URL
    const { data } = supabase.storage.from('post-videos').getPublicUrl(fileName);
    return data?.publicUrl || null;
  } catch (err) {
    console.error('Failed to upload video:', err);
    return null;
  }
};

/**
 * Delete a post from Supabase
 */
export const deletePost = async (postId: string): Promise<boolean> => {
  if (!isSupabaseConfigured()) {
    return true;
  }

  try {
    const { error } = await supabase.from('posts').delete().eq('id', postId);

    if (error) {
      console.error('Error deleting post:', error);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Failed to delete post:', err);
    return false;
  }
};

/**
 * Update post likes
 */
export const updatePostLikes = async (
  postId: string,
  likes: number
): Promise<boolean> => {
  if (!isSupabaseConfigured()) {
    return true;
  }

  try {
    const { error } = await supabase
      .from('posts')
      .update({ likes })
      .eq('id', postId);

    if (error) {
      console.error('Error updating likes:', error);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Failed to update likes:', err);
    return false;
  }
};
