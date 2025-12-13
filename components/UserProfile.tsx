
import React, { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Users, Briefcase, MessageSquare, UserPlus, Check, Pencil, Building2, Plus } from 'lucide-react';
import { Post, User } from '../types';
import PostCard from './PostCard';
import EditProfileModal from './EditProfileModal';
import { CURRENT_USER } from '../constants';

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
  
  // Check if viewing own profile
  const isCurrentUser = user.id === CURRENT_USER.id || (onUpdateProfile !== undefined && user.id === user.id);

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
              alt="Profile Background" 
              className="w-full h-full object-cover"
            />
          ) : (
             <div className="w-full h-full bg-gradient-to-r from-blue-400 to-indigo-500"></div>
          )}
          
          {isCurrentUser && (
            <button 
              onClick={() => setIsEditing(true)}
              className="absolute top-4 right-4 z-10 bg-white p-2 rounded-full shadow-sm hover:bg-gray-100 text-blue-600 transition-colors"
              title="Edit Profile"
            >
              <Pencil className="w-4 h-4" />
            </button>
          )}
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
          
          {isCurrentUser && (
            <div className="absolute top-4 right-6">
                <button 
                  onClick={() => setIsEditing(true)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
                >
                   <Pencil className="w-5 h-5" />
                </button>
            </div>
          )}

          <div className="mt-20 flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                {user.name}
              </h1>
              <p className="text-gray-900 font-medium mt-1 text-lg">{user.headline}</p>
              
              <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" /> {user.location || 'Location not set'}
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
               {isCurrentUser ? (
                  <button className="px-6 py-1.5 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors">
                    Open to
                  </button>
               ) : (
                 <>
                    <button 
                      onClick={onConnect}
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
                 </>
               )}
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 relative">
        <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-bold text-gray-900">About</h2>
            {isCurrentUser && (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="p-2 hover:bg-gray-100 rounded-full text-gray-500"
                >
                    <Pencil className="w-4 h-4" />
                </button>
            )}
        </div>
        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
          {user.about || (isCurrentUser ? "Tap the pencil icon to add a summary about your expertise." : "No summary provided.")}
        </p>
      </div>

      {/* Experience Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 relative">
         <div className="flex justify-between items-center mb-4">
             <h2 className="text-lg font-bold text-gray-900">Experience</h2>
             {isCurrentUser && (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="p-2 hover:bg-gray-100 rounded-full text-gray-500"
                >
                    <Plus className="w-5 h-5" />
                </button>
            )}
         </div>
         
         {(user.experience?.length || 0) > 0 ? (
            <div className="space-y-6">
               {user.experience?.map((exp) => (
                  <div key={exp.id} className="flex gap-4 border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                     <div className="flex-shrink-0">
                        {exp.logoUrl ? (
                           <img src={exp.logoUrl} alt={exp.company} className="w-12 h-12 object-contain" />
                        ) : (
                           <div className="w-12 h-12 bg-gray-100 flex items-center justify-center rounded">
                               <Building2 className="w-6 h-6 text-gray-400" />
                           </div>
                        )}
                     </div>
                     <div>
                        <h3 className="font-bold text-gray-900">{exp.title}</h3>
                        <p className="text-sm font-medium text-gray-900">{exp.company}</p>
                        <p className="text-sm text-gray-500">{exp.startDate} - {exp.endDate}</p>
                        {exp.description && (
                           <p className="text-sm text-gray-700 mt-2">{exp.description}</p>
                        )}
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
            <p>{user.name} hasn't posted anything yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
