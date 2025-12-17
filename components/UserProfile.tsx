import React, { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Users, Briefcase, MessageSquare, UserPlus, Check, Building2, Plus } from 'lucide-react';
import { Post, User } from '../types';
import PostCard from './PostCard';
import EditProfileModal from './EditProfileModal';

interface UserProfileProps {
  user: User;
  onBack: () => void;
  onMessageClick?: () => void;
  onUpdateProfile?: (updatedUser: User) => void;
  initialEdit?: boolean;
  isConnected?: boolean;
  onConnect?: () => void;
  userPosts: Post[];
  onPostLike: (postId: string) => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ 
    user, 
    onBack, 
    onMessageClick, 
    onUpdateProfile, 
    initialEdit = false, 
    isConnected = false, 
    onConnect,
    userPosts,
    onPostLike
}) => {
  const [isEditing, setIsEditing] = useState(false);
  
  // Current user check
  const isCurrentUser = !!onUpdateProfile;

  useEffect(() => {
    if (initialEdit && isCurrentUser) {
      setIsEditing(true);
    }
  }, [initialEdit, isCurrentUser]);

  const handleSaveProfile = (updatedUser: User) => {
    if (onUpdateProfile) {
      onUpdateProfile(updatedUser);
    }
    setIsEditing(false);
  };

  return (
    <div className="space-y-4">
      {isEditing && (
        <EditProfileModal 
          user={user} 
          onSave={handleSaveProfile} 
          onClose={() => setIsEditing(false)} 
        />
      )}

      {/* Header Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden relative">
        <button 
          onClick={onBack}
          className="absolute top-4 left-4 z-10 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full backdrop-blur-sm transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        
        {/* Banner */}
        <div className="h-40 bg-gray-200 relative">
          {user.backgroundImageUrl ? (
            <img 
              src={user.backgroundImageUrl} 
              alt="Background" 
              className="w-full h-full object-cover"
            />
          ) : (
             <div className="w-full h-full bg-gradient-to-r from-blue-400 to-indigo-500"></div>
          )}
        </div>

        <div className="px-6 pb-6 relative">
          {/* LEFT PANEL: Avatar and Edit Button Container */}
          <div className="absolute -top-16 left-6 flex flex-col items-center">
            <div className="p-1 bg-white rounded-full shadow-lg">
               <img 
                src={user.avatarUrl} 
                alt={user.name} 
                className="w-32 h-32 rounded-full object-cover bg-white"
              />
            </div>
            
            {/* LARGE PRIMARY Edit Profile button */}
            {isCurrentUser && (
              <button 
                onClick={() => setIsEditing(true)}
                className="mt-6 flex items-center justify-center gap-2 px-8 py-3 bg-white border-2 border-blue-600 rounded-full text-sm font-bold text-blue-600 hover:bg-blue-600 hover:text-white shadow-xl transition-all transform hover:scale-105 active:scale-95 group"
              >
                <Plus className="w-5 h-5 stroke-[3px] group-hover:rotate-90 transition-transform" /> 
                Edit Profile
              </button>
            )}
          </div>

          <div className="mt-32 flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="md:pl-4">
              <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
              <p className="text-gray-900 font-medium mt-1 text-lg leading-tight">{user.headline}</p>
              
              <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" /> {user.location || 'Location not set'}
                </span>
                <span className="flex items-center gap-1">
                   <Users className="w-4 h-4" /> {user.connections.toLocaleString()} connections
                </span>
              </div>
            </div>

            <div className="flex gap-2 mt-2 md:mt-0">
               {isCurrentUser ? (
                  <button className="px-6 py-1.5 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors">
                    Open to
                  </button>
               ) : (
                 <>
                    <button 
                      onClick={onConnect}
                      className={`flex items-center gap-2 px-6 py-1.5 rounded-full font-semibold transition-colors ${
                        isConnected ? 'bg-white border border-gray-400 text-gray-600' : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {isConnected ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />} {isConnected ? 'Pending' : 'Connect'}
                    </button>
                    <button 
                      onClick={onMessageClick}
                      className="px-6 py-1.5 text-blue-600 font-semibold border border-blue-600 rounded-full hover:bg-blue-50 transition-colors"
                    >
                      Message
                    </button>
                 </>
               )}
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-bold text-gray-900">About</h2>
            {isCurrentUser && (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="p-1.5 hover:bg-gray-100 rounded-full text-blue-600 border border-blue-100 transition-colors"
                >
                    <Plus className="w-4 h-4 stroke-[2px]" />
                </button>
            )}
        </div>
        <p className="text-gray-700 leading-relaxed text-sm md:text-base">
          {user.about || (isCurrentUser ? "Add a professional summary about your career in semiconductors." : "No summary provided.")}
        </p>
      </div>

      {/* Experience Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
         <div className="flex justify-between items-center mb-4">
             <h2 className="text-lg font-bold text-gray-900">Experience</h2>
             {isCurrentUser && (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="p-1.5 hover:bg-gray-100 rounded-full text-blue-600 border border-blue-100 transition-colors"
                >
                    <Plus className="w-5 h-5 stroke-[2px]" />
                </button>
            )}
         </div>
         
         {(user.experience?.length || 0) > 0 ? (
            <div className="space-y-6">
               {user.experience?.map((exp) => (
                  <div key={exp.id} className="flex gap-4 border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                     <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-gray-100 flex items-center justify-center rounded">
                           <Building2 className="w-6 h-6 text-gray-400" />
                        </div>
                     </div>
                     <div>
                        <h3 className="font-bold text-gray-900">{exp.title}</h3>
                        <p className="text-sm font-medium text-gray-900">{exp.company}</p>
                        <p className="text-sm text-gray-500">{exp.startDate} - {exp.endDate}</p>
                     </div>
                  </div>
               ))}
            </div>
         ) : (
            <p className="text-sm text-gray-500 italic">No experience listed.</p>
         )}
      </div>

      {/* Activity Section */}
      <div className="space-y-2">
        <h2 className="text-lg font-bold text-gray-900 px-1">Activity</h2>
        {userPosts.length > 0 ? (
          userPosts.map(post => (
            <PostCard key={post.id} post={post} onLike={onPostLike} />
          ))
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center text-gray-500">
            <Briefcase className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No recent activity found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;