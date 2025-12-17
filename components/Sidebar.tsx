
import React from 'react';
import { Bookmark, Plus } from 'lucide-react';
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
              className="w-20 h-20 rounded-full border-4 border-white object-cover shadow-sm"
            />
          </div>
          
          <div className="mt-12 text-center">
            <h2 
              className={`text-lg font-bold text-gray-900 ${isCurrentUser ? 'hover:underline cursor-pointer' : ''}`}
              onClick={() => isCurrentUser && onNavigate && onNavigate('profile')}
            >
              {user.name}
            </h2>
            <p className="text-xs text-gray-500 mt-1 leading-tight mb-4">
              {user.headline}
            </p>

            {/* Edit Button in Left Panel under Name */}
            {isCurrentUser && (
              <button 
                onClick={() => onNavigate && onNavigate('profile')}
                className="inline-flex items-center justify-center gap-1.5 w-full max-w-[140px] px-3 py-1.5 bg-white border-2 border-blue-600 rounded-full text-xs font-bold text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-sm mb-2"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3px]" /> Edit Profile
              </button>
            )}
          </div>

          <div className="mt-2 pt-4 border-t border-gray-100">
            <div 
              className={`flex justify-between items-center text-sm px-2 py-1 rounded ${isCurrentUser ? 'hover:bg-gray-100 cursor-pointer' : ''}`}
              onClick={() => isCurrentUser && onNavigate && onNavigate('network')}
            >
              <span className="text-gray-500 font-medium">Connections</span>
              <span className="text-semi-700 font-bold">{user.connections}</span>
            </div>
          </div>

          {isCurrentUser && (
            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2 text-xs text-gray-600 hover:bg-gray-100 p-2 rounded cursor-pointer">
              <Bookmark className="w-4 h-4 text-gray-500" />
              <span className="font-semibold">My Items</span>
            </div>
          )}
        </div>
      </div>

      {isCurrentUser && (
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
