
import React, { useState } from 'react';
import { ThumbsUp, MessageSquare, Share2, Send, MoreHorizontal, Plus } from 'lucide-react';
import { Post, User } from '../types';

interface PostCardProps {
  post: Post;
  onUserClick?: (user: User) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onUserClick }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes);
  const [isFollowing, setIsFollowing] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4 overflow-hidden">
      {/* Header */}
      <div className="p-4 flex items-start gap-3">
        <img
          src={post.author.avatarUrl}
          alt={post.author.name}
          className="w-12 h-12 rounded-full object-cover cursor-pointer hover:opacity-90"
          onClick={() => onUserClick && onUserClick(post.author)}
        />
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 
                  className="font-semibold text-gray-900 text-sm hover:text-blue-600 hover:underline cursor-pointer"
                  onClick={() => onUserClick && onUserClick(post.author)}
                >
                  {post.author.name}
                </h3>
                <span className="text-gray-400 text-xs">•</span>
                <button 
                  onClick={handleFollow}
                  className="text-blue-600 text-xs font-semibold hover:underline flex items-center"
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </button>
              </div>
              <p className="text-xs text-gray-500 line-clamp-1">{post.author.headline}</p>
              <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                <span>{post.timestamp}</span>
                <span>•</span>
                <span className="font-medium">Global</span>
              </div>
            </div>
            <button className="text-gray-400 hover:bg-gray-100 p-1 rounded-full">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-2">
        <p className="text-sm text-gray-800 whitespace-pre-wrap">{post.content}</p>
        <div className="mt-2 flex flex-wrap gap-2">
            {post.tags.map(tag => (
                <span key={tag} className="text-xs text-semi-600 hover:underline cursor-pointer">#{tag}</span>
            ))}
        </div>
      </div>

      {/* Image Attachment (if any) */}
      {post.imageUrl && (
        <div className="mt-2">
          <img src={post.imageUrl} alt="Post content" className="w-full object-cover max-h-96" />
        </div>
      )}

      {/* Social Counts */}
      <div className="px-4 py-2 border-b border-gray-100 flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-1">
          {likesCount > 0 && (
             <>
               <div className="bg-blue-100 p-0.5 rounded-full">
                 <ThumbsUp className="w-3 h-3 text-blue-600 fill-current" />
               </div>
               <span>{likesCount}</span>
             </>
          )}
        </div>
        <div>
          <span className="hover:text-blue-600 hover:underline cursor-pointer">{post.comments} comments</span>
        </div>
      </div>

      {/* Actions */}
      <div className="px-2 py-1 flex items-center justify-between">
        <ActionButton 
          icon={<ThumbsUp className={`w-5 h-5 ${isLiked ? 'text-blue-600 fill-current' : ''}`} />} 
          label="Like" 
          active={isLiked}
          onClick={handleLike}
        />
        <ActionButton icon={<MessageSquare className="w-5 h-5" />} label="Comment" />
        <ActionButton icon={<Share2 className="w-5 h-5" />} label="Repost" />
        <ActionButton icon={<Send className="w-5 h-5" />} label="Send" />
      </div>
    </div>
  );
};

const ActionButton: React.FC<{ icon: React.ReactNode; label: string; active?: boolean; onClick?: () => void }> = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex-1 flex items-center justify-center gap-2 py-3 hover:bg-gray-100 rounded-md transition-colors group ${active ? 'text-blue-600' : 'text-gray-600'}`}
  >
    <div className={`transition-colors ${active ? 'text-blue-600' : 'group-hover:text-gray-900'}`}>{icon}</div>
    <span className={`text-sm font-medium transition-colors ${active ? 'text-blue-600' : 'group-hover:text-gray-900'}`}>{label}</span>
  </button>
);

export default PostCard;
