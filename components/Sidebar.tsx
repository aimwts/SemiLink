
import React from 'react';
import { Bookmark, UserPlus, MapPin } from 'lucide-react';
import { CURRENT_USER } from '../constants';
import { User } from '../types';

interface SidebarProps {
  onNavigate?: (view: string) => void;
  user?: User;
}

const Sidebar: React.FC<SidebarProps> = ({ onNavigate, user = CURRENT_USER }) => {
  const isCurrentUser = user.id === CURRENT_USER.id;

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Banner */}
        <div 
          className="h-16 bg-gradient-to-r from-semi-700 to-semi-500 cursor-pointer"
          onClick={() => isCurrentUser && onNavigate && onNavigate('profile')}
        ></div>
        
        {/* Profile Info */}
        <div className="px-4 pb-4 relative">
          <div 
            className="absolute -top-10 left-1/2 transform -translate-x-1/2 cursor-pointer"
            onClick={() => isCurrentUser && onNavigate && onNavigate('profile')}
          >
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-20 h-20 rounded-full border-4 border-white object-cover"
            />
          </div>
          
          <div className="mt-12 text-center">
            <h2 
              className={`text-lg font-bold text-gray-900 ${isCurrentUser ? 'hover:underline cursor-pointer' : ''}`}
              onClick={() => isCurrentUser && onNavigate && onNavigate('profile')}
            >
              {user.name}
            </h2>
            <p className="text-xs text-gray-500 mt-1 leading-tight">
              {user.headline}
            </p>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100">
            <div 
              className={`flex justify-between items-center text-sm px-2 py-1 rounded ${isCurrentUser ? 'hover:bg-gray-100 cursor-pointer' : ''}`}
              onClick={() => isCurrentUser && onNavigate && onNavigate('network')}
            >
              <span className="text-gray-500 font-medium">Connections</span>
              <span className="text-semi-700 font-bold">{user.connections}</span>
            </div>
            
            {/* Only show profile views to the owner */}
            {isCurrentUser && (
              <div 
                className="flex justify-between items-center text-sm px-2 hover:bg-gray-100 py-1 rounded cursor-pointer mt-1"
                onClick={() => onNavigate && onNavigate('profile')}
              >
                <span className="text-gray-500 font-medium">Profile views</span>
                <span className="text-semi-700 font-bold">342</span>
              </div>
            )}
            
            {/* If viewing another user, show mutual connections if available */}
            {!isCurrentUser && user.mutualConnections && (
               <div className="flex justify-between items-center text-sm px-2 py-1 mt-1">
                <span className="text-gray-500 font-medium">Mutual</span>
                <span className="text-gray-700 font-bold">{user.mutualConnections}</span>
              </div>
            )}
          </div>

          {isCurrentUser && (
            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2 text-xs text-gray-600 hover:bg-gray-100 p-2 rounded cursor-pointer">
              <Bookmark className="w-4 h-4 text-gray-500" />
              <span className="font-semibold">My Items</span>
            </div>
          )}
        </div>
      </div>

      {/* Only show Recent/Groups section for current user */}
      {isCurrentUser && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sticky top-20">
          <h3 className="text-xs font-semibold text-gray-900 mb-3">Recent</h3>
          <ul className="space-y-2">
              {[
                  '# RISC-V Summit',
                  '# TSMC Technology Symposium',
                  '# Chiplets',
                  '# Analog Design',
                  '# Semiconductor Physics'
              ].map((item, idx) => (
                  <li key={idx} className="text-xs text-gray-500 font-medium hover:text-gray-900 hover:underline cursor-pointer flex items-center gap-2">
                    <UserPlus className="w-3 h-3" /> {item}
                  </li>
              ))}
          </ul>
          <div className="mt-4 pt-3 border-t border-gray-100 text-center">
              <button className="text-sm text-gray-500 hover:text-gray-900 font-semibold">Discover more</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
