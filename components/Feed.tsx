
import React, { useState } from 'react';
import CreatePost from './CreatePost';
import PostCard from './PostCard';
import { MOCK_POSTS } from '../constants';
import { Post } from '../types';

interface FeedProps {
  searchQuery: string;
}

const Feed: React.FC<FeedProps> = ({ searchQuery }) => {
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);

  const handlePostCreated = (newPost: Post) => {
    setPosts([newPost, ...posts]);
  };

  const filteredPosts = posts.filter((post) => {
    const query = searchQuery.toLowerCase();
    return (
      post.content.toLowerCase().includes(query) ||
      post.author.name.toLowerCase().includes(query) ||
      post.tags.some(tag => tag.toLowerCase().includes(query))
    );
  });

  return (
    <div>
      <CreatePost onPostCreated={handlePostCreated} />
      <div className="flex items-center justify-between mb-2">
        <div className="h-[1px] bg-gray-300 flex-1"></div>
        <span className="text-xs text-gray-500 px-2">Sort by: <strong className="text-gray-900 cursor-pointer">Top</strong></span>
      </div>
      {filteredPosts.length > 0 ? (
        filteredPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))
      ) : (
        <div className="text-center py-10 text-gray-500">
          <p>No posts found matching "{searchQuery}"</p>
        </div>
      )}
    </div>
  );
};

export default Feed;
