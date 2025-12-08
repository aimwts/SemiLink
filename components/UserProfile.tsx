
import React, { useState } from 'react';
import { ArrowLeft, MapPin, Users, Briefcase, MessageSquare, UserPlus, Check } from 'lucide-react';
import { User } from '../types';
import PostCard from './PostCard';
import { MOCK_POSTS } from '../constants';

interface UserProfileProps {
  user: User;
  onBack: () => void;
  onMessageClick?: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, onBack, onMessageClick }) => {
  const [isConnected, setIsConnected] = useState(false);
  const userPosts = MOCK_POSTS.filter(post => post.author.id === user.id);

  const handleConnect = () => {
    setIsConnected(true);
  };

  return (
    <div className="space-y-4">
      {/* Header Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden relative">
        <button 
          onClick={onBack}
          className="absolute top-4 left-4 z-10 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full backdrop-blur-sm transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        
        {/* Banner */}
        <div className="h-40 bg-gradient-to-r from-blue-400 to-indigo-500 relative">
        </div>

        <div className="px-6 pb-6 relative">
          {/* Avatar */}
          <div className="absolute -top-16 left-6 p-1 bg-white rounded-full shadow-md z-10">
             <img 
              src={user.avatarUrl} 
              alt={user.name} 
              className="w-32 h-32 rounded-full object-cover bg-white"
            />
          </div>

          <div className="mt-20 flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                {user.name}
              </h1>
              <p className="text-gray-900 font-medium mt-1 text-lg">{user.headline}</p>
              
              <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" /> Silicon Valley, CA
                </span>
                <span className="flex items-center gap-1">
                   <Users className="w-4 h-4" /> {user.connections.toLocaleString()} connections
                </span>
                {user.mutualConnections && (
                  <span className="text-gray-500">
                    {user.mutualConnections} mutual connections
                  </span>
                )}
              </div>
            </div>

            <div className="flex gap-2 mt-2 md:mt-0">
               <button 
                onClick={handleConnect}
                disabled={isConnected}
                className={`flex items-center gap-2 px-6 py-1.5 rounded-full font-semibold transition-colors ${
                  isConnected 
                    ? 'bg-white border border-gray-400 text-gray-600 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isConnected ? <><Check className="w-5 h-5" /> Pending</> : <><UserPlus className="w-5 h-5" /> Connect</>}
              </button>
              <button 
                onClick={onMessageClick}
                className="px-6 py-1.5 text-blue-600 font-semibold border border-blue-600 rounded-full hover:bg-blue-50 transition-colors flex items-center gap-2"
              >
                <MessageSquare className="w-5 h-5" /> Message
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* About Section (Placeholder) */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-3">About</h2>
        <p className="text-gray-700 leading-relaxed">
          Experienced professional in the semiconductor industry with a focus on delivering high-quality results. 
          Passionate about technology, innovation, and driving progress in chip design and manufacturing.
        </p>
      </div>

      {/* Activity Section */}
      <div className="space-y-2">
        <h2 className="text-lg font-bold text-gray-900 px-1">Activity</h2>
        {userPosts.length > 0 ? (
          userPosts.map(post => (
            <PostCard key={post.id} post={post} />
          ))
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center text-gray-500">
            <Briefcase className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>{user.name} hasn't posted anything yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
