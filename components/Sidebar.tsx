import React, { useRef } from 'react';
import { Bookmark, Plus, Camera } from 'lucide-react';
import { User } from '../types';

interface SidebarProps {
  onNavigate?: (view: string) => void;
  user: User;
  isMe?: boolean;
  onAvatarChange?: (newAvatarUrl: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onNavigate, user, isMe, onAvatarChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarClick = () => {
    if (isMe && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onAvatarChange) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onAvatarChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Banner */}
        <div 
          className="h-16 bg-gradient-to-r from-semi-700 to-semi-500 cursor-pointer"
          onClick={() => isMe && onNavigate && onNavigate('profile')}
        ></div>
        
        {/* Profile Info */}
        <div className="px-4 pb-4 relative">
          <div 
            className="absolute -top-10 left-1/2 transform -translate-x-1/2"
          >
            <div className="relative group">
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-20 h-20 rounded-full border-4 border-white object-cover shadow-sm bg-white"
              />
              
              {isMe && (
                <>
                  <button 
                    onClick={handleAvatarClick}
                    className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Change Profile Photo"
                  >
                    <Camera className="w-6 h-6 text-white" />
                  </button>
                  <button 
                    onClick={handleAvatarClick}
                    className="absolute bottom-0 right-0 bg-semi-600 text-white p-1.5 rounded-full border-2 border-white shadow-md hover:bg-semi-700 transition-colors md:hidden"
                  >
                    <Camera className="w-3 h-3" />
                  </button>
                  <input 
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </>
              )}
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <h2 
              className={`text-lg font-bold text-gray-900 ${isMe ? 'hover:underline cursor-pointer' : ''}`}
              onClick={() => isMe && onNavigate && onNavigate('profile')}
            >
              {user.name}
            </h2>
            <p className="text-xs text-gray-500 mt-1 leading-tight mb-4">
              {user.headline}
            </p>

            {/* HIGH-VISIBILITY Edit Button */}
            {isMe && (
              <div className="flex justify-center w-full px-2 mt-2">
                <button 
                  onClick={() => onNavigate && onNavigate('profile')}
                  className="flex items-center justify-center gap-2 w-full max-w-[170px] px-4 py-2 bg-white border-2 border-blue-600 rounded-full text-sm font-bold text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-md group active:scale-95"
                >
                  <Plus className="w-4 h-4 stroke-[3px] group-hover:rotate-90 transition-transform" /> 
                  Edit Profile
                </button>
              </div>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100">
            <div 
              className={`flex justify-between items-center text-sm px-2 py-1 rounded ${isMe ? 'hover:bg-gray-100 cursor-pointer' : ''}`}
              onClick={() => isMe && onNavigate && onNavigate('network')}
            >
              <span className="text-gray-500 font-medium">Connections</span>
              <span className="text-semi-700 font-bold">{user.connections}</span>
            </div>
          </div>

          {isMe && (
            <div 
              onClick={() => onNavigate && onNavigate('notifications')}
              className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2 text-xs text-gray-600 hover:bg-gray-100 p-2 rounded cursor-pointer"
            >
              <Bookmark className="w-4 h-4 text-gray-500" />
              <span className="font-semibold">My Items</span>
            </div>
          )}
        </div>
      </div>

      {isMe && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sticky top-20">
          <h3 className="text-xs font-semibold text-gray-900 mb-3 uppercase tracking-wider">Recent</h3>
          <ul className="space-y-2">
              {['# RISC-V Summit', '# TSMC Symposium', '# Advanced Packaging'].map((item, idx) => (
                  <li key={idx} className="text-xs text-gray-500 font-medium hover:text-gray-900 hover:underline cursor-pointer flex items-center gap-2">
                    <span className="text-gray-400">#</span> {item}
                  </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Sidebar;