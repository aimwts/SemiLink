import React, { useState } from 'react';
import CreatePost from './CreatePost';
import PostCard from './PostCard';
import { MOCK_POSTS } from '../constants';
import { Post } from '../types';

const Feed: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);

  const handlePostCreated = (newPost: Post) => {
    setPosts([newPost, ...posts]);
  };

  return (
    <div>
      <CreatePost onPostCreated={handlePostCreated} />
      <div className="flex items-center justify-between mb-2">
        <div className="h-[1px] bg-gray-300 flex-1"></div>
        <span className="text-xs text-gray-500 px-2">Sort by: <strong className="text-gray-900 cursor-pointer">Top</strong></span>
      </div>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
};

export default Feed;